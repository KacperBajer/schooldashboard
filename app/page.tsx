import { redirectPath } from '@/lib/utils'
import { getUser } from '@/lib/user'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const user = await getUser()
  if(!user) redirect('/sign-in') 
  redirectPath(user.permissions)
  
  return (
    <div>
      
    </div>
  )
}

export default page