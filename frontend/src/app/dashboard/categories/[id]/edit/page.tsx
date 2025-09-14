'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CategoryForm from '@/components/CategoryForm'
import { apiClient } from '@/lib/api'
import { Category } from '@/types/database'

export default function EditCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const id = parseInt(params.id as string)
        if (isNaN(id)) {
          setError('Invalid category ID')
          return
        }
        
        const data = await apiClient.getCategory(id)
        setCategory(data)
      } catch (err: any) {
        setError('Category not found')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => router.push('/dashboard/categories')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Categories
        </button>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center">
        <div className="text-gray-600 mb-4">Category not found</div>
        <button
          onClick={() => router.push('/dashboard/categories')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Categories
        </button>
      </div>
    )
  }

  return <CategoryForm category={category} mode="edit" />
}
