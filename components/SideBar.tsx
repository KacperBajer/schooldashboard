'use client'
import { SideBarLinks } from '@/lib/constants'
import { deleteSession } from '@/lib/sessions';
import { User, UserPermissions } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { CiLogout } from "react-icons/ci";
import { IoCardOutline } from "react-icons/io5";

type Props = {
  user: User
}

const SideBar = ({ user }: Props) => {

  const path = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await deleteSession()
    router.push('/sign-in')
  }

  return (
    <div className='p-4 sticky h-screen'>
      <div className='bg-surface w-[250px] h-full rounded-lg border border-border p-4 flex flex-col'>
        <p className='text-3xl font-bold text-center'>DASHBOARD</p>
        <p className='text-center font-bold text-gray-500'>By Kacper Bajer</p>

        <div className='flex flex-col mt-20 gap-2 mb-4'>
          {SideBarLinks.map((item, index) => (
            user.permissions[`can_see_${item.name}_section` as keyof UserPermissions] ? <Link href={item.href} key={index} className={`flex w-full items-center gap-4 hover:bg-secondary-background/50 ${(path as string).startsWith(item.href) && 'bg-secondary-background'} rounded-md p-3 select-none text-gray-200 font-medium`}>
              {item.icon}
              <p className=''>{item.title}</p>
            </Link> : null
          ))}
          <button onClick={handleLogout} className='flex w-full items-center gap-4 hover:bg-red-800 rounded-md p-3 select-none text-gray-200 font-medium hover:cursor-pointer'>
            <CiLogout className='text-xl' />
            <p>Logout</p>
          </button>
          <div className='flex w-full items-center gap-4 bg-[#1A1A1A] rounded-md p-3 select-none text-gray-200 font-medium hover:cursor-pointer'>
            <IoCardOutline className='text-xl' />
            <p>Add card</p>
          </div>
        </div>

        <div className='w-[calc(100%+32px)] -translate-x-4 h-0.5 mt-auto bg-border mb-4'></div>

        <div className='w-full flex items-center p-2 rounded-md bg-secondary-background/50 gap-2'>
          <Image
            alt=''
            src={user.avatar}
            width={40}
            height={40}
            className='rounded-full w-10 h-10'
          />
          <div className='flex flex-col'>
            <p className='font-medium'>{user.username}</p>
            <p className='text-gray-400 text-xs'>{user.email}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SideBar