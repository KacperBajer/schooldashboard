"use client";
import React, { useState } from "react";
import AddUserPopup from "./AddUserPopup";

const UserTableTopBar = () => {
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);

  return (
    <>
      {showAddUserPopup && (
        <AddUserPopup handleClose={() => setShowAddUserPopup(false)} />
      )}
      <button onClick={() => setShowAddUserPopup(true)} className="px-4 py-1.5 mb-2 rounded-md bg-surface border border-border hover:cursor-pointer">
        Add user
      </button>
    </>
  );
};

export default UserTableTopBar;
