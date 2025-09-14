'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api'

interface BulkActionsProps {
  selectedIds: number[]
  onSelectionChange: (ids: number[]) => void
  onRefresh: () => void
}

export default function BulkActions({ selectedIds, onSelectionChange, onRefresh }: BulkActionsProps) {
  const [loading, setLoading] = useState(false)

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return

    const confirmMessage = {
      delete: `Are you sure you want to delete ${selectedIds.length} products?`,
      feature: `Are you sure you want to feature ${selectedIds.length} products?`,
      unfeature: `Are you sure you want to unfeature ${selectedIds.length} products?`
    }

    if (!confirm(confirmMessage[action as keyof typeof confirmMessage])) {
      return
    }

    setLoading(true)
    try {
      await apiClient.request(`/api/products/bulk`, {
        method: 'POST',
        body: JSON.stringify({
          operation: action,
          product_ids: selectedIds
        })
      })
      
      onRefresh()
      onSelectionChange([])
    } catch (error) {
      console.error(`Failed to ${action} products:`, error)
      alert(`Failed to ${action} products`)
    } finally {
      setLoading(false)
    }
  }

  if (selectedIds.length === 0) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-blue-700">
          {selectedIds.length} product{selectedIds.length > 1 ? 's' : ''} selected
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleBulkAction('feature')}
            disabled={loading}
            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50"
          >
            Feature
          </button>
          <button
            onClick={() => handleBulkAction('unfeature')}
            disabled={loading}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Unfeature
          </button>
          <button
            onClick={() => handleBulkAction('delete')}
            disabled={loading}
            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
          >
            Delete
          </button>
          <button
            onClick={() => onSelectionChange([])}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
