/**
 * Utility functions per gestire URL media sicure
 */

/**
 * Estrae la chiave S3 da un URL proxy sicuro
 * Supporta sia le vecchie URL Amazon che le nuove URL proxy
 *
 * @param url URL da cui estrarre la chiave S3
 * @returns Chiave S3 o null se non trovata
 *
 * @example
 * // URL proxy sicura
 * extractS3KeyFromUrl('http://localhost:3001/secure-media/venue/1/photos/123_image.jpg')
 * // Returns: 'venues/1/photos/123_image.jpg'
 *
 * // URL Amazon (fallback)
 * extractS3KeyFromUrl('https://bucket.s3.amazonaws.com/venues/1/photos/123_image.jpg?X-Amz-...')
 * // Returns: 'venues/1/photos/123_image.jpg'
 */
export function extractS3KeyFromUrl(url: string): string | null {
  if (!url) return null;

  // Prova prima con URL proxy sicure (nuovo formato)
  const proxyMatch = url.match(/\/secure-media\/(.+)$/);
  if (proxyMatch) {
    const pathParts = proxyMatch[1];

    // Converti il path del proxy nella chiave S3 effettiva
    if (pathParts.startsWith("venue/")) {
      // venue/1/logo/filename.jpg -> venues/1/logo/filename.jpg
      // venue/1/photos/filename.jpg -> venues/1/photos/filename.jpg
      return pathParts.replace("venue/", "venues/");
    }

    if (pathParts.startsWith("package/")) {
      // package/1/photos/filename.jpg -> packages/1/photos/filename.jpg
      return pathParts.replace("package/", "packages/");
    }

    if (pathParts.startsWith("user/")) {
      // user/1/avatar/filename.jpg -> host/1/profile/avatar/filename.jpg
      const parts = pathParts.split("/");
      if (parts.length >= 3 && parts[2] === "avatar") {
        return `host/${parts[1]}/profile/avatar/${parts.slice(3).join("/")}`;
      }
    }
  }

  // Fallback: prova con URL Amazon S3 (formato vecchio)
  const amazonMatch = url.match(/\.amazonaws\.com\/(.+?)(\?|$)/);
  if (amazonMatch) {
    return amazonMatch[1];
  }

  return null;
}

/**
 * Verifica se un URL è una URL proxy sicura
 */
export function isSecureProxyUrl(url: string): boolean {
  return url.includes("/secure-media/");
}

/**
 * Verifica se un URL è una signed URL Amazon
 */
export function isAmazonSignedUrl(url: string): boolean {
  return url.includes("amazonaws.com") && url.includes("X-Amz-");
}
