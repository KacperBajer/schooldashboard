import RadioMusicPlayer from "@/components/RadioMusicPlayer";
import RadioQueueBar from "@/components/RadioQueueBar";
import RadioSideBar from "@/components/RadioSideBar";
import { PlayerProvider } from "@/context/PlayerContext";
import { getAllPlaylists, getIPAddress, getSong } from "@/lib/radio";
import { startScheduler } from "@/lib/radioScheduler";
import React, { ReactNode } from "react";

const layout = async ({ children }: { children: ReactNode }) => {
  startScheduler();

  const playlists = await getAllPlaylists()

  return (
    <PlayerProvider player={1}>
      <div className="flex h-screen">
        <RadioSideBar initialPlaylists={playlists} />
        <div className="flex flex-1 flex-col h-screen">
          {children}
          <RadioMusicPlayer />
        </div>
        <RadioQueueBar />
      </div>
    </PlayerProvider>
  );
};

export default layout;
