export const formatDuration = (durationMillis: number) => {
  if (!durationMillis || durationMillis === 0) {
    return '00:00'
  }

  const totalSeconds = Math.floor(durationMillis / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
