/**
 * Runway image-to-video: the fallback when APIFrame/Midjourney is unavailable.
 * Set "videoProvider": "runway" in a storyboard. API: https://docs.dev.runwayml.com/api/
 */
const RUNWAY_BASE_URL = process.env.RUNWAYML_BASE_URL || 'https://api.dev.runwayml.com'
const POLL_INTERVAL_MS = 5000 // Runway asks clients not to poll a task more often than this
const TASK_TIMEOUT_MS = 15 * 60 * 1000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function request(method, endpoint, body, attempt = 0) {
  const key = process.env.RUNWAYML_API_SECRET
  if (!key) throw new Error('RUNWAYML_API_SECRET is not set')
  const res = await fetch(`${RUNWAY_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      'X-Runway-Version': '2024-11-06',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    await sleep(2000 * 2 ** attempt)
    return request(method, endpoint, body, attempt + 1)
  }
  if (!res.ok) throw new Error(`Runway ${method} ${endpoint} failed (${res.status}): ${await res.text()}`)
  return res.json()
}

// jpeg: Buffer under 5MB. Returns the clip as a Buffer.
export async function animate({ jpeg, prompt, duration = 5 }) {
  const { id } = await request('POST', '/v1/image_to_video', {
    model: 'gen4.5',
    promptImage: `data:image/jpeg;base64,${jpeg.toString('base64')}`,
    promptText: prompt,
    ratio: '832:1104', // closest Runway ratio to the 3:4 window
    duration,
  })
  const started = Date.now()
  while (Date.now() - started < TASK_TIMEOUT_MS) {
    const task = await request('GET', `/v1/tasks/${id}`)
    if (task.status === 'SUCCEEDED') {
      const res = await fetch(task.output[0])
      if (!res.ok) throw new Error(`Download failed (${res.status})`)
      return Buffer.from(await res.arrayBuffer())
    }
    if (task.status === 'FAILED' || task.status === 'CANCELLED') {
      throw new Error(`Runway task ${id} ${task.status}: ${task.failure || ''}`)
    }
    await sleep(POLL_INTERVAL_MS)
  }
  throw new Error(`Runway task ${id} timed out`)
}
