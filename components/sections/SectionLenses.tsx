'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useLedgerStore } from '@/store/ledgerStore'

const lenses = [
  {
    id: 'staffing' as const,
    title: 'Staffing Agencies',
    description: 'Temporary solutions became permanent spending.',
    color: 'text-red-600',
    hoverColor: 'hover:text-red-700',
  },
  {
    id: 'consulting' as const,
    title: 'Consulting & Outsourcing',
    description: 'Work that once lived inside the public system moved outside it.',
    color: 'text-orange-600',
    hoverColor: 'hover:text-orange-700',
  },
  {
    id: 'healthcare' as const,
    title: 'Healthcare Delivery',
    description: 'Delivery shifted, even when access stayed public on paper.',
    color: 'text-purple-600',
    hoverColor: 'hover:text-purple-700',
  },
]

export default function SectionLenses() {
  const { activeLens, setActiveLens } = useLedgerStore()
  const lockedLensRef = useRef<string | null>(null)

  return (
    <section className="flex items-center justify-center px-4 sm:px-6 md:px-8 bg-gradient-to-b from-white to-slate-50 pt-8 pb-16 md:pb-24">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {lenses.map((lens, idx) => (
            <motion.div
              key={lens.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ 
                duration: 0.6, 
                delay: idx * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => {
                // Toggle lens: if already active, clear it; otherwise set it
                const newLens = activeLens === lens.id ? null : lens.id
                setActiveLens(newLens)
                lockedLensRef.current = newLens
              }}
              onMouseEnter={() => {
                // Only set on hover if no lens is locked
                if (lockedLensRef.current === null) {
                  setActiveLens(lens.id)
                }
              }}
              onMouseLeave={() => {
                // Only clear on mouse leave if no lens is locked
                if (lockedLensRef.current === null) {
                  setActiveLens(null)
                }
              }}
            >
              <h3 className={`text-2xl sm:text-3xl md:text-4xl font-light mb-3 sm:mb-4 ${lens.color} ${lens.hoverColor} transition-colors`}>
                {lens.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 font-light leading-relaxed">
                {lens.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
