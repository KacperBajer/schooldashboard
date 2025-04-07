'use client'
import useWebSocketConnectionHook from '@/hooks/useWebSocketConnectionHook';
import { reloadPath } from '@/lib/reloadPath';
import { Barrier } from '@/lib/types';
import React from 'react'
import { Table, TableCell, TableHead, TableRow } from './Table';
import { FaLink } from "react-icons/fa";
import TooltipButton from './TooltipButton';
import { getOpenLinkWithToken, openController } from '@/lib/barriers';
import { toast } from 'react-toastify';

type Props = {
  barriers: Barrier[]
}

const BarriersTable = ({barriers}: Props) => {

    useWebSocketConnectionHook(() => {
        reloadPath('/barriers')
    }, "BARRIERS_UPDATED");

    const handleOpen = async (id: number) => {
        const res = await openController(id)
        if(res.status === 'error') {
            toast.error(res.error)
            return
        }
        toast.success('Success')
    }

    const handleCopy = async (id: number) => {
        console.log('ff')
        const res = await getOpenLinkWithToken(id)
        if(res.status === 'error') {
          toast.error(res.error)
          return
        }
        console.log(res.url)
        navigator.clipboard.writeText(res.url as string)
        toast.success('Copied')
    }

  return (
    <div className='p-2 overflow-x-auto bg-surface rounded-lg border border-border'>
          <Table>
    
            <TableHead>
              <TableCell className='min-w-[100px] flex justify-center'>
                Open
              </TableCell>
              <TableCell className='flex-1 min-w-[200px]'>
                Name
              </TableCell>
              <TableCell className='min-w-[120px] flex justify-center'>
                IP
              </TableCell>
              <TableCell className='min-w-[120px] flex justify-center'>
                Connection
              </TableCell>
              <TableCell className='min-w-[60px] flex justify-center'>
                <FaLink className='text-sm' />
              </TableCell>
            </TableHead>
    
            {barriers.map((item, index) => (
              <TableRow key={index}>
                <TableCell className='min-w-[100px]'>
                    <button onClick={() => handleOpen(item.id)} className='w-full bg-secondary-background/50 hover:cursor-pointer select-none rounded-lg px-2 py-0.5 text-center'>Open</button>
                </TableCell>
                <TableCell className='flex-1 min-w-[200px]'>
                  {item.name}
                </TableCell>
                <TableCell className='min-w-[120px] flex justify-center'>
                    {item.ip}
                </TableCell>
                <TableCell className='min-w-[120px]'>
                  <div className={` ${item.connection ? 'bg-green-700' : 'bg-red-800'} rounded-lg px-2 py-0.5 w-full text-center`}>{item.connection ? 'Connected' : 'Disconnected'}</div>
                </TableCell>
                <TableCell className='min-w-[60px] flex justify-center'>
                  <TooltipButton onClick={() => handleCopy(item.id)} text='Get open link'>
                    <FaLink className='text-xs' />
                  </TooltipButton>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </div>
  )
}

export default BarriersTable