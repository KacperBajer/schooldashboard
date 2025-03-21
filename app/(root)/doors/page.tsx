import DoorsTable from '@/components/DoorsTable'
import { getDoors } from '@/lib/doors'
import React from 'react'

const page = async () => {

  const doors = await getDoors()

  return (
    <div className='py-4 pr-4'>
      <DoorsTable doors={doors} />
    </div>
  )
}

export default page