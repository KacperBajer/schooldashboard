'use client'
import React, { useState } from "react";
import { Table, TableCell, TableHead, TableRow } from "./Table";
import { User } from "@/lib/types";
import Link from "next/link";
import { capitalizeFirstLetter, formatDate } from "../lib/utils";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import TooltipButton from "./TooltipButton";
import ConfirmActionPopup from "./ConfirmActionPopup";
import { deleteUser } from "@/lib/user";
import { toast } from "react-toastify";
import useWebSocketConnectionHook from "@/hooks/useWebSocketConnectionHook";
import { reloadPath } from "@/lib/reloadPath";

type Props = {
  users: User[];
  user: User;
};

const UsersTable = ({ users, user }: Props) => {
  
  const [showConfirmPopup, setShowConfirmPopup] = useState<boolean | number>(false)
  
  const handleDelete = async (id: number) => {
    const res = await deleteUser(id)
    if(res.status === 'error') {
      toast.error(res.error)
      return
    }
    toast.success('User deleted')
  }

  useWebSocketConnectionHook(() => {
    reloadPath('/users')
  }, "USERS_UPDATED");

  return (
    <>
    {showConfirmPopup && <ConfirmActionPopup handleClose={() => setShowConfirmPopup(false)} name="delete user" action={() => handleDelete(showConfirmPopup as number)} />}
    <div className="p-2 bg-surface rounded-lg border border-border">
      <Table>
        <TableHead>
          <TableCell className="flex-1 min-w-[200px]">Name</TableCell>
          <TableCell className="min-w-[300px] flex justify-center">
            Email
          </TableCell>
          <TableCell className="min-w-[150px] flex justify-center">
            Created at
          </TableCell>
          {user.permissions.can_manage_users && <TableCell className="min-w-[55px] flex justify-center">
            <FaTrash className="text-red-700" />
          </TableCell>}
        </TableHead>

        {users?.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="flex-1 min-w-[200px]">
              {user.permissions.can_manage_users ? (
                <Link
                  href={`/users/${item.id}`}
                  className="flex items-center gap-2"
                >
                  <Image
                    alt=""
                    src={item.avatar}
                    width={20}
                    height={20}
                    className="rounded-full w-5 h-5"
                  />
                  {capitalizeFirstLetter(item.username)}
                </Link>
              ) : (
                <div
                  className="flex items-center gap-2"
                >
                  <Image
                    alt=""
                    src={item.avatar}
                    width={20}
                    height={20}
                    className="rounded-full w-5 h-5"
                  />
                  {capitalizeFirstLetter(item.username)}
                </div>
              )}
            </TableCell>
            <TableCell className="min-w-[300px] flex justify-center">
              {item.email}
            </TableCell>
            <TableCell className="min-w-[150px] flex justify-center">
              <div className={`rounded-lg px-2 py-0.5 w-full text-center`}>
                {formatDate(item.created_at)}
              </div>
            </TableCell>
            {user.permissions.can_manage_users && <TableCell className="min-w-[55px] flex justify-center">
              <TooltipButton onClick={() => setShowConfirmPopup(item.id)} disabled={(user.id === item.id) || item.su || (!user.su && item.permissions.can_manage_users)} text="Delete user">
                <FaTrash className="text-red-700 text-sm" />
              </TooltipButton>
            </TableCell>}
          </TableRow>
        ))}
      </Table>
    </div>
    </>
  );
};

export default UsersTable;
