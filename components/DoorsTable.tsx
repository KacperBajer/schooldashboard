'use client'
import React from 'react'
import { Table, TableCell, TableHead, TableRow } from './Table'
import { Door } from '@/lib/types'
import { capitalizeFirstLetter } from '../lib/utils'
import useWebSocketConnectionHook from '@/hooks/useWebSocketConnectionHook'
import { reloadPath } from '@/lib/reloadPath'

type Props = {
  doors: Door[]
}

const DoorsTable = ({ doors }: Props) => {

  useWebSocketConnectionHook(() => {
    reloadPath('/doors')
  }, "DOORS_UPDATED");

  return (
    <div className='p-2 bg-surface rounded-lg border border-border'>
      <Table>

        <TableHead>
          <TableCell className='min-w-[130px]'>
            IP
          </TableCell>
          <TableCell className='flex-1 min-w-[200px]'>
            Name
          </TableCell>
          <TableCell className='min-w-[120px] flex justify-center'>
            Mode
          </TableCell>
          <TableCell className='min-w-[120px] flex justify-center'>
            Status
          </TableCell>
          <TableCell className='min-w-[120px] flex justify-center'>
            Connection
          </TableCell>
          <TableCell className='min-w-[120px] flex justify-center'>
            Lock
          </TableCell>
        </TableHead>

        {doors.map((item, index) => (
          <TableRow key={index}>
            <TableCell className='min-w-[130px]'>
              {item.ip_addr}
            </TableCell>
            <TableCell className='flex-1 min-w-[200px]'>
              {item.name}
            </TableCell>
            <TableCell className='min-w-[120px]'>
              <div className=' rounded-lg px-2 py-0.5 w-full text-center'>{item.mode}</div>
            </TableCell>
            <TableCell className='min-w-[120px] flex justify-center'>
              <div className={`${item.status === 'open' ? 'bg-green-700' : 'bg-red-800'} rounded-lg px-2 py-0.5 w-full text-center`}>{capitalizeFirstLetter(item.status)}</div>
            </TableCell>
            <TableCell className='min-w-[120px]'>
              <div className={` ${item.connection_status === 'connected' ? 'bg-green-700' : 'bg-red-800'} rounded-lg px-2 py-0.5 w-full text-center`}>{capitalizeFirstLetter(item.connection_status)}</div>
            </TableCell>
            <TableCell className='min-w-[120px]'>
              <div className='w-full bg-blue-800 hover:cursor-pointer select-none rounded-lg px-2 py-0.5 text-center'>Lock</div>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  )
}

export default DoorsTable