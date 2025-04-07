import { User, UserPermissions } from "@/lib/types";
import { savePermissions } from "@/lib/user";
import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";

type Props = {
  user: User;
  permissions: UserPermissions
};

const UserPermissionsTableTopBar = ({ user, permissions }: Props) => {

  const handleSave = async () => {
    const res = await savePermissions(permissions, user)
    if(res.status === 'error') {
      toast.error(res.error)
      return
    }
    toast.success('Saved')
  }

  return (
    <section className="flex items-center justify-between mb-2">
      <div className="p-2 bg-surface rounded-lg border border-border flex w-fit">
        <Image
          alt=""
          src={user.avatar}
          width={20}
          height={20}
          className="w-5 h-5 rounded-full"
        />
        <p className="ml-2">
          {user.username}{" "}
          <span className="text-gray-600 ml-1">
            ({!user.su ? "Changeable" : "Unchangeable"})
          </span>
        </p>
      </div>
      {!user.su && <button
        onClick={handleSave}
        className={`py-2 px-5 bg-blue-700 rounded-lg border border-border flex w-fit hover:cursor-pointer`}
      >
        Save
      </button>}
    </section>
  );
};

export default UserPermissionsTableTopBar;
