/**
 * Math & Vector Utilities for Client-Side Face Recognition (128-d Descriptors)
 */

export interface EnrolledCandidate {
  id: string
  name: string
  phone: string
  photo_url?: string | null
  face_descriptor: number[]
  wage_rate_per_day: number
}

export interface MatchResult {
  worker: EnrolledCandidate | null
  distance: number
  status: 'auto_confirmed' | 'manual_review' | 'no_match'
  reason?: string
}

/**
 * Computes Euclidean Distance (L2 norm) between two 128-dimensional float vectors
 */
export function euclideanDistance(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 1.0 // Maximum default distance
  }
  let sumSq = 0
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i]
    sumSq += diff * diff
  }
  return Math.sqrt(sumSq)
}

/**
 * Finds the closest matching worker from enrolled site workers
 * Thresholds:
 * - distance < 0.50 -> auto_confirmed match
 * - distance 0.50 to 0.65 -> manual_review (borderline confidence)
 * - distance > 0.65 -> no_match
 */
export function findBestMatch(
  targetDescriptor: number[],
  candidates: EnrolledCandidate[],
  autoThreshold = 0.50,
  reviewThreshold = 0.65
): MatchResult {
  if (!candidates || candidates.length === 0) {
    return { worker: null, distance: 1.0, status: 'no_match', reason: 'No workers enrolled for this site' }
  }

  let bestCandidate: EnrolledCandidate | null = null
  let minDistance = 1.0

  for (const candidate of candidates) {
    const dist = euclideanDistance(targetDescriptor, candidate.face_descriptor)
    if (dist < minDistance) {
      minDistance = dist
      bestCandidate = candidate
    }
  }

  if (!bestCandidate || minDistance > reviewThreshold) {
    return { worker: null, distance: minDistance, status: 'no_match', reason: 'Unrecognized face' }
  }

  if (minDistance <= autoThreshold) {
    return { worker: bestCandidate, distance: minDistance, status: 'auto_confirmed' }
  }

  return {
    worker: bestCandidate,
    distance: minDistance,
    status: 'manual_review',
    reason: `Borderline match distance (${minDistance.toFixed(3)})`,
  }
}

/**
 * Anti-Spoofing / Liveness Check:
 * Compares facial landmark positions between two frames ~1s apart.
 * Requires measurable micro-movement (eyes, jaw, nose position shifts >= threshold)
 * to confirm live human presence instead of a static photo or digital screen.
 */
export interface Point2D {
  x: number
  y: number
}

export function checkLandmarkMovement(
  landmarks1: Point2D[],
  landmarks2: Point2D[],
  minVariance = 0.003
): { isLive: boolean; maxDelta: number; message: string } {
  if (!landmarks1 || !landmarks2 || landmarks1.length !== landmarks2.length) {
    return { isLive: false, maxDelta: 0, message: 'Invalid landmark frame data' }
  }

  let totalDelta = 0
  let maxDelta = 0

  for (let i = 0; i < landmarks1.length; i++) {
    const dx = Math.abs(landmarks1[i].x - landmarks2[i].x)
    const dy = Math.abs(landmarks1[i].y - landmarks2[i].y)
    const delta = Math.sqrt(dx * dx + dy * dy)
    totalDelta += delta
    if (delta > maxDelta) maxDelta = delta
  }

  const avgDelta = totalDelta / landmarks1.length

  // Live human face will have small natural micro-tremors, eye blinks, or head movements (> 0.002 avg delta)
  const isLive = avgDelta >= minVariance || maxDelta >= minVariance * 2.5

  return {
    isLive,
    maxDelta,
    message: isLive
      ? `Live face motion confirmed (delta: ${avgDelta.toFixed(4)})`
      : `Static photo detected / Liveness check failed (delta: ${avgDelta.toFixed(4)})`,
  }
}
