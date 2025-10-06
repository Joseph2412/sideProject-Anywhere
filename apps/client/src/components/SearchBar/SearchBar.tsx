"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  onSearch?: (city: string) => void;
  initialValue?: string;
}

export function SearchBar({ onSearch, initialValue = "" }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Naviga alla pagina venues con query parameter
      if (searchQuery.trim()) {
        router.push(`/venues?city=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        router.push('/venues');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        className="search-input"
        type="text"
        placeholder="Cerca una città, es. Torino, Milano, Roma..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit" className="search-button">
        Cerca
      </button>
    </form>
  );
}
