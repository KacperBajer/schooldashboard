import React from 'react'
import { Table, TableCell, TableHead, TableRow } from './Table'

const DoorsTable = () => {
  return (
    <div className='p-2 bg-surface rounded-lg border border-border'>
      <Table>

        <TableHead>
          <TableCell className='min-w-[75px]'>
            ID
          </TableCell>
          <TableCell className='flex-1 min-w-[300px]'>
            Name
          </TableCell>
          <TableCell className='min-w-[100px] flex justify-center'>
            Status
          </TableCell>
          <TableCell className='min-w-[100px] flex justify-center'>
            Lock
          </TableCell>
        </TableHead>
        
        <TableRow>
          <TableCell className='min-w-[75px]'>
            00001
          </TableCell>
          <TableCell className='flex-1 min-w-[300px]'>
            Drzwi 222
          </TableCell>
          <TableCell className='min-w-[100px] '>
            <div className='bg-green-700 rounded-lg px-2 py-0.5 w-full text-center'>Open</div>
          </TableCell>
          <TableCell className='min-w-[100px]'>
            <div className='w-full bg-blue-800 rounded-lg px-2 py-0.5 text-center'>Lock</div>
          </TableCell>
        </TableRow>
      </Table>
    </div>
  )
}

export default DoorsTable