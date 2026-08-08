/**
 * Client-Side Face Recognition wrapper using face-api.js / @vladmandic/face-api
 * Runs 100% in the browser to extract 128-d floating point descriptors.
 */

let faceapiModule: typeof import('@vladmandic/face-api') | null = null
let modelsLoaded = false

/**
 * Dynamically imports face-api in client-side environment only
 */
export async function getFaceApi() {
  if (typeof window === 'undefined') return null
  if (!faceapiModule) {
    faceapiModule = await import('@vladmandic/face-api')
  }
  return faceapiModule
}

/**
 * Loads face-api neural network model weights from /models/ directory or CDN fallback
 */
export async function loadFaceModels(onProgress?: (msg: string) => void): Promise<boolean> {
  if (modelsLoaded) return true
  const faceapi = await getFaceApi()
  if (!faceapi) return false

  try {
    onProgress?.('Loading face detection models...')
    // Try local /models directory first, fallback to jsDelivr CDN if local files are missing
    const MODEL_URLS = ['/models', 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model']

    let loaded = false
    for (const modelPath of MODEL_URLS) {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
          faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
          faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
        ])
        loaded = true
        break
      } catch (err) {
        console.warn(`Failed loading models from ${modelPath}, trying next...`, err)
      }
    }

    if (!loaded) {
      throw new Error('Could not load face-api model weights')
    }

    modelsLoaded = true
    onProgress?.('Face recognition models ready')
    return true
  } catch (err) {
    console.error('Error loading face-api models:', err)
    onProgress?.('Error loading models')
    return false
  }
}

export interface DetectedFaceResult {
  descriptor: number[]
  landmarks: { x: number; y: number }[]
  box: { x: number; y: number; width: number; height: number }
  score: number
}

/**
 * Extracts 128-d descriptor vector & landmarks from an HTMLVideoElement or HTMLCanvasElement
 */
export async function extractFaceData(
  input: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement
): Promise<DetectedFaceResult | null> {
  const faceapi = await getFaceApi()
  if (!faceapi) return null

  if (!modelsLoaded) {
    const success = await loadFaceModels()
    if (!success) return null
  }

  try {
    const detection = await faceapi
      .detectSingleFace(input, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptor()

    if (!detection) return null

    const descriptorArray = Array.from(detection.descriptor)
    const landmarksArray = detection.landmarks.positions.map((p) => ({ x: p.x, y: p.y }))
    const box = {
      x: detection.detection.box.x,
      y: detection.detection.box.y,
      width: detection.detection.box.width,
      height: detection.detection.box.height,
    }

    return {
      descriptor: descriptorArray,
      landmarks: landmarksArray,
      box,
      score: detection.detection.score,
    }
  } catch (err) {
    console.error('Error extracting face data:', err)
    return null
  }
}
