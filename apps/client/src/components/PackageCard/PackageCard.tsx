"use client";

import { Package } from "@/types";

interface PackageCardProps {
  package: Package;
  onBook?: (packageId: number) => void;
}

export function PackageCard({ package: pkg, onBook }: PackageCardProps) {
  const { id, name, description, type, capacity, squareMetres, photos, plans } = pkg;
  
  const imageUrl = photos[0] || 'https://placehold.co/400x300/1a1a1a/ffffff?text=Package';
  
  // Trova il prezzo minimo tra i piani
  const minPrice = plans.length > 0 
    ? Math.min(...plans.map(plan => plan.price))
    : null;

  return (
    <div className="package-card">
      <div className="package-card-image-container">
        <img 
          src={imageUrl} 
          alt={`Immagine di ${name}`} 
          className="package-card-image"
        />
        <span className="package-card-type-badge">{type}</span>
      </div>
      
      <div className="package-card-content">
        <h3 className="package-card-title">{name}</h3>
        
        {description && (
          <p className="package-card-description">{description}</p>
        )}
        
        <div className="package-card-details">
          {capacity && (
            <div className="package-card-detail">
              <span className="package-card-detail-icon">👥</span>
              <span>Fino a {capacity} persone</span>
            </div>
          )}
          {squareMetres && (
            <div className="package-card-detail">
              <span className="package-card-detail-icon">📏</span>
              <span>{squareMetres} m²</span>
            </div>
          )}
        </div>
        
        {plans.length > 0 && (
          <div className="package-card-plans">
            <h4 className="package-card-plans-title">Piani disponibili:</h4>
            <div className="package-card-plans-list">
              {plans.map((plan) => (
                <div key={plan.id} className="package-card-plan">
                  <span className="package-card-plan-name">{plan.name}</span>
                  <span className="package-card-plan-price">€{plan.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {minPrice !== null && (
          <div className="package-card-footer">
            <div className="package-card-price">
              <span className="package-card-price-label">A partire da</span>
              <span className="package-card-price-value">€{minPrice}</span>
            </div>
            {onBook && (
              <button 
                className="package-card-book-button"
                onClick={() => onBook(id)}
              >
                Prenota
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
