#!/usr/bin/env node
/**
 * Reel producer: storyboard -> Fish Audio voiceover (with word timings) ->
 * Midjourney keyframes and video (APIFrame) -> branded 1080×1920 reel.
 *
 *   npm run video -- production/<YYYY-MM-DD>-<slug>/video.json
 *   npm run video -- production/<story>/video.json --only voice
 *   npm run video -- production/<story>/video.json --scene 02-revenue --only images,video --force
 *   npm run video -- production/<story>/video.json --dry-run
 *
 * Every step skips what already exists in production/<story>/render/, so re-running
 * is cheap and never pays twice for the same generation. The look (frame, colors,
 * captions) comes from scripts/brand/style.mjs; see docs/video-production.md.
 *
 * Needs ffmpeg, plus Chrome/Brave/Chromium for number plates and frames.
 * Keys (in .env.local or the environment): FISH_AUDIO_API_KEY, FISH_AUDIO_VOICE_ID,
 * APIFRAME_API_KEY, and RUNWAYML_API_SECRET only for the Runway fallback.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { FRAME, MIDJOURNEY_STYLE } from '../brand/style.mjs'
import { speak } from './fish.mjs'
import * as apiframe from './apiframe.mjs'
import * as runway from './runway.mjs'
import { buildAss } from './captions.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const STEPS = ['voice', 'images', 'video', 'assemble']
const FPS = 30
const ENDCARD_SECONDS = 1.8
const { window: win } = FRAME

for (const file of ['.env.local', '.env']) {
  if (fs.existsSync(path.join(root, file))) process.loadEnvFile(path.join(root, file))
}

const args = process.argv.slice(2)
const opt = (name) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : undefined
}
const storyboardPath = args.find((a, i) => !a.startsWith('--') && !['--only', '--scene'].includes(args[i - 1]))
if (!storyboardPath) {
  console.error('Usage: npm run video -- production/<story>/video.json [--only voice,images,video,assemble] [--scene id] [--force] [--dry-run]')
  process.exit(1)
}
const only = opt('only') ? opt('only').split(',') : STEPS
const force = args.includes('--force')
const dryRun = args.includes('--dry-run')

const storyboard = JSON.parse(fs.readFileSync(path.resolve(storyboardPath), 'utf8'))
const storyDir = path.dirname(path.resolve(storyboardPath))
const renderDir = path.join(storyDir, 'render')
const scenes = storyboard.scenes.filter((s) => !opt('scene') || s.id === opt('scene'))
if (!scenes.length) throw new Error(`No scene with id ${opt('scene')}`)

const sceneDir = (scene) => {
  const dir = path.join(renderDir, scene.id)
  fs.mkdirSync(dir, { recursive: true })
  return dir
}
const file = (scene, name) => path.join(sceneDir(scene), name)
const exists = (p) => fs.existsSync(p) && !force
const log = (scene, message) => console.log(`[${scene.id}] ${message}`)
const run = (bin, argv) => execFileSync(bin, argv, { stdio: ['ignore', 'pipe', 'pipe'] })
const ffmpeg = (argv) => run('ffmpeg', ['-y', '-loglevel', 'error', ...argv])
const duration = (p) =>
  parseFloat(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).toString())

async function pool(items, limit, worker) {
  const queue = [...items]
  await Promise.all(
    Array.from({ length: Math.min(limit, queue.length) }, async () => {
      while (queue.length) await worker(queue.shift())
    })
  )
}

async function stepVoice() {
  const voice = storyboard.voice || {}
  for (const scene of scenes) {
    if (!scene.narration || exists(file(scene, 'voice.mp3'))) continue
    if (dryRun) {
      log(scene, `would voice ${scene.narration.split(/\s+/).length} words`)
      continue
    }
    log(scene, 'voicing with Fish Audio')
    const { audio, words } = await speak({
      text: scene.narration,
      voiceId: voice.voiceId,
      model: voice.model,
      speed: voice.speed ?? 1.25,
    })
    fs.writeFileSync(file(scene, 'voice.mp3'), audio)
    fs.writeFileSync(file(scene, 'words.json'), JSON.stringify(words, null, 2))
  }
}

const keyframe = (scene) => (scene.imageFile ? path.resolve(storyDir, scene.imageFile) : file(scene, 'keyframe.png'))

function midjourneyPrompt(scene) {
  const mj = storyboard.midjourney || {}
  const params = ['--style raw']
  if (mj.sref) params.push(`--sref ${mj.sref}`)
  if (mj.extraParams) params.push(mj.extraParams)
  return `${scene.imagePrompt}, ${MIDJOURNEY_STYLE} ${params.join(' ')}`
}

async function stepImages() {
  await pool(
    scenes.filter((s) => !s.imageFile),
    3,
    async (scene) => {
      const out = file(scene, 'keyframe.png')
      if (exists(out)) return
      const prompt = midjourneyPrompt(scene)
      if (dryRun) return log(scene, `would render: ${prompt}`)
      log(scene, 'rendering keyframe with Midjourney (APIFrame)')
      const { jobId, images } = await apiframe.generateImage({ prompt, aspectRatio: '3:4' })
      if (!images.length) throw new Error(`APIFrame job ${jobId} returned no images`)
      // Four candidates come back; a scene picks another with "imageIndex": 1-4
      const pick = images[Math.min(images.length, scene.imageIndex || 1) - 1]
      fs.writeFileSync(out, await apiframe.download(pick))
    }
  )
}

// The keyframe cropped to the 3:4 window, as a JPEG small enough for any upload
function windowJpeg(scene) {
  const out = file(scene, 'keyframe.jpg')
  ffmpeg([
    '-i',
    keyframe(scene),
    '-vf',
    `scale=${win.w}:${win.h}:force_original_aspect_ratio=increase,crop=${win.w}:${win.h}`,
    '-q:v',
    '3',
    out,
  ])
  return fs.readFileSync(out)
}

async function stepVideo() {
  const provider = storyboard.videoProvider || 'midjourney'
  await pool(scenes, 2, async (scene) => {
    const out = file(scene, 'clip.mp4')
    if (exists(out)) return
    if (!fs.existsSync(keyframe(scene))) return log(scene, 'skipped: no keyframe yet')
    const prompt = scene.motionPrompt || scene.imagePrompt
    if (dryRun) return log(scene, `would animate with ${provider}: ${prompt}`)
    log(scene, `animating with ${provider}`)
    if (provider === 'runway') {
      fs.writeFileSync(out, await runway.animate({ jpeg: windowJpeg(scene), prompt }))
      return
    }
    const startImage = await apiframe.upload(windowJpeg(scene), `${scene.id}.jpg`)
    const { jobId, videos } = await apiframe.generateVideo({
      startImage,
      prompt,
      motion: scene.motion || 'low',
    })
    if (!videos.length) throw new Error(`APIFrame job ${jobId} returned no video`)
    fs.writeFileSync(out, await apiframe.download(videos[0]))
  })
}

function brandAsset(kind) {
  const seed = storyboard.frameSeed || 1
  const out = path.join(root, `brand/video/frames/${kind}-${seed}.png`)
  if (!fs.existsSync(out)) {
    const extra = kind === 'endcard' ? ['--endcard'] : []
    run('node', [path.join(root, 'scripts/brand/render-frame.mjs'), '--seed', String(seed), ...extra])
  }
  return out
}

function plate(scene) {
  if (!scene.plate) return null
  const out = file(scene, 'plate.png')
  if (fs.existsSync(out) && !force) return out
  const { number, label, kicker, position } = scene.plate
  const argv = ['--number', number, '--out', out]
  if (label) argv.push('--label', label)
  if (kicker) argv.push('--kicker', kicker)
  if (position) argv.push('--position', position)
  run('node', [path.join(root, 'scripts/plates/render-plate.mjs'), ...argv])
  return out
}

// libass filter arguments need ':' and '\' escaped
const filterPath = (p) => p.replace(/\\/g, '/').replace(/:/g, '\\:')

function renderScene(scene, frame) {
  const clip = file(scene, 'clip.mp4')
  const voice = file(scene, 'voice.mp3')
  const hasVoice = fs.existsSync(voice)
  const clipSeconds = duration(clip)
  const seconds = scene.duration || (hasVoice ? duration(voice) + (storyboard.tailSeconds ?? 0.2) : clipSeconds)
  const hold = Math.max(0, seconds - clipSeconds)
  const zoom = scene.zoom ?? 0.06 // slow punch-in across the scene keeps the frame alive

  const inputs = ['-f', 'lavfi', '-i', `color=c=black:s=${FRAME.width}x${FRAME.height}:r=${FPS}:d=${seconds.toFixed(3)}`]
  inputs.push('-i', clip, '-loop', '1', '-i', frame)
  const platePng = plate(scene)
  if (platePng) inputs.push('-loop', '1', '-i', platePng)
  const audioIndex = platePng ? 4 : 3
  if (hasVoice) inputs.push('-i', voice)
  else inputs.push('-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000')

  let ass = null
  if (hasVoice && fs.existsSync(file(scene, 'words.json'))) {
    ass = file(scene, 'captions.ass')
    fs.writeFileSync(ass, buildAss(JSON.parse(fs.readFileSync(file(scene, 'words.json'), 'utf8'))))
  }

  const graph = [
    `[1:v]fps=${FPS},scale=${win.w}:${win.h}:force_original_aspect_ratio=increase,crop=${win.w}:${win.h},setsar=1,` +
      `tpad=stop_mode=clone:stop_duration=${hold.toFixed(3)},` +
      `scale=w='2*trunc(${win.w}*(1+${zoom}*t/${seconds.toFixed(3)})/2)':h='2*trunc(${win.h}*(1+${zoom}*t/${seconds.toFixed(3)})/2)':eval=frame,` +
      `crop=${win.w}:${win.h}[clip]`,
    `[0:v][clip]overlay=${win.x}:${win.y}[v0]`,
  ]
  let last = 'v0'
  if (platePng) {
    graph.push(`[3:v]format=rgba,fade=in:st=0.1:d=0.25:alpha=1[plate]`, `[${last}][plate]overlay=0:0[v1]`)
    last = 'v1'
  }
  graph.push(`[${last}][2:v]overlay=0:0${ass ? '[v2]' : '[v]'}`)
  if (ass) graph.push(`[v2]ass='${filterPath(ass)}':fontsdir='${filterPath(path.join(root, 'brand/video/fonts'))}'[v]`)
  graph.push(`[${audioIndex}:a]aresample=48000,aformat=channel_layouts=stereo,apad[a]`)

  const out = file(scene, 'segment.mp4')
  ffmpeg([...inputs, '-filter_complex', graph.join(';'), '-map', '[v]', '-map', '[a]', '-t', seconds.toFixed(3), ...encode(), out])
  return out
}

const encode = () => ['-r', String(FPS), '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000']

function renderEndcard() {
  const out = path.join(renderDir, 'endcard.mp4')
  ffmpeg([
    '-loop', '1', '-i', brandAsset('endcard'),
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
    '-filter_complex', `[0:v]fps=${FPS},format=yuv420p,fade=in:st=0:d=0.2[v]`,
    '-map', '[v]', '-map', '1:a', '-t', String(ENDCARD_SECONDS), ...encode(), out,
  ])
  return out
}

async function stepAssemble() {
  const all = storyboard.scenes
  const missing = all.filter((s) => !fs.existsSync(path.join(renderDir, s.id, 'clip.mp4')))
  if (missing.length) return console.log(`Cannot assemble yet, missing clips: ${missing.map((s) => s.id).join(', ')}`)
  if (dryRun) return console.log(`would assemble ${all.length} scenes + end card`)

  const frame = brandAsset('frame')
  const segments = all.map((scene) => {
    log(scene, 'rendering segment')
    return renderScene(scene, frame)
  })
  segments.push(renderEndcard())

  const list = path.join(renderDir, 'segments.txt')
  fs.writeFileSync(list, segments.map((s) => `file '${s}'`).join('\n'))
  const joined = path.join(renderDir, 'joined.mp4')
  ffmpeg(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', joined])

  // Optional music bed, then loudness to -14 LUFS, the level Instagram and TikTok play at
  const final = path.join(renderDir, `${path.basename(storyDir)}.mp4`)
  const music = storyboard.music && path.resolve(storyDir, storyboard.music.file)
  const audioIn = music ? ['-stream_loop', '-1', '-i', music] : []
  const mix = music
    ? `[1:a]volume=${storyboard.music.volume ?? 0.1}[m];[0:a][m]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]`
    : '[0:a]loudnorm=I=-14:TP=-1.5:LRA=11[a]'
  ffmpeg(['-i', joined, ...audioIn, '-filter_complex', mix, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', final])
  console.log(`\nReel: ${path.relative(process.cwd(), final)}`)
}

const steps = { voice: stepVoice, images: stepImages, video: stepVideo, assemble: stepAssemble }
for (const step of STEPS.filter((s) => only.includes(s))) {
  console.log(`\n== ${step} ==`)
  await steps[step]()
}
