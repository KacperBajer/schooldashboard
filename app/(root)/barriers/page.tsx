import BarriersTable from '@/components/BarriersTable'
import { getControllers } from '@/lib/barriers'
import React from 'react'

const page = async () => {

  const controllers = await getControllers()

  return (
    <div className='p-4 md:pl-0'>
      <BarriersTable barriers={controllers} />
    </div>
  )
}

export default page