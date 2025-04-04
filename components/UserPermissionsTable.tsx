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
      setPermissions((prev) => {
        const newPermissions = { ...prev, [permissionKey]: !prev[permissionKey] };
        
        //orders
        if (permissionKey === "can_add_order" && !prev["can_add_order"]) newPermissions["can_see_orders_section"] = true;
        if (permissionKey === "can_delete_order" && !prev["can_delete_order"]) newPermissions["can_see_orders_section"] = true;
        if (permissionKey === "can_edit_order" && !prev["can_edit_order"]) newPermissions["can_see_orders_section"] = true;
        if (permissionKey === "can_mark_order_as_ordered" && !prev["can_mark_order_as_ordered"]) newPermissions["can_see_orders_section"] = true;
        if (permissionKey === "can_see_order_history" && !prev["can_see_order_history"]) newPermissions["can_see_orders_section"] = true;
        if (permissionKey === "can_see_orders_section" && prev["can_see_orders_section"]) {
          newPermissions["can_add_order"] = false;
          newPermissions["can_delete_order"] = false
          newPermissions["can_see_order_history"] = false
          newPermissions["can_edit_order"] = false
          newPermissions["can_mark_order_as_ordered"] = false
        }

        // users
        if (permissionKey === "can_manage_users" && !prev["can_manage_users"]) newPermissions["can_see_users_section"] = true;
        if (permissionKey === "can_see_users_section" && prev["can_see_users_section"]) newPermissions["can_manage_users"] = false

        
        return newPermissions;
      });
    };

  return (
    <>
    <UserPermissionsTableTopBar user={managedUser} permissions={permissions} />
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
