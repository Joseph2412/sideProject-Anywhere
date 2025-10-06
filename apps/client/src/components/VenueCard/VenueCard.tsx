"use client";

import Link from "next/link";
import { Venue } from "@/types";

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  const { id, name, address, description, logoURL, photos, services } = venue;
  
  // Usa il logo o la prima foto disponibile
  const imageUrl = logoURL || photos[0] || 'https://placehold.co/400x300/1a1a1a/ffffff?text=Venue';

  return (
    <Link href={`/venues/${id}`} className="venue-card">
      <div className="venue-card-image-container">
        <img 
          src={imageUrl} 
          alt={`Immagine di ${name}`} 
          className="venue-card-image"
        />
      </div>
      
      <div className="venue-card-content">
        <h3 className="venue-card-title">{name}</h3>
        <p className="venue-card-address">📍 {address}</p>
        
        {description && (
          <p className="venue-card-description">
            {description.length > 100 
              ? `${description.substring(0, 100)}...` 
              : description}
          </p>
        )}
        
        {services && services.length > 0 && (
          <div className="venue-card-services">
            {services.slice(0, 3).map((service, index) => (
              <span key={index} className="venue-card-service-tag">
                {service}
              </span>
            ))}
            {services.length > 3 && (
              <span className="venue-card-service-tag">
                +{services.length - 3}
              </span>
            )}
          </div>
        )}
        
        <button className="venue-card-button">
          Vedi dettagli →
        </button>
      </div>
    </Link>
  );
}
