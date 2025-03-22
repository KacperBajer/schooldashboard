import Header from '@/components/Header';
import SideBar from '@/components/SideBar'
import { getUser } from '@/lib/user';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

export const dynamic = "force-dynamic";

const layout = async ({children}: {children: ReactNode}) => {

  const user = await getUser()
  if(!user) redirect('/sign-in')

  return (
    <div className='flex h-screen'>
      <SideBar user={user} />
      <div className='flex-1 h-screen flex flex-col overflow-auto'>
        <Header user={user} />
        {children}
      </div>
    </div>
  )
}

export default layout