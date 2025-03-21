'use client'
import React, { ButtonHTMLAttributes, ReactNode, useState } from 'react'
import Tooltip from './Tooltip'

type Tooltip = {
    isVisible: boolean
    text?: string
}

type Props = {
    children: ReactNode
    text: string
    customClass?: string
    bgColor?: string
    disabled?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const TooltipButton = ({children, text, customClass, bgColor, disabled = false, ...props}: Props) => {
    
    const [showTooltip, setShowTooltip] = useState<Tooltip>({
        isVisible: false,
        text: '',
    })

  return (
    <div className='relative'>
        <button 
            disabled={disabled} 
            {...props} 
            onMouseEnter={() => setShowTooltip({isVisible: true, text: text})} onMouseLeave={() => setShowTooltip({isVisible: false})} 
            className={`${bgColor || 'bg-surface'} ${disabled ? 'opacity-50' : 'hover:cursor-pointer'} transition-all duration-300 border border-border p-2.5 rounded-lg flex gap-1 items-center ${customClass}`}
        >
            {children}
        </button>
        {showTooltip.isVisible && <Tooltip text={showTooltip.text as string} />}
    </div>
  )
}

export default TooltipButton