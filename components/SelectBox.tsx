'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FaSort } from "react-icons/fa";

export type selectboxOption = {
    id: number
    text: string
    value: string | number | null
}

type Props = {
    selected: string | number | null
    setSelected: (e: string) => void
    options: string[]
    customClass?: string
}

const SelectBox = ({selected, setSelected, options, customClass}: Props) => {
    
    const [isOpen, setIsOpen] = useState(false)
    const selectboxRef = useRef<HTMLDivElement>(null); 

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectboxRef.current && !selectboxRef.current.contains(event.target as Node)) {
                setIsOpen(false); 
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

  return (
    <div ref={selectboxRef} className='relative select-none'>
        <div onClick={() => setIsOpen(prev => !prev)} className={`rounded-lg w-full border text-sm border-border bg-primary-background flex items-center hover:cursor-pointer justify-between px-4 py-1.5 ${customClass}`}>
            <p>{selected}</p>
            <FaSort />
        </div>
        {isOpen && <div className='left-0 top-10 absolute z-10 p-2 bg-primary-background border border-border w-full rounded-xl '>
            {options?.map(item => <button onClick={() => {
                    setSelected(item)
                    setIsOpen(prev => !prev)
                }} key={item} className='px-4 py-2 text-left w-full hover:bg-secondary-background rounded-lg hover:cursor-pointer transition-colors duration-300'>{item}</button>)}
        </div>}
    </div>
  )
}

export default SelectBox