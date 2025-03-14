import React, { ReactNode } from 'react'

type TableProps = {
  children: ReactNode
}

export const Table = ({children}: TableProps) => {
  return (
    <div className='flex flex-col text-gray-200'>
      {children}
    </div>
  )
}

type TableHeadProps = {
  children: ReactNode
}

export const TableHead = ({children}: TableHeadProps) => {
  return (
    <div className='flex text-xs text-gray-400 py-1.5 px-4 border-b border-border'>
      {children}
    </div>
  )
}

type TableRowProps = {
  children: ReactNode
}

export const TableRow = ({children}: TableRowProps) => {
  return (
    <div className='flex items-center px-4 py-2 border-b border-border'>
      {children}
    </div>
  )
}

type TableCellProps = {
  children: ReactNode
  className?: string
}

export const TableCell = ({children, className}: TableCellProps) => {
  return (
    <div className={`flex px-2 ${className}`}>
      {children}
    </div>
  )
}