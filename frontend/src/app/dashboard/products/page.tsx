'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api'
import { ProductWithCategory, Category } from '@/types/database'
import ProductFilters from '@/components/ProductFilters'

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    featured: ''
  })

  // Debounced search to avoid too many API calls
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [filters.search])

  // Use debounced search in the effect
  useEffect(() => {
    fetchProducts()
  }, [debouncedSearch, filters.category, filters.featured])

  const fetchCategories = async () => {
    try {
      const data = await apiClient.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setError('Failed to load categories')
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      let data: ProductWithCategory[] = []

      // Use backend search if search query is provided
      if (debouncedSearch.trim()) {
        data = await apiClient.searchProducts(debouncedSearch.trim())
      } else {
        // Get all products for other filters
        data = await apiClient.getProducts()
      }

      // Apply client-side filtering for category and featured (since backend search doesn't support these yet)
      let filteredProducts = data

      // Category filter
      if (filters.category) {
        filteredProducts = filteredProducts.filter(product =>
          product.category_id === parseInt(filters.category)
        )
      }

      // Featured filter
      if (filters.featured) {
        const isFeatured = filters.featured === 'true'
        filteredProducts = filteredProducts.filter(product =>
          product.featured === isFeatured
        )
      }

      setProducts(filteredProducts)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError('Failed to load products. Please try again.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    setDeleting(id)
    try {
      await apiClient.deleteProduct(id)
      setProducts(products.filter(product => product.id !== id))
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product')
    } finally {
      setDeleting(null)
    }
  }

  const toggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      await apiClient.updateProduct(id, { featured: !currentFeatured })
      setProducts(products.map(product => 
        product.id === id ? { ...product, featured: !currentFeatured } : product
      ))
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('Failed to update product')
    }
  }

  // Memoize the filters change handler to prevent unnecessary re-renders
  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
  }, [])

  // Memoize categories to prevent unnecessary re-renders
  const memoizedCategories = useMemo(() => categories, [categories])

  // Show loading state
  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your product catalog ({products.length} products)
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/dashboard/products/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchProducts}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <ProductFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={memoizedCategories}
      />

      {/* Loading indicator for search */}
      {loading && products.length > 0 && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Searching...</span>
        </div>
      )}

      {/* Products Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {product.images && product.images.length > 0 ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={product.images[0]}
                                alt={product.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category?.name || 'No Category'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sku || 'No SKU'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleFeatured(product.id, product.featured)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.featured
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.featured ? '★ Featured' : '☆ Not Featured'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleting === product.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* No Results */}
      {products.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No products found</div>
          <div className="text-gray-400 text-sm mt-2">
            {debouncedSearch ? `No products match "${debouncedSearch}"` : 'Try adjusting your filters or add a new product'}
          </div>
        </div>
      )}
    </div>
  )
}
