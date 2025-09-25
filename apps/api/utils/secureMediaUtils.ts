/**
 * Utility functions per generare URL proxy sicuri per media S3
 * Sostituisce le signed URL AWS per evitare esposizione credenziali
 */

// Helper per estrarre filename da S3 key
function extractFilenameFromS3Key(s3Key: string): string {
  return s3Key.split("/").pop() || "";
}

// Helper per estrarre venue ID da S3 key (format: venues/123/logo/file.jpg)
function extractVenueIdFromS3Key(s3Key: string): string {
  const parts = s3Key.split("/");
  if (parts[0] === "venues" && parts.length >= 2) {
    return parts[1];
  }
  return "";
}

// Helper per estrarre package ID da S3 key (format: packages/123/photos/file.jpg)
function extractPackageIdFromS3Key(s3Key: string): string {
  const parts = s3Key.split("/");
  if (parts[0] === "packages" && parts.length >= 2) {
    return parts[1];
  }
  return "";
}

// Helper per estrarre user ID da S3 key (format: host/123/profile/avatar/file.jpg)
function extractUserIdFromS3Key(s3Key: string): string {
  const parts = s3Key.split("/");
  if (parts[0] === "host" && parts.length >= 2) {
    return parts[1];
  }
  return "";
}

/**
 * Genera URL proxy sicuro per logo venue
 */
export function generateSecureVenueLogoUrl(
  s3Key: string,
  baseUrl?: string,
): string {
  const filename = extractFilenameFromS3Key(s3Key);
  const venueId = extractVenueIdFromS3Key(s3Key);

  if (!filename || !venueId) {
    throw new Error(`Invalid S3 key for venue logo: ${s3Key}`);
  }

  const base = baseUrl || process.env.API_HOST || "http://localhost:3001";
  return `${base}/secure-media/venue/${venueId}/logo/${filename}`;
}

/**
 * Genera URL proxy sicuro per foto venue
 */
export function generateSecureVenuePhotoUrl(
  s3Key: string,
  baseUrl?: string,
): string {
  const filename = extractFilenameFromS3Key(s3Key);
  const venueId = extractVenueIdFromS3Key(s3Key);

  if (!filename || !venueId) {
    throw new Error(`Invalid S3 key for venue photo: ${s3Key}`);
  }

  const base = baseUrl || process.env.API_HOST || "http://localhost:3001";
  return `${base}/secure-media/venue/${venueId}/photos/${filename}`;
}

/**
 * Genera URL proxy sicuro per foto pacchetto
 */
export function generateSecurePackagePhotoUrl(
  s3Key: string,
  baseUrl?: string,
): string {
  const filename = extractFilenameFromS3Key(s3Key);
  const packageId = extractPackageIdFromS3Key(s3Key);

  if (!filename || !packageId) {
    throw new Error(`Invalid S3 key for package photo: ${s3Key}`);
  }

  const base = baseUrl || process.env.API_HOST || "http://localhost:3001";
  return `${base}/secure-media/package/${packageId}/photos/${filename}`;
}

/**
 * Genera URL proxy sicuro per avatar utente
 */
export function generateSecureUserAvatarUrl(
  s3Key: string,
  baseUrl?: string,
): string {
  const filename = extractFilenameFromS3Key(s3Key);
  const userId = extractUserIdFromS3Key(s3Key);

  if (!filename || !userId) {
    throw new Error(`Invalid S3 key for user avatar: ${s3Key}`);
  }

  const base = baseUrl || process.env.API_HOST || "http://localhost:3001";
  return `${base}/secure-media/user/${userId}/avatar/${filename}`;
}

/**
 * Helper per determinare il tipo di media da S3 key
 */
export function getMediaTypeFromS3Key(
  s3Key: string,
): "venue-logo" | "venue-photo" | "package-photo" | "user-avatar" | "unknown" {
  const parts = s3Key.split("/");

  if (parts[0] === "venues" && parts[2] === "logo") {
    return "venue-logo";
  }

  if (parts[0] === "venues" && parts[2] === "photos") {
    return "venue-photo";
  }

  if (parts[0] === "packages" && parts[2] === "photos") {
    return "package-photo";
  }

  if (parts[0] === "host" && parts[2] === "profile" && parts[3] === "avatar") {
    return "user-avatar";
  }

  return "unknown";
}

/**
 * Genera URL proxy sicuro automaticamente in base al tipo di S3 key
 */
export function generateSecureMediaUrl(
  s3Key: string,
  baseUrl?: string,
): string {
  const mediaType = getMediaTypeFromS3Key(s3Key);

  switch (mediaType) {
    case "venue-logo":
      return generateSecureVenueLogoUrl(s3Key, baseUrl);
    case "venue-photo":
      return generateSecureVenuePhotoUrl(s3Key, baseUrl);
    case "package-photo":
      return generateSecurePackagePhotoUrl(s3Key, baseUrl);
    case "user-avatar":
      return generateSecureUserAvatarUrl(s3Key, baseUrl);
    default:
      throw new Error(`Unsupported S3 key format: ${s3Key}`);
  }
}
