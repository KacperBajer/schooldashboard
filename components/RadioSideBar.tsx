"use client";
import { Playlist } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { toast } from "react-toastify";
import Loading from "./Loading";
import { changePlaylistOrder, getAllPlaylists } from "@/lib/radio";
import ImportSongPopup from "./ImportSongPopup";
import AddPlaylistPopup from "./AddPlaylistPopup";
import useWebSocketConnectionHook from "@/hooks/useWebSocketConnectionHook";

type Props = {
  initialPlaylists: Playlist[] | null;
};

const RadioSideBar = ({ initialPlaylists }: Props) => {
  const path = usePathname();
  const [playlists, setPlaylists] = useState<null | Playlist[]>(
    initialPlaylists
  );
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);

  useWebSocketConnectionHook(async () => {
    const res = await getAllPlaylists()
    setPlaylists(res)
  }, "RADIO_PLAYLISTS_LIST_UPDATED");

  const handleOrderChange = async (list: Playlist[]) => {
    const changeOrder = await changePlaylistOrder(list as Playlist[]);
    if (changeOrder === "err") {
      toast.error("Something went wrong with changing the order of playlists");
    }
  };

  return (
    <>
      {showImportPopup && (
        <ImportSongPopup handleClose={() => setShowImportPopup(false)} />
      )}
      {showAddPlaylist && (
        <AddPlaylistPopup handleClose={() => setShowAddPlaylist(false)} />
      )}
      <div className="h-screen sticky top-0 left-0 w-[300px] min-w-[300px] max-w-[300px] py-4">
        <div className="min-h-[calc(100vh-32px)] max-h-[calc(100vh-32px)] h-[calc(100vh-32px)] bg-surface border border-border rounded-lg p-4 flex flex-col ">
          <p className="text-center text-3xl font-bold mb-6">Playlists</p>
          {!playlists && (
            <div className="w-full flex justify-center">
              <Loading />
            </div>
          )}
          {playlists && (
            <div className="overflow-y-auto hideScrollbar">
              <ReactSortable
                list={playlists}
                setList={(newState) => {
                  setPlaylists(newState);
                }}
                onEnd={(evt) => {
                  if (evt.newIndex !== evt.oldIndex) {
                    const reorderedPlaylists = [...playlists!];
                    const [movedItem] = reorderedPlaylists.splice(
                      evt.oldIndex!,
                      1
                    );
                    reorderedPlaylists.splice(evt.newIndex!, 0, movedItem);
                    handleOrderChange(reorderedPlaylists);
                  }
                }}
              >
                {playlists?.map((item) => (
                  <Link
                    href={`/radio/${item.id}`}
                    key={item.id}
                    className={`flex gap-2 p-2 my-1 items-center w-full select-none hover:bg-secondary-background/30 hover:cursor-pointer rounded-md ${
                      path === `/radio/${item.id}` &&
                      "bg-secondary-background/30"
                    }`}
                  >
                    <Image
                      alt=""
                      src={"/playka.png"}
                      height={48}
                      width={48}
                      className="rounded-md pointer-events-none"
                    />

                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </ReactSortable>
            </div>
          )}

          <div className="flex-1"></div>
          <button
            onClick={() => setShowAddPlaylist(true)}
            className="px-4 py-1.5 text-sm bg-secondary-background/50 hover:cursor-pointer hover:scale-105 duration-300 transition-all rounded-md mt-4 w-full"
          >
            New playlist
          </button>
          <button
            onClick={() => setShowImportPopup(true)}
            className="px-4 py-1.5 text-sm bg-blue-800 hover:scale-105 hover:cursor-pointer duration-300 transition-all rounded-md mt-2 w-full"
          >
            Import song
          </button>
        </div>
      </div>
    </>
  );
};

export default RadioSideBar;
