/**
 * Fish Audio text-to-speech with word timestamps.
 *
 * Uses the streaming timestamp route so one call returns both the voiceover and
 * the timing of every word, which drives the word-by-word captions.
 * Docs: https://docs.fish.audio/api-reference/endpoint/openapi-v1/text-to-speech-stream-with-timestamps
 *
 * Delivery cues in [brackets] (S2 models) shape the read: "[excited] Nvidia just..."
 * and "[emphasis]" before the word to stress. They are spoken as direction, not words.
 */
const FISH_BASE_URL = process.env.FISH_AUDIO_BASE_URL || 'https://api.fish.audio'

export async function speak({ text, voiceId, model, speed = 1, language = 'en' }) {
  // Without a key in the environment, the request goes out bare: in a cloud
  // environment with network secrets, the proxy adds the credential itself
  const apiKey = process.env.FISH_AUDIO_API_KEY
  const headers = { 'Content-Type': 'application/json' }
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`
  const ttsModel = model || process.env.FISH_AUDIO_MODEL
  if (ttsModel) headers.model = ttsModel // the model is chosen by header, not body

  const body = { text, format: 'mp3', language, prosody: { speed } }
  const referenceId = voiceId || process.env.FISH_AUDIO_VOICE_ID
  if (referenceId) body.reference_id = referenceId

  const res = await fetch(`${FISH_BASE_URL}/v1/tts/stream/with-timestamp`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const detail = await res.text()
    if (res.status === 402) throw new Error(`Fish Audio: out of credits (402) ${detail}`)
    if (res.status === 401) throw new Error(`Fish Audio rejected the key (401): set FISH_AUDIO_API_KEY. ${detail}`)
    throw new Error(`Fish Audio TTS failed (${res.status}): ${detail}`)
  }

  // Server-sent events: concatenate every audio chunk; keep only the latest
  // alignment per text chunk, shifted onto the full audio's timeline
  const audio = []
  const alignments = new Map()
  for (const event of (await res.text()).split(/\r?\n\r?\n/)) {
    const data = event
      .split(/\r?\n/)
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim())
      .join('')
    if (!data || data === '[DONE]') continue
    const payload = JSON.parse(data)
    if (payload.audio_base64) audio.push(Buffer.from(payload.audio_base64, 'base64'))
    if (payload.alignment) {
      alignments.set(payload.chunk_seq ?? 0, {
        offset: payload.chunk_audio_offset_sec ?? 0,
        segments: payload.alignment.segments || [],
      })
    }
  }
  if (!audio.length) throw new Error('Fish Audio returned no audio')

  const words = [...alignments.entries()]
    .sort(([a], [b]) => a - b)
    .flatMap(([, { offset, segments }]) =>
      segments.map((s) => ({ text: s.text, start: s.start + offset, end: s.end + offset }))
    )
  return { audio: Buffer.concat(audio), words }
}
