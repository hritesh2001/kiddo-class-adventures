
/**
 * Determines the video MIME type from a source URL
 */
export const getVideoType = (url: string): string => {
  if (url.includes('.mp4')) return 'video/mp4';
  if (url.includes('.webm')) return 'video/webm';
  if (url.includes('.ogg')) return 'video/ogg';
  // Default to mp4 if unknown
  return 'video/mp4';
};
