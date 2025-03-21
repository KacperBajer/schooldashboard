'use client'
import React, { useState } from 'react'
import { Table, TableCell, TableHead, TableRow } from './Table'
import { OrderItem, User } from '@/lib/types'
import Link from 'next/link'
import { capitalizeFirstLetter, formatDate } from './utils'
import Checkbox from './Checkbox'
import useWebSocketConnectionHook from '@/hooks/useWebSocketConnectionHook'
import { reloadPath } from '@/lib/reloadPath'
import { usePathname } from 'next/navigation'
import OrdersTableTopBar from './OrdersTableTopBar'
import { IoMdMore } from "react-icons/io";
import MoreBoxOrder from './MoreBoxOrder'
import { markAsOrdered } from '@/lib/orders'
import { toast } from 'react-toastify'
import ConfirmActionPopup from './ConfirmActionPopup'
import AddOrderPopup from './AddOrderPopup'
import { showMoreBoxOrderPermissions, showOrderTopBarPermissions } from '@/lib/constants'

type Props = {
    orders: OrderItem[]
    user: User
}

const OrdersTable = ({ orders, user }: Props) => {

    const [selected, setSelected] = useState<number[]>([])
    const [showMoreBox, setShowMoreBox] = useState<OrderItem | null>(null)
    const [moreBoxPosition, setMoreBoxPosition] = useState<{ top: number; left: number } | null>(null);
    const [showConfirmPopup, setShowConfirmPopup] = useState<number[] | boolean>(false)
    const [showEditOrderPopup, setShowEditOrderPopup] = useState<OrderItem | boolean>(false)
    const path = usePathname()
    const isHistory = path === '/orders/history'

    useWebSocketConnectionHook(() => {
        reloadPath(path as string)
    }, "ORDERS_UPDATED");

    const handleSelectAllChange = () => {
        if (orders.length === selected.length) {
            setSelected([]);
        } else {
            const ids = orders.map(item => item.id)
            setSelected(prev => [...prev, ...ids.filter(item => !prev.includes(item))]);
        }
    };

    const handleMoreClick = (event: React.MouseEvent, item: OrderItem) => {
        const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
        setShowMoreBox(item);
        setMoreBoxPosition({ top: buttonRect.top + window.scrollY, left: buttonRect.left + window.scrollX - 160 });
    };

    const handleMarkAsOrdered = async (ids: number[]) => {
        const res = await markAsOrdered(ids)
        if (res.status === 'error') {
            toast.error(res.error)
            return
        }
        setSelected(prev => prev.filter(id => !ids.includes(id)))
        toast.success("Marked as ordered")
    }

    return (
        <>
            {showEditOrderPopup && <AddOrderPopup mode='edit' handleClose={() => setShowEditOrderPopup(false)} item={showEditOrderPopup as OrderItem} />}
            {showConfirmPopup && <ConfirmActionPopup handleClose={() => setShowConfirmPopup(false)} action={() => handleMarkAsOrdered(showConfirmPopup as number[])} name='mark as ordered' />}
            {showMoreBox && <MoreBoxOrder user={user} handleEdit={setShowEditOrderPopup} handleMarkAsOrdered={setShowConfirmPopup} item={showMoreBox} handleClose={() => setShowMoreBox(null)} selected={selected} setSelected={setSelected} position={moreBoxPosition as { top: number; left: number }} />}
            {!isHistory && showOrderTopBarPermissions(user) && <OrdersTableTopBar user={user} handleMarkAsOrdered={setShowConfirmPopup} setSelected={setSelected} selected={selected} />}
            <div className='p-2 bg-surface rounded-lg border border-border'>
                <Table>
                    <TableHead>
                        {!isHistory && showMoreBoxOrderPermissions(user) && <TableCell className='min-w-[30px]'>
                            <Checkbox handleChange={handleSelectAllChange} isChecked={selected.length === orders.length} />
                        </TableCell>}
                        <TableCell className='flex-1 min-w-[200px]'>
                            Name
                        </TableCell>
                        <TableCell className='min-w-[120px] flex justify-center'>
                            Cost/amount
                        </TableCell>
                        <TableCell className='min-w-[120px] flex justify-center'>
                            Amount
                        </TableCell>
                        <TableCell className='min-w-[120px] flex justify-center'>
                            Total cost
                        </TableCell>
                        <TableCell className='min-w-[150px] flex justify-center'>
                            Status
                        </TableCell>
                        {isHistory && <TableCell className='min-w-[150px]'>
                            <div className='w-full rounded-lg px-2 py-0.5 text-center'>Order date</div>
                        </TableCell>}
                        {!isHistory && (user.permissions.can_delete_order || user.permissions.can_edit_order || user.permissions.can_mark_order_as_ordered) && <TableCell className='min-w-[50px] flex justify-center'>
                            <IoMdMore className='text-base' />
                        </TableCell>}
                    </TableHead>

                    {orders.map((item, index) => (
                        <TableRow key={index}>
                            {!isHistory && (user.permissions.can_delete_order || user.permissions.can_mark_order_as_ordered) && <TableCell className='min-w-[30px]'>
                                <Checkbox handleChange={() => setSelected(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])} isChecked={selected.includes(item.id)} />
                            </TableCell>}
                            <TableCell className='flex-1 min-w-[200px]'>
                                <Link href={item.href} target="_blank">
                                    {capitalizeFirstLetter(item.name)}
                                </Link>
                            </TableCell>
                            <TableCell className='min-w-[120px]'>
                                <div className=' rounded-lg px-2 py-0.5 w-full text-center'>{item.cost} zł</div>
                            </TableCell>
                            <TableCell className='min-w-[120px] flex justify-center'>
                                <div className={`rounded-lg px-2 py-0.5 w-full text-center`}>{item.amount}</div>
                            </TableCell>
                            <TableCell className='min-w-[120px]'>
                                <div className={`rounded-lg px-2 py-0.5 w-full text-center`}>{item.amount * item.cost} zł</div>
                            </TableCell>
                            <TableCell className='min-w-[150px] flex justify-center'>
                                <div className={`${item.ordered ? 'bg-green-700' : 'bg-secondary-background'} w-fit rounded-lg px-4 py-0.5 text-center`}>{item.ordered ? `Ordered` : "Pending..."}</div>
                            </TableCell>
                            {isHistory && <TableCell className='min-w-[150px]'>
                                <div className='w-full rounded-lg px-2 py-0.5 text-center'>{formatDate(item.order_date as Date)}</div>
                            </TableCell>}
                            {!isHistory && showMoreBoxOrderPermissions(user) && <TableCell className='min-w-[50px] flex justify-center'>
                                <button onClick={(e) => handleMoreClick(e, item)} className='bg-primary-background rounded-md p-2 border border-border hover:cursor-pointer'>
                                    <IoMdMore />
                                </button>
                            </TableCell>}
                        </TableRow>
                    ))}
                </Table>
            </div>
        </>
    )
}

export default OrdersTable