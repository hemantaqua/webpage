'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'
import { apiClient } from '@/lib/api'
import { ProductWithCategory } from '@/types/database'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<ProductWithCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const id = parseInt(params.id as string)
        if (isNaN(id)) {
          setError('Invalid product ID')
          return
        }
        
        const data = await apiClient.getProduct(id)
        setProduct(data)
      } catch (err: any) {
        setError('Product not found')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
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
          onClick={() => router.push('/dashboard/products')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Products
        </button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center">
        <div className="text-gray-600 mb-4">Product not found</div>
        <button
          onClick={() => router.push('/dashboard/products')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Products
        </button>
      </div>
    )
  }

  return <ProductForm product={product} mode="edit" />
}
