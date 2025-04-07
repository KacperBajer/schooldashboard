'use client'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
  text: string
}

const Tooltip = ({ text }: Props) => {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState<'top' | 'bottom'>('top')
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (show && tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      if (tooltipRect.top < 0) {
        setPosition('bottom')
      } else {
        setPosition('top')
      }
    }
  }, [show])

  if (!show) {
    return null
  }

  return (
    <div
      ref={tooltipRef}
      className={`absolute whitespace-nowrap left-1/2 -translate-x-1/2 z-[400] px-2 py-1 rounded-md border border-border text-gray-200 bg-surface text-[10px] ${
        position === 'top' ? 'top-0 -translate-y-[120%]' : 'bottom-0 translate-y-[120%]'
      }`}
    >
      <p>{text}</p>
    </div>
  )
}

export default Tooltip