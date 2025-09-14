'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Category, CategoryCreate, CategoryUpdate } from '@/types/database'
import { generateSlug } from '@/lib/utils'

interface CategoryFormProps {
  category?: Category
  mode: 'create' | 'edit'
}

export default function CategoryForm({ category, mode }: CategoryFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (category && mode === 'edit') {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || ''
      })
    }
  }, [category, mode])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = generateSlug(name)
    setFormData({ ...formData, name, slug })
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = generateSlug(e.target.value)
    setFormData({ ...formData, slug })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'create') {
        const createData: CategoryCreate = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || undefined
        }
        await apiClient.createCategory(createData)
      } else if (category) {
        const updateData: CategoryUpdate = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || undefined
        }
        await apiClient.updateCategory(category.id, updateData)
      }
      
      router.push('/dashboard/categories')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Create Category' : 'Edit Category'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {mode === 'create' 
            ? 'Add a new product category to your store'
            : 'Update the category information'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Category Name *
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
              placeholder="e.g., Irrigation Systems"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            The display name for this category
          </p>
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            URL Slug *
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={formData.slug}
              onChange={handleSlugChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="e.g., irrigation-systems"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            URL-friendly version of the name. Used in web addresses.
          </p>
        </div>

        <div>
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
              placeholder="Brief description of this category..."
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Optional description for this category
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/categories')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Create Category' : 'Update Category'}
          </button>
        </div>
      </form>
    </div>
  )
}
