import React, { InputHTMLAttributes } from 'react'

type Props = {
    name: string
    error?: string
    register: any
    customClass?: string
} & InputHTMLAttributes<HTMLInputElement>

const CustomInput = ({name, error, register, customClass, ...props}: Props) => {
  return (
    <div>
        <input 
            id={name}
            name={name}
            {...props}
            {...register(name, { required: true })}
            className={`w-full bg-primary-background rounded-md px-4 py-1.5 border border-border outline-none appearance-none ${customClass}`}
        />
        {error && <p className='ml-1 mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  )
}

export default CustomInput