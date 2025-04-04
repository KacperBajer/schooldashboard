"use client";
import { SideBarLinks } from "@/lib/constants";
import { deleteSession } from "@/lib/sessions";
import { User, UserPermissions } from "@/lib/types";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { CiLogout } from "react-icons/ci";
import { BsPersonVcard } from "react-icons/bs";
import AddSchoolIDCardPopup from "./AddSchoolIDCardPopup";

type Props = {
  user: User;
  mode?: "header" | "sidebar";
  handleClose?: () => void;
  showAddCardPopup: () => void;
};

export const SideBarContent = ({
  user,
  mode = "sidebar",
  handleClose,
  showAddCardPopup,
}: Props) => {
  const path = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await deleteSession();
    router.push("/sign-in");
  };

  return (
    <>
      <p className="text-3xl font-bold text-center select-none">DASHBOARD</p>
      <p className="text-center font-bold text-gray-500 md:mb-20 mb-10 select-none">
        By Kacper Bajer
      </p>
      <section className="flex flex-col gap-2 mb-4">
        {SideBarLinks.map((item, index) =>
          user.permissions[
            `can_see_${item.name}_section` as keyof UserPermissions
          ] ? (
            <button
              onClick={() => {
                router.push(item.href);
                mode === "header" && (handleClose as () => void)();
              }}
              key={index}
              className={`flex w-full items-center gap-4 hover:bg-secondary-background/50 ${
                (path as string).startsWith(item.href) &&
                "bg-secondary-background"
              } rounded-md p-3 select-none text-gray-200 font-medium hover:cursor-pointer`}
            >
              {item.icon}
              <p className="">{item.title}</p>
            </button>
          ) : null
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-4 hover:bg-red-800 rounded-md p-3 select-none text-gray-200 font-medium hover:cursor-pointer"
        >
          <CiLogout className="text-xl" />
          <p>Logout</p>
        </button>
        {user.permissions["can_see_school-id_section"] && (
          <button onClick={showAddCardPopup} className="rounded-md p-3 select-none text-gray-200 font-medium` hover:cursor-pointer bg-secondary-background flex items-center gap-4">
            <BsPersonVcard className="text-xl" />
            School ID Card
          </button>
        )}
      </section>

      <div className="w-[calc(100%+32px)] -translate-x-4 h-0.5 mt-auto bg-border mb-4"></div>

      <section className="w-full flex items-center p-2 rounded-md bg-secondary-background/50 gap-2">
        <Image
          alt=""
          src={user.avatar}
          width={40}
          height={40}
          className="rounded-full w-10 h-10"
        />
        <div className="flex flex-col">
          <p className="font-medium">{user.username}</p>
          <p className="text-gray-400 text-xs">{user.email}</p>
        </div>
      </section>
    </>
  );
};

const SideBar = ({ user }: Props) => {
  const [showAddCardPopup, setShowAddCardPopup] = useState(false);

  return (
    <>
      {showAddCardPopup && <AddSchoolIDCardPopup handleClose={() => setShowAddCardPopup(false)} />}
      <div className="p-4 sticky h-screen hidden md:block">
        <div className="bg-surface w-[250px] h-full rounded-lg border border-border p-4 flex flex-col">
          <SideBarContent
            user={user}
            showAddCardPopup={() => setShowAddCardPopup(true)}
          />
        </div>
      </div>
    </>
  );
};

export default SideBar;
