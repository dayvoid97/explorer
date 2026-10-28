/**
 * APIFrame client: Midjourney images and Midjourney video.
 *
 * Midjourney has no official API; APIFrame proxies it, and can be cut off
 * without warning. Request shapes follow the official @apiframe-ai/sdk (v2):
 * https://github.com/apiframe-ai/midjourney-api
 */
const APIFRAME_BASE_URL = process.env.APIFRAME_BASE_URL || 'https://api.apiframe.ai'
const POLL_INTERVAL_MS = 3000
const JOB_TIMEOUT_MS = 15 * 60 * 1000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function request(method, endpoint, { json, form } = {}, attempt = 0) {
  // Without a key in the environment, the request goes out bare: in a cloud
  // environment with network secrets, the proxy adds the credential itself
  const key = process.env.APIFRAME_API_KEY
  const headers = {}
  if (key) headers['X-API-Key'] = key
  if (json) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${APIFRAME_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: json ? JSON.stringify(json) : form,
  })
  // Back off on rate limits and transient server errors
  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    await sleep(2000 * 2 ** attempt)
    return request(method, endpoint, { json, form }, attempt + 1)
  }
  if (res.status === 401) throw new Error(`APIFrame rejected the key (401): set APIFRAME_API_KEY. ${await res.text()}`)
  if (!res.ok) {
    throw new Error(`APIFrame ${method} ${endpoint} failed (${res.status}): ${await res.text()}`)
  }
  return res.json()
}

async function waitForJob(jobId) {
  const started = Date.now()
  while (Date.now() - started < JOB_TIMEOUT_MS) {
    const job = await request('GET', `/v2/jobs/${jobId}`)
    if (job.status === 'COMPLETED') return job
    if (job.status === 'FAILED' || job.status === 'CANCELLED') {
      throw new Error(`APIFrame job ${jobId} ${job.status}: ${job.error || 'no reason given'}`)
    }
    await sleep(POLL_INTERVAL_MS)
  }
  throw new Error(`APIFrame job ${jobId} timed out`)
}

// Job results are model-specific and loosely typed, so collect every URL in them
function resultUrls(result) {
  if (typeof result === 'string') return /^https?:\/\//.test(result) ? [result] : []
  if (Array.isArray(result)) return result.flatMap(resultUrls)
  if (result && typeof result === 'object') return Object.values(result).flatMap(resultUrls)
  return []
}

// Midjourney returns four candidates per prompt
export async function generateImage({ prompt, aspectRatio }) {
  const { jobId } = await request('POST', '/v2/images/generate', {
    json: { model: 'midjourney', prompt, midjourneyParams: { aspect_ratio: aspectRatio } },
  })
  const job = await waitForJob(jobId)
  const result = job.result || {}
  const images = Array.isArray(result.images) && result.images.length ? result.images : resultUrls(result)
  return { jobId, images, creditCost: job.creditCost }
}

// start_image must be a URL, so local keyframes go through APIFrame's temporary CDN
export async function upload(data, filename) {
  const form = new FormData()
  form.append('file', new Blob([data]), filename)
  const { url } = await request('POST', '/v2/uploads', { form })
  return url
}

export async function generateVideo({ startImage, prompt, motion = 'low', resolution = 'hd' }) {
  const { jobId } = await request('POST', '/v2/videos/generate', {
    json: {
      model: 'midjourney-video',
      prompt,
      midjourneyVideoParams: { start_image: startImage, motion, resolution },
    },
  })
  const job = await waitForJob(jobId)
  const urls = resultUrls(job.result)
  const videos = urls.filter((url) => /\.(mp4|mov|webm)(\?|$)/i.test(url))
  return { jobId, videos: videos.length ? videos : urls, creditCost: job.creditCost }
}

export async function download(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`)
  return Buffer.from(await res.arrayBuffer())
}
