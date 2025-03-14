import SideBar from '@/components/SideBar'
import React, { ReactNode } from 'react'

const layout = ({children}: {children: ReactNode}) => {
  return (
    <div className='flex h-screen'>
      <SideBar />
      <div className='flex-1 h-screen flex flex-col overflow-auto'>
        {children}
      </div>
    </div>
  )
}

export default layout