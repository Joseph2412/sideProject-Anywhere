export function generateS3Key(params: {
  type: 'host' | 'venue' | 'package'; //Directory di Riferimento
  id: string | number; //Id Identificativo del Venue
  filename: string; //Nome File
  photoType?: 'avatar' | 'logo' | 'gallery'; //Tipologia di Foto
}) {
  const { type, id, filename, photoType } = params;

  switch (type) {
    case 'host':
      return `host/profile/${id}_avatar_${Date.now()}_${filename}`;

    case 'venue':
      if (photoType === 'logo') {
        return `venue/${id}/logo_${Date.now()}_${filename}`;
      }
      return `venue/${id}/photos/${Date.now()}_${filename}`;

    case 'package':
      return `package/${id}/photos/${Date.now()}_${filename}`;

    default:
      return `${type}/${id}/${Date.now()}_${filename}`;
  }
}
