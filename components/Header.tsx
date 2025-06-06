"use client";
import { User } from "@/lib/types";
import React, { useEffect, useRef, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { SideBarContent } from "./SideBar";
import { MdClose } from "react-icons/md";
import AddSchoolIDCardPopup from "./AddSchoolIDCardPopup";

type Props = {
  user: User;
};

const Header = ({ user }: Props) => {
  const [showMenu, setShowMenu] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [showAddCardPopup, setShowAddCardPopup] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddCard = () => {
    setShowAddCardPopup(true)
    setShowMenu(false)
  }

  return (
    <>
    {showAddCardPopup && <AddSchoolIDCardPopup handleClose={() => setShowAddCardPopup(false)} />}
    <div className="md:hidden w-full px-4 py-2 flex justify-between items-center bg-surface border-b border-border">
      <p className="text-xl font-semibold">Dashboard</p>
      <IoMenu
        onClick={() => setShowMenu(true)}
        className="text-2xl hover:cursor-pointer"
      />
      {showMenu && (
        <div className="w-full flex justify-end z-30 fixed top-0 left-0 h-screen bg-black/30">
          <div ref={boxRef} className="h-screen max-h-screen overflow-y-auto relative bg-surface p-4 overflow-auto w-[300px] max-w-[300px] overflow-x-hidden border-l border-border flex flex-col">
            <button
              onClick={() => setShowMenu(false)}
              className="hover:cursor-pointer absolute top-1 right-1 p-1.5 rounded-md bg-secondary-background"
            >
              <MdClose className="" />
            </button>
            <SideBarContent showAddCardPopup={handleAddCard} handleClose={() => setShowMenu(false)} user={user} mode='header' />
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Header;
