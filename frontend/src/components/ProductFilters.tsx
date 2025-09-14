'use client'

import { memo } from 'react'

interface ProductFiltersProps {
  filters: {
    search: string
    category: string
    featured: string
  }
  onFiltersChange: (filters: {
    search: string
    category: string
    featured: string
  }) => void
  categories: Array<{ id: number; name: string }>
}

const ProductFilters = memo(function ProductFilters({ filters, onFiltersChange, categories }: ProductFiltersProps) {

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    onFiltersChange(newFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      featured: ''
    }
    onFiltersChange(clearedFilters)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
          <select
            value={filters.featured}
            onChange={(e) => handleFilterChange('featured', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Products</option>
            <option value="true">Featured Only</option>
            <option value="false">Not Featured</option>
          </select>
        </div>

      </div>

      {/* Clear Filters */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleClearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
})

export default ProductFilters
