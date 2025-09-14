'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { ProductWithCategory, ProductCreate, ProductUpdate, Category } from '@/types/database'
import { generateSlug } from '@/lib/utils'
import FileUpload from './FileUpload'

interface ProductFormProps {
  product?: ProductWithCategory
  mode: 'create' | 'edit'
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: 0,
    sku: '',
    featured: false,
    images: [] as string[],
    videos: [] as string[],
    available_variants: [] as string[]
  })
  const [variantInput, setVariantInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
    
    if (product && mode === 'edit') {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        category_id: product.category_id,
        sku: product.sku || '',
        featured: product.featured,
        images: product.images || [],
        videos: product.videos || [],
        available_variants: product.available_variants || []
      })
    }
  }, [product, mode])

  const fetchCategories = async () => {
    try {
      const data = await apiClient.getCategories()
      setCategories(data)
      if (data.length > 0 && !formData.category_id) {
        setFormData(prev => ({ ...prev, category_id: data[0].id }))
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = generateSlug(name)
    setFormData({ ...formData, name, slug })
  }

  const addVariant = () => {
    if (variantInput.trim() && !formData.available_variants.includes(variantInput.trim())) {
      setFormData({
        ...formData,
        available_variants: [...formData.available_variants, variantInput.trim()]
      })
      setVariantInput('')
    }
  }

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      available_variants: formData.available_variants.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'create') {
        const createData: ProductCreate = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || undefined,
          category_id: formData.category_id,
          sku: formData.sku || undefined,
          featured: formData.featured,
          images: formData.images,
          videos: formData.videos,
          available_variants: formData.available_variants
        }
        await apiClient.createProduct(createData)
      } else if (product) {
        const updateData: ProductUpdate = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || undefined,
          category_id: formData.category_id,
          sku: formData.sku || undefined,
          featured: formData.featured,
          images: formData.images,
          videos: formData.videos,
          available_variants: formData.available_variants
        }
        await apiClient.updateProduct(product.id, updateData)
      }
      
      router.push('/dashboard/products')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Create Product' : 'Edit Product'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {mode === 'create' 
            ? 'Add a new product to your catalog'
            : 'Update the product information'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., Drip Irrigation Kit"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The display name for this product. URL slug will be generated automatically.
              </p>
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <div className="mt-1">
                <select
                  id="category_id"
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value={0}>Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                SKU
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., DIK-001"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Detailed description of the product..."
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Featured Product
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Featured products are highlighted on the website
            </p>
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Media</h3>
          
          <div className="space-y-6">
            <FileUpload
              files={formData.images}
              onFilesChange={(images) => setFormData({ ...formData, images })}
              accept="image/*"
              maxFiles={10}
              label="Product Images"
              description="Upload product images (JPG, PNG, etc.)"
            />

            <FileUpload
              files={formData.videos}
              onFilesChange={(videos) => setFormData({ ...formData, videos })}
              accept="video/*"
              maxFiles={5}
              label="Product Videos"
              description="Upload product videos (MP4, MOV, etc.)"
            />
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available Variants</h3>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={variantInput}
                onChange={(e) => setVariantInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVariant())}
                className="flex-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g., Small, Medium, Large"
              />
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>

            {formData.available_variants.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.available_variants.map((variant, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {variant}
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/products')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
