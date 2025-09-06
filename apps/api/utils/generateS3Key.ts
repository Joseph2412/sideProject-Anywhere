export function generateS3Key(params: {
  type: 'avatar' | 'logo' | 'gallery'; //Tipologia di Foto
  entity?: 'venue' | 'package'; //Entità => da dove richiamo Immagini
  id: string | number; //Id Identificativo del tipo
  filename: string; //Nome File
}) {
  const { type, entity, id, filename } = params;

  switch (type) {
    case 'avatar':
      return `host/${id}/profile/avatar/${Date.now()}_${filename}`;

    case 'logo':
      return `venues/${id}/logo/${Date.now()}_${filename}`;

    case 'gallery':
      if (entity === 'package') {
        return `packages/${id}/photos/${Date.now()}_${filename}`;
      }
      //Se non package, allora venue
      return `venues/${id}/photos/${Date.now()}_${filename}`;

    default:
      return `${type}/${id}/${Date.now()}_${filename}`;
  }
}
