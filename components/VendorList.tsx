'use client'

import { useEffect, useState } from 'react'
import { useLedgerStore } from '@/store/ledgerStore'

interface Vendor {
  vendor_id: string
  name: string
  type: string
  category?: string
  yearly_payments: Record<string, number>
}

export default function VendorList() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const { setSelectedVendor } = useLedgerStore()

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const response = await fetch('/data/processed/vendors_master.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        
        if (Array.isArray(data)) {
          // Filter for for-profit vendors (check both 'type' and 'vendor_type' fields)
          const forProfit = data.filter((v: any) => {
            const type = v.type || v.vendor_type
            return type === 'for_profit'
          })
          
          console.log(`Found ${forProfit.length} for-profit vendors`)
          
          // Calculate totals
          const withTotals = forProfit.map((v: any) => {
            const yearly = v.yearly_payments || {}
            const total = Object.values(yearly).reduce((sum: number, amt: any) => sum + (amt || 0), 0)
            return { 
              ...v, 
              _total: total,
              name: v.name || v.vendor_name_normalized || 'Unknown'
            }
          })
          
          // Sort by total and take top 20
          withTotals.sort((a: any, b: any) => b._total - a._total)
          setVendors(withTotals.slice(0, 20))
        } else {
          console.error('Data is not an array:', typeof data)
        }
      } catch (error) {
        console.error('Failed to load vendors:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVendors()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 font-light">Loading vendors...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-2">
          Top For-Profit Vendors
        </h3>
        <p className="text-sm md:text-base text-gray-600 font-light">
          Click any vendor to see detailed payment information
        </p>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {vendors.map((vendor) => {
          const total = (vendor as any)._total || 0
          return (
            <button
              key={vendor.vendor_id}
              onClick={() => setSelectedVendor(vendor.vendor_id)}
              className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-light text-gray-900 text-base md:text-lg mb-1 truncate">
                    {vendor.name}
                  </p>
                  {vendor.category && (
                    <p className="text-xs md:text-sm text-gray-500 font-light capitalize">
                      {vendor.category.replace('_', ' ')}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-base md:text-lg font-light text-red-600">
                    {formatCurrency(total)}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {vendors.length === 0 && (
        <div className="text-center py-8 text-gray-500 font-light">
          No for-profit vendors found
        </div>
      )}
    </div>
  )
}
