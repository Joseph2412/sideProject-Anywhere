interface CoworkingCardProps {
  name: string;
  city: string;
  imageUrl: string;
}

export const CoworkingCard: React.FC<CoworkingCardProps> = ({
  name,
  city,
  imageUrl,
}) => (
  <div className="coworking-card">
    <img src={imageUrl} alt={`Immagine di ${name}`} className="card-image" />
    <div className="card-content">
      <h3 className="card-title">{name}</h3>
      <p className="card-city">{city}</p>
    </div>
  </div>
);
