"use client";
import { Playlist } from "@/lib/types";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { RiPlayListAddLine } from "react-icons/ri";
import { MdAddToQueue } from "react-icons/md";
import { toast } from "react-toastify";
import { IoSettingsSharp } from "react-icons/io5";
import Loading from "@/components/Loading";
import TooltipButton from "@/components/TooltipButton";
import { usePlayer } from "@/context/PlayerContext";
import { addToQueue, deleteFromPlaylist, getPlaylist } from "@/lib/radio";
import AddSongToPlaylistPopup from "@/components/AddSongToPlaylistPopup";
import PlaylistTable from "@/components/PlaylistTable";
import PlaylistSettingsPopup from "@/components/PlaylistSettingsPopup";

const page = () => {
  const [data, setData] = useState<Playlist | null>(null);
  const [checked, setChecked] = useState<number[]>([]);
  const [showPlaylistSettings, setShowPlaylistSettings] = useState(false);
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);
  const params = useParams();
  const playlist = params?.playlist as string | undefined;

  if (!playlist) {
    redirect("/radio/1");
  }
  const { player } = usePlayer();

  const fetchData = async () => {
    const res = await getPlaylist(playlist as string);
    if (!res) {
      redirect("/radio/1");
    }
    setData(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToQueue = async () => {
    const add = await addToQueue(checked, player);
    if (add === "err") {
      toast.error("Failed to add to queue");
      return;
    }
    toast.success("Added to queue");
  };


  const handleDeleteFromPlaylist = async () => {
    const add = await deleteFromPlaylist((data as Playlist).id, checked);
    if (add === "err") {
      toast.error("Failed to delete songs from playlist");
      return;
    }
    toast.success("Songs removed from playlist");
    fetchData();
    setChecked([]);
  };

  if (!data) {
    return (
      <div className="flex-1 flex flex-col p-4">
        <div className="bg-surface border border-border p-4 rounded-lg flex-1 flex justify-center items-center">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <>
      {showAddPlaylist && (
        <AddSongToPlaylistPopup
          songs={checked}
          handleClose={() => setShowAddPlaylist(false)}
        />
      )}
      {showPlaylistSettings && (
        <PlaylistSettingsPopup
          data={data}
          handleClose={() => setShowPlaylistSettings(false)}
        />
      )}
      <div className="flex-1 flex flex-col p-4">
        <div className="bg-surface border border-border p-4 rounded-lg flex-1 flex flex-col max-h-[calc(100vh-134px)]">
          <section className="pb-8 pt-4 flex justify-between items-end">
            <div className="flex gap-4 items-center">
              <Image
                alt=""
                src={"/playka.png"}
                width={48}
                height={48}
                className="w-20 h-20 rounded-md"
              />
              <div>
                <p className="text-xs text-gray-100">Playlist</p>
                <p className="font-bold text-lg my-1">{data.name}</p>
                <p className="text-xs text-gray-400">{data.description}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <TooltipButton
                onClick={handleDeleteFromPlaylist}
                text="Delete selected songs"
                disabled={data.isProtected || checked.length === 0}
                customClass={`${
                  (data.isProtected || checked.length < 1) && "opacity-60"
                }`}
              >
                <FaTrash className="text-red-700" />
              </TooltipButton>
              <TooltipButton
                text="Add selected songs to queue"
                onClick={handleAddToQueue}
                disabled={checked.length === 0}
                customClass={`${checked.length < 1 && "opacity-60"}`}
              >
                <MdAddToQueue className="text-green-500" />
              </TooltipButton>
              <TooltipButton
                text="Add selected songs to another playlist"
                onClick={() => setShowAddPlaylist(true)}
                disabled={checked.length === 0}
                customClass={`${checked.length < 1 && "opacity-60"}`}
              >
                <RiPlayListAddLine className="text-blue-600" />
              </TooltipButton>
              <TooltipButton
                text="Playlist settings"
                onClick={() => setShowPlaylistSettings(true)}
              >
                <IoSettingsSharp />
              </TooltipButton>
            </div>
          </section>

          <div className="overflow-y-auto hideScrollbar">
            {data && (
              <PlaylistTable
                fetchData={fetchData}
                checked={checked}
                setChecked={setChecked}
                data={data}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
