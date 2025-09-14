'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AutoComplete, Input } from 'antd';
import { useGooglePlaces, GooglePrediction, PlaceResult } from '@repo/hooks';

interface AddressOption {
  value: string;
  label: React.ReactNode;
  placeId: string;
}

interface AddressAutocompleteProps {
  value?: string;
  onChange?: (value: string, place?: PlaceResult | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Cerca un indirizzo...',
  disabled = false,
}) => {
  const [options, setOptions] = useState<AddressOption[]>([]);
  const [searchValue, setSearchValue] = useState(value || '');
  const { searchPlaces, getPlaceDetails, loading } = useGooglePlaces();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  // Debounced search
  const handleSearch = async (searchText: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (!searchText || searchText.length < 3) {
        setOptions([]);
        return;
      }

      try {
        const predictions = await searchPlaces(searchText);
        const newOptions = predictions.map((prediction: GooglePrediction) => ({
          value: prediction.description,
          label: (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 500 }}>{prediction.structured_formatting.main_text}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {prediction.structured_formatting.secondary_text}
              </span>
            </div>
          ),
          placeId: prediction.place_id,
        }));
        setOptions(newOptions);
      } catch (err) {
        console.error('Errore nella ricerca degli indirizzi:', err);
        setOptions([]);
      }
    }, 300);
  };

  const handleSelect = async (selectedValue: string, option: AddressOption) => {
    setSearchValue(selectedValue);

    try {
      const placeDetails = await getPlaceDetails(option.placeId);
      onChange?.(selectedValue, placeDetails);
    } catch (err) {
      console.error('Errore nel recupero dettagli:', err);
      onChange?.(selectedValue);
    }

    setOptions([]);
  };

  const handleChange = (newValue: string) => {
    setSearchValue(newValue);
    handleSearch(newValue);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AutoComplete
      value={searchValue}
      options={options}
      onSearch={handleChange}
      onSelect={handleSelect}
      placeholder={placeholder}
      disabled={disabled}
      style={{ width: '100%' }}
      notFoundContent={loading ? 'Ricerca in corso...' : 'Nessun risultato'}
      filterOption={false}
    >
      <Input.Search loading={loading} placeholder={placeholder} disabled={disabled} />
    </AutoComplete>
  );
};
