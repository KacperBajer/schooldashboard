import SignInForm from '@/components/SignInForm'
import React from 'react'

const page = () => {
  return (
    <div className='border border-border p-4 rounded-md bg-surface flex items-center w-full h-screen sm:h-fit sm:w-[300px]'>
        <div className='flex flex-col'>
            <p className='text-center font-bold text-3xl'>Sign In</p>
            <p className='text-xs text-center text-gray-400 mt-2 mb-7'>Sign in to unlock full access to the dashboard and available features.</p>
            <SignInForm />
        </div>
    </div>
  )
}

export default page