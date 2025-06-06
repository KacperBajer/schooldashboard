'use client'
import React, { useEffect, useState } from 'react'
import { Playlist } from '@/lib/types'
import SongCard from './SongCard'
import { IoIosMore } from "react-icons/io";
import Checkbox from './Checkbox';
import PlaylistMoreBox from './PlaylistMoreBox';
import AddSongToPlaylistPopup from './AddSongToPlaylistPopup';

type Props = {
    data: Playlist
    checked: number[]
    setChecked: React.Dispatch<React.SetStateAction<number[]>>
    fetchData: () => void
}

const PlaylistTable = ({data, checked, setChecked, fetchData}: Props) => {
    
    const [showMoreBox, setShowMoreBox] = useState<number | null>(null)
    const [moreBoxPosition, setMoreBoxPosition] = useState<{ top: number; left: number } | null>(null);
    const [showAddSongToPlaylistPopup, setShowAddSongToPlaylistPopup] = useState<number | boolean>(false)

    const handleSelectAllChange = () => {
        if (data.songs.length === checked.length) {
          setChecked([]);
        } else {
          const ids = data.songs.map(item => item.id)
          setChecked(prev => [...prev, ...ids.filter(item => !prev.includes(item))]);
        }
    };

      const handleMoreClick = (event: React.MouseEvent, id: number) => {
        const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
        setShowMoreBox(id);
        setMoreBoxPosition({ top: buttonRect.top + window.scrollY + 20, left: buttonRect.left + window.scrollX });
    };

    useEffect(() => {
        fetchData()
    }, [showMoreBox])

  return (
    <>
        {showAddSongToPlaylistPopup && <AddSongToPlaylistPopup handleClose={() => setShowAddSongToPlaylistPopup(false)} songs={[showAddSongToPlaylistPopup as number]} />}
        {showMoreBox && <PlaylistMoreBox setChecked={setChecked} playlist={data} addToAnotherPlaylists={setShowAddSongToPlaylistPopup} id={showMoreBox} handleClose={() => setShowMoreBox(null)} position={moreBoxPosition as { top: number; left: number }} />}
        <div className='overflow-x-auto'>
            <div className='flex flex-col'>
                <div className='sticky top-0 flex items-center pb-2 border-b-2 border-border text-gray-300 text-sm px-4'>
                    <Checkbox handleChange={handleSelectAllChange} isChecked={data.songs.length === checked.length} />
                    <p className='text-center w-[50px]'>#</p>
                    <p className='flex-1'>Song</p>
                    <IoIosMore className='text-lg text-gray-300' />
                </div>
                {data.songs.map((item, index) => (
                    <div className='flex items-center py-2 px-4 border-b-2 border-border' key={item.id}>
                        <Checkbox isChecked={checked.includes(item.id)} handleChange={() => setChecked(prev => prev.includes(item.id) ? prev.filter(songid => songid !== item.id) : [...prev, item.id])} />
                        <p className='text-center w-[50px]'>{index + 1}</p>
                        <div className='flex-1'>
                            <SongCard song={item} />
                        </div>
                        <button onClick={(e) => handleMoreClick(e, item.id)} className='hover:cursor-pointer group'>
                            <IoIosMore className='text-lg text-gray-300 group-hover:text-white transition-all duration-200' />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </>
  )
}

export default PlaylistTable