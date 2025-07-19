'use client';

import { useState, useEffect } from 'react';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Users, 
  Bed, 
  Bath, 
  Car, 
  Wifi, 
  X, 
  Upload,
  Camera,
  Trash2,
  Check
} from 'lucide-react';
import AddressAutocomplete from './AddressAutocomplete';

interface PropertyFormData {
  name: string;
  address: string;
  type: string;
  status: string;
  nightlyRate: number;
  occupancy: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  description: string;
  amenities: string[];
  photos: string[];
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface PropertyFormProps {
  property?: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyFormData) => void;
  isEditing?: boolean;
}

const PROPERTY_TYPES = [
  'House', 'Apartment', 'Condo', 'Cabin', 'Villa', 'Cottage', 'Townhouse', 'Loft', 'Studio', 'Other'
];

const PROPERTY_STATUSES = [
  'Active', 'Inactive', 'Maintenance', 'Draft', 'Pending Review'
];

const AMENITIES = [
  'WiFi', 'Kitchen', 'Washer/Dryer', 'Air Conditioning', 'Heating', 'TV', 'Pool', 'Hot Tub', 
  'Gym', 'Parking', 'Balcony', 'Garden', 'BBQ Grill', 'Fireplace', 'Dishwasher', 'Microwave',
  'Coffee Maker', 'Iron', 'Hair Dryer', 'Towels', 'Linens', 'Beach Access', 'Mountain View',
  'Ocean View', 'City View', 'Pet Friendly', 'Wheelchair Accessible', 'Elevator', 'Doorman'
];

export default function PropertyForm({ property, isOpen, onClose, onSubmit, isEditing = false }: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    address: '',
    type: 'House',
    status: 'Active',
    nightlyRate: 0,
    occupancy: 1,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 0,
    description: '',
    amenities: [],
    photos: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (property && isEditing) {
      setFormData({
        name: property.name || '',
        address: property.address || '',
        type: property.type || 'House',
        status: property.status || 'Active',
        nightlyRate: property.nightlyRate || 0,
        occupancy: property.occupancy || 1,
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        parkingSpaces: property.parkingSpaces || 0,
        description: property.description || '',
        amenities: property.amenities || [],
        photos: property.photos || [],
        latitude: property.latitude,
        longitude: property.longitude,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        country: property.country
      });
    }
  }, [property, isEditing]);

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressSelect = (addressData: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    fullAddress: string;
    lat?: number;
    lng?: number;
  }) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.fullAddress,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      country: addressData.country,
      latitude: addressData.lat,
      longitude: addressData.lng
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setPhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Upload to server
      const formData = new FormData();
      formData.append('photo', file);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/properties/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(prev => ({ ...prev, photos: [...prev.photos, result.photoUrl] }));
        console.log('✅ Photo uploaded successfully');
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
        setPhotoFile(null);
        setPhotoPreview('');
      }
    } catch (error) {
      console.error('❌ Photo upload error:', error);
      alert('Failed to upload photo. Please try again.');
      setPhotoFile(null);
      setPhotoPreview('');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handlePhotoRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Edit Property' : 'Add New Property'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Basic Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Type *
                      </label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {PROPERTY_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <AddressAutocomplete
                      value={formData.address}
                      onChange={(address) => handleInputChange('address', address)}
                      placeholder="Enter property address..."
                      onAddressSelect={handleAddressSelect}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {PROPERTY_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nightly Rate ($) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.nightlyRate}
                        onChange={(e) => handleInputChange('nightlyRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Users className="w-4 h-4 inline mr-1" />
                        Max Occupancy *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.occupancy}
                        onChange={(e) => handleInputChange('occupancy', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Bed className="w-4 h-4 inline mr-1" />
                        Bedrooms *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Bath className="w-4 h-4 inline mr-1" />
                        Bathrooms *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.5"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Car className="w-4 h-4 inline mr-1" />
                        Parking Spaces
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.parkingSpaces}
                        onChange={(e) => handleInputChange('parkingSpaces', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your property..."
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Wifi className="w-4 h-4 inline mr-1" />
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {AMENITIES.map((amenity) => (
                        <label key={amenity} className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Photos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Camera className="w-4 h-4 inline mr-1" />
                      Property Photos
                    </label>
                    
                    {/* Photo upload area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isUploading 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      onDrop={handlePhotoDrop}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {isUploading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="text-blue-600">Uploading...</span>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            Drag and drop photos here, or click to select
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                            className="hidden"
                            id="photo-upload"
                          />
                          <label
                            htmlFor="photo-upload"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                          >
                            Select Photos
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Photo previews */}
                    {formData.photos.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={photo}
                              alt={`Property photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => handlePhotoRemove(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {isEditing ? 'Update Property' : 'Create Property'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 