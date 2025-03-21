import OrdersTable from '@/components/OrdersTable'
import { getOrders } from '@/lib/orders'
import { getUser } from '@/lib/user'
import React from 'react'

const page = async () => {

    const orders = await getOrders('ordered')
    const user = await getUser()
    if(!user) return

    return (
        <div className='py-4 pr-4'>
            <OrdersTable user={user} orders={orders} />
        </div>
    )
}

export default page