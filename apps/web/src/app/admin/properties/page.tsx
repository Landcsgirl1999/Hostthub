'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import Link from 'next/link';
import PropertyForm from '../../../components/PropertyForm';

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  status: string;
  nightlyRate: number;
  occupancy: number;
  lastUpdated: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchProperties = async () => {
      try {
        // const response = await fetch('/api/v1/properties');
        // const data = await response.json();
        // setProperties(data);
        setProperties([]); // Empty array for now
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || property.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-2">Manage your vacation rental properties</p>
        </div>
        <button 
          onClick={() => {
            setSelectedProperty(null);
            setShowPropertyForm(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-glow hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6 hover:shadow-glow transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                <p className="text-sm text-gray-600">{property.address}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                property.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {property.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{property.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nightly Rate:</span>
                <span className="font-medium">${property.nightlyRate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Occupancy:</span>
                <span className="font-medium">{property.occupancy} guests</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Updated: {property.lastUpdated}</span>
              <div className="flex space-x-2">
                <Link href={`/admin/properties/${property.id}/calendar`}>
                  <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="View Calendar">
                    <Calendar className="w-4 h-4" />
                  </button>
                </Link>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    setSelectedProperty(property);
                    setShowPropertyForm(true);
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" 
                  title="Edit Property"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Property">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Property Form Modal */}
      <PropertyForm
        property={selectedProperty}
        isOpen={showPropertyForm}
        onClose={() => {
          setShowPropertyForm(false);
          setSelectedProperty(null);
        }}
        onSubmit={async (formData) => {
          // TODO: Implement API call to create/update property
          console.log('Property form data:', formData);
          
          // For now, just close the form
          setShowPropertyForm(false);
          setSelectedProperty(null);
        }}
        isEditing={!!selectedProperty}
      />
    </div>
  );
} 