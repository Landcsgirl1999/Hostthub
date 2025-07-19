'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  onAddressSelect?: (address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    fullAddress: string;
    lat?: number;
    lng?: number;
  }) => void;
}

interface GooglePlace {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Enter address...",
  className = "",
  required = false,
  disabled = false,
  onAddressSelect
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<GooglePlace[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load Google Places API
  useEffect(() => {
    const loadGooglePlacesAPI = () => {
      console.log('🔍 Loading Google Places API...');
      
      // Check for API key in multiple ways
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
                    (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.props?.pageProps?.googleMapsApiKey);
      
      console.log('API Key available:', !!apiKey);
      console.log('API Key length:', apiKey?.length || 0);
      console.log('API Key preview:', apiKey ? `${apiKey.substring(0, 10)}...` : 'none');
      
      if (window.google && window.google.maps) {
        console.log('✅ Google Maps already loaded');
        setGoogleLoaded(true);
        return;
      }

      if (!apiKey) {
        console.error('❌ No Google Maps API key found in environment variables');
        console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('GOOGLE')));
        console.log('All env vars:', Object.keys(process.env));
        
        // Try to load again after a short delay
        setTimeout(() => {
          console.log('🔄 Retrying to load Google Places API...');
          loadGooglePlacesAPI();
        }, 1000);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=console.debug&v=beta`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('✅ Google Places API loaded successfully');
        setGoogleLoaded(true);
      };
      script.onerror = (error) => {
        console.error('❌ Failed to load Google Places API:', error);
      };
      
      console.log('🔍 Adding script to document head...');
      document.head.appendChild(script);
    };

    // Add a small delay to ensure environment variables are loaded
    const timer = setTimeout(() => {
      if (!window.google) {
        loadGooglePlacesAPI();
      } else {
        console.log('✅ Google Maps already available');
        setGoogleLoaded(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAddressSuggestions = async (input: string) => {
    console.log('🔍 Getting address suggestions for:', input);
    console.log('Google loaded:', googleLoaded);
    
    // Check for API key in multiple ways
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
                  (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.props?.pageProps?.googleMapsApiKey);
    
    console.log('API Key available:', !!apiKey);
    
    if (!googleLoaded || !input.trim()) {
      console.log('❌ Google not loaded or input empty');
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!apiKey) {
      console.log('❌ No Google Maps API key found');
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔍 Creating AutocompleteService...');
      const service = new window.google.maps.places.AutocompleteService();
      const request = {
        input: input,
        types: ['address'],
        componentRestrictions: { country: 'us' } // Restrict to US addresses
      };

      console.log('🔍 Requesting predictions with:', request);
      service.getPlacePredictions(request, (predictions, status) => {
        console.log('📊 Predictions response:', { status, count: predictions?.length || 0 });
        setIsLoading(false);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          console.log('✅ Predictions received:', predictions.length);
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else {
          console.log('❌ No predictions or error status:', status);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      });
    } catch (error) {
      console.error('❌ Error fetching address suggestions:', error);
      setIsLoading(false);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.length >= 3) {
      getAddressSuggestions(newValue);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = async (suggestion: GooglePlace) => {
    if (!googleLoaded) return;

    try {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      service.getDetails(
        {
          placeId: suggestion.place_id,
          fields: ['address_components', 'formatted_address', 'geometry']
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const addressComponents = place.address_components || [];
            
            // Extract address components
            const street = addressComponents.find(comp => 
              comp.types.includes('street_number') || comp.types.includes('route')
            )?.long_name || '';
            
            const city = addressComponents.find(comp => 
              comp.types.includes('locality')
            )?.long_name || '';
            
            const state = addressComponents.find(comp => 
              comp.types.includes('administrative_area_level_1')
            )?.long_name || '';
            
            const zipCode = addressComponents.find(comp => 
              comp.types.includes('postal_code')
            )?.long_name || '';
            
            const country = addressComponents.find(comp => 
              comp.types.includes('country')
            )?.long_name || '';

            const fullAddress = place.formatted_address || suggestion.description;
            
            // Update the input value
            onChange(fullAddress);
            
            // Call the callback with structured address data
            if (onAddressSelect) {
              onAddressSelect({
                street: street,
                city: city,
                state: state,
                zipCode: zipCode,
                country: country,
                fullAddress: fullAddress,
                lat: place.geometry?.location?.lat(),
                lng: place.geometry?.location?.lng()
              });
            }
          }
        }
      );
    } catch (error) {
      console.error('Error getting place details:', error);
      // Fallback to just setting the description
      onChange(suggestion.description);
    }

    setShowSuggestions(false);
    setSuggestions([]);
  };

  const clearAddress = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        
        {value && !disabled && (
          <button
            type="button"
            onClick={clearAddress}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 text-center text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
            <span className="ml-2 text-sm">Searching addresses...</span>
          </div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start">
                <Search className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-sm text-gray-500">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && suggestions.length === 0 && !isLoading && value.length >= 3 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 text-center text-gray-500">
            No addresses found. Try a different search term.
          </div>
        </div>
      )}
    </div>
  );
}

// Add Google Maps types to window object
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => any;
          PlacesService: new (div: HTMLElement) => any;
          PlacesServiceStatus: {
            OK: string;
          };
        };
      };
    };
  }
} 