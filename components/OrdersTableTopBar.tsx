'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { FaRegCircleCheck } from 'react-icons/fa6'
import TooltipButton from './TooltipButton'
import AddOrderPopup from './AddOrderPopup'
import { deleteOrders, markAsOrdered } from '@/lib/orders'
import { toast } from 'react-toastify'
import { User } from '@/lib/types'

type Props = {
    user: User
    selected: number[]
    setSelected: (e: number[]) => void
    handleMarkAsOrdered: (e: number[]) => void
}

const OrdersTableTopBar = ({ user, selected, setSelected, handleMarkAsOrdered }: Props) => {
    const [showAddOrderPopup, setShowAddOrderPopup] = useState(false)

    const handleDelete = async () => {
        const res = await deleteOrders(selected)
        if(res.status === 'error') {
            toast.error(res.error)
            return
        }
        setSelected([])
        toast.success("Deleted")
    }

    return (
        <>
            {showAddOrderPopup && <AddOrderPopup mode='add' handleClose={() => setShowAddOrderPopup(false)} />}
            <div className='w-full flex justify-between items-center mb-2'>
                <div className='flex items-center gap-1'>
                    {user.permissions.can_add_order && <button
                        className='bg-surface px-4 py-[7px] rounded-md border-border border hover:cursor-pointer'
                        onClick={() => setShowAddOrderPopup(true)}
                    >
                        Add
                    </button>}
                    {user.permissions.can_delete_order && <TooltipButton onClick={handleDelete} disabled={selected.length === 0} text='Delete item'>
                        <FaTrash className='text-red-600' />
                    </TooltipButton>}
                    {user.permissions.can_mark_order_as_ordered && <TooltipButton onClick={() => handleMarkAsOrdered(selected)} disabled={selected.length === 0} text='Mark ordered'>
                        <FaRegCircleCheck className='text-green-600' />
                    </TooltipButton>}
                </div>
                {user.permissions.can_see_order_history && <Link
                    href={'/orders/history'}
                    className='bg-surface px-4 py-[7px] rounded-md border-border border'
                >
                    History
                </Link>}
            </div>
        </>
    )
}

export default OrdersTableTopBar