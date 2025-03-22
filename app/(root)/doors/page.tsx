import DoorsTable from '@/components/DoorsTable'
import { getDoors } from '@/lib/doors'
import React from 'react'

const page = async () => {

  const doors = await getDoors()

  return (
    <div className='p-4 md:pl-0'>
      <DoorsTable doors={doors} />
    </div>
  )
}

export default page