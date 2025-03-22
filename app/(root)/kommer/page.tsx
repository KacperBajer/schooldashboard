import { getKommerUsers } from '@/lib/kommer'
import React from 'react'

const page = async ({ params, searchParams }: any) => {

    const {p} = await searchParams

    const kommerUsers = await getKommerUsers(Number(p) || 1)

  return (
    <div className='p-4 md:pl-0'>
        <p>D</p>
    </div>
  )
}

export default page