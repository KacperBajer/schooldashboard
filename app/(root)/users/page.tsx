import UsersTable from "@/components/UsersTable";
import UserTableTopBar from "@/components/UserTableTopBar";
import { getUser, getUsers } from "@/lib/user";
import React from "react";

const page = async () => {
  const users = await getUsers();
  const user = await getUser();
  if (!user) return;

  return (
    <div className="p-4 md:pl-0">
      {user.permissions.can_manage_users && <UserTableTopBar />}
      <UsersTable user={user} users={users} />
    </div>
  );
};

export default page;
