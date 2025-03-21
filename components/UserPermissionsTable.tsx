'use client'
import { User } from "@/lib/types";
import React, { useState } from "react";
import { Table, TableCell, TableHead, TableRow } from "./Table";
import Toggle from "./Toggle";
import { capitalizeFirstLetter } from "../lib/utils";
import UserPermissionsTableTopBar from "./UserPermissionsTableTopBar";

type Props = {
  user: User;
  managedUser: User
};

const UserPermissionsTable = ({ user, managedUser }: Props) => {

    const {...initialPermissions } = managedUser.permissions;
    const [permissions, setPermissions] = useState(initialPermissions);

    const togglePermission = (permissionKey: keyof typeof permissions) => {
      setPermissions(prev => ({...prev, [permissionKey]: !prev[permissionKey]}))
    }

  return (
    <>
    <UserPermissionsTableTopBar user={managedUser} />
    <div className="p-2 bg-surface rounded-lg border border-border">
      <Table>
        <TableHead>
          <TableCell className="flex-1 min-w-[200px]">Name</TableCell>
          <TableCell className="min-w-[65px] flex justify-center">
            Access
          </TableCell>
        </TableHead>

        {Object.entries(permissions).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell className="flex-1 min-w-[200px]">
              <p>{capitalizeFirstLetter(key.replace(/_/g, ' '))}</p>
            </TableCell>
            <TableCell className="min-w-[65px] flex justify-center">
              <Toggle onChange={() => togglePermission(key as keyof typeof permissions)} checked={value} disabled={managedUser.su || (key === 'can_manage_users' && !user.su)} />
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
    </>
  );
};

export default UserPermissionsTable;
