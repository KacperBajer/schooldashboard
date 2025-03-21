'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa";
import { FaRegCircleCheck } from 'react-icons/fa6';
import { OrderItem, User } from '@/lib/types'
import { deleteOrders } from '@/lib/orders';

type Props = {
    user: User
    position: { top: number; left: number }
    handleClose: () => void
    item: OrderItem
    selected: number[]
    setSelected: (e: number[]) => void
    handleMarkAsOrdered: (e: number[]) => void
    handleEdit: (e: OrderItem) => void
}

const MoreBoxOrder = ({ user, position, handleClose, item, selected, setSelected, handleMarkAsOrdered, handleEdit }: Props) => {

    const boxRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
                handleClose()
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDelete = async (itemId: number) => {
        const res = await deleteOrders([itemId])
        if (res.status === 'error') {
            toast.error(res.error)
            return
        }
        setSelected(selected.filter(id => id !== item.id))
        toast.success("Deleted")
        handleClose()
    }

    return (
        <div className='fixed top-0 left-0 z-40 w-full h-screen'>
            <div ref={boxRef} style={{ top: position.top, left: position.left }} className='absolute p-1 bg-surface rounded-md border-2 flex flex-col gap-0.5 border-border w-fit text-xs text-gray-200'>
                {user.permissions.can_mark_order_as_ordered && <button onClick={() => {
                    handleMarkAsOrdered([item.id])
                    handleClose()
                }}  className='px-3 py-1.5 w-full text-left hover:cursor-pointer hover:bg-secondary-background/50 rounded-md hover:text-white transition-all duration-200 flex gap-2 items-center'>
                    <FaRegCircleCheck className='text-green-500 text-lg' />
                    <p>Mark as oredered</p>
                </button>}
                {user.permissions.can_edit_order && <button onClick={() => {
                    handleEdit(item)
                    handleClose()
                }} className='px-3 py-1.5 w-full text-left hover:cursor-pointer hover:bg-secondary-background/50 rounded-md hover:text-white transition-all duration-200 flex gap-2 items-center'>
                    <FaEdit className='text-blue-600 text-lg' />
                    <p>Edit</p>
                </button>}
                {user.permissions.can_delete_order && <button onClick={() => handleDelete(item.id)} className={`px-3 py-1.5 w-full text-left hover:bg-secondary-background/50 hover:cursor-pointer rounded-md hover:text-white transition-all duration-200 flex items-center gap-2`}>
                    <FaTrash className='text-red-700 text-sm mx-0.5' />
                    <p>Delete</p>
                </button>}
            </div>
        </div>
    )
}

export default MoreBoxOrder
