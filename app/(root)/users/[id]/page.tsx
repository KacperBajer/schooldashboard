import UserPermissionsTable from "@/components/UserPermissionsTable";
import { getUser, getUserById } from "@/lib/user";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params?: Promise<any> }) => {
  const user = await getUser()
  const { id } = await params;
  const managedUser = await getUserById(id);
  if (!user || !managedUser || !user.permissions.can_manage_users) redirect("/users");

  return (
    <div className="py-4 pr-4">
      <UserPermissionsTable user={user} managedUser={managedUser} />
    </div>
  );
};

export default page;
