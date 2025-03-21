import { redirectPath } from '@/components/utils';
import { getUser } from '@/lib/user';
import React, { ReactNode } from 'react'

export const dynamic = "force-dynamic";

const layout = async ({children}: {children: ReactNode}) => {

  const user = await getUser()
  if(user) redirectPath(user.permissions)

  return (
    <div className='h-screen flex w-full justify-center items-center'>
        {children}
    </div>
  )
}

export default layout