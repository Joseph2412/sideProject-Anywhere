import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AutoComplete } from 'antd';
import { GooglePlacesService, PlaceResult } from '../utils/googlePlaces';

/* eslint-disable @typescript-eslint/naming-convention */
interface GooglePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}
/* eslint-enable @typescript-eslint/naming-convention */

interface AddressAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onPlaceSelect?: (place: PlaceResult) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  hideAsterisk?: boolean;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Inserisci l'indirizzo",
  style,
  disabled = false,
  label,
  required = false,
  hideAsterisk = false,
}) => {
  const [options, setOptions] = useState<
    { value: string; label: React.ReactNode; placeId: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<React.ElementRef<typeof AutoComplete>>(null);
  const shouldRestoreFocus = useRef(false);

  const googlePlacesService = useRef(GooglePlacesService.getInstance());

  // Sincronizza il valore interno quando cambia il prop value
  useEffect(() => {
    setSearchValue(value || '');
  }, [value]);

  const initializeService = useCallback(async () => {
    try {
      await googlePlacesService.current.initialize();
    } catch (error) {
      console.error("Errore nell'inizializzazione di Google Places:", error);
    }
  }, []);

  useEffect(() => {
    initializeService();
  }, [initializeService]);

  // Ripristina il focus dopo che le opzioni sono state aggiornate
  useEffect(() => {
    if (shouldRestoreFocus.current && !loading && isFocused) {
      const timer = setTimeout(() => {
        if (inputRef.current?.focus) {
          inputRef.current.focus();
        }
      }, 0);
      shouldRestoreFocus.current = false;
      return () => clearTimeout(timer);
    }
  }, [loading, isFocused]);

  const handleSearch = async (searchText: string) => {
    if (!searchText || searchText.length < 3) {
      setOptions([]);
      return;
    }

    // Marca che dobbiamo ripristinare il focus
    shouldRestoreFocus.current = isFocused;
    setLoading(true);

    try {
      const predictions = await googlePlacesService.current.searchPlaces(searchText);
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
    } catch (error) {
      console.error('Errore nella ricerca degli indirizzi:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchDebounced = (searchText: string) => {
    // Aggiorna immediatamente il valore mostrato nell'input
    setSearchValue(searchText);
    onChange?.(searchText);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(searchText);
    }, 300);
  };

  const handleSelect = async (selectedValue: string, option: { placeId: string }) => {
    setSearchValue(selectedValue);
    onChange?.(selectedValue);

    if (onPlaceSelect && option.placeId) {
      try {
        const placeDetails = await googlePlacesService.current.getPlaceDetails(option.placeId);
        if (placeDetails) {
          onPlaceSelect(placeDetails);
        }
      } catch (error) {
        console.error('Errore nel recupero dei dettagli del luogo:', error);
      }
    }

    setOptions([]);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Ritarda la perdita del focus per permettere la selezione dalle opzioni
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  return (
    <div>
      {label && (
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
          {label}
          {required && !hideAsterisk && <span style={{ color: 'red' }}> *</span>}
        </label>
      )}
      <AutoComplete
        ref={inputRef}
        value={searchValue}
        options={options}
        onSearch={handleSearchDebounced}
        onSelect={handleSelect}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        style={style}
        placeholder={placeholder}
      ></AutoComplete>
    </div>
  );
};
