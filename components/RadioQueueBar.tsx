'use client'
import { QueueSong, Song } from '@/lib/types'
import React, { useEffect, useRef, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { toast } from 'react-toastify'
import { FaTrash } from "react-icons/fa";
import { FaRandom } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import TooltipButton from './TooltipButton'
import { usePlayer } from '@/context/PlayerContext'
import { changeQueueOrder, deleteFromQueue, getQueue } from '@/lib/radio'
import SongCard from './SongCard'
import EventsPopup from './EventsPopup'
import useWebSocketConnectionHook from '@/hooks/useWebSocketConnectionHook'

const RadioQueueBar = () => {

    const [songs, setSongs] = useState<QueueSong[] | null>(null)
    const [showEventsPopup, setShowEventsPopup] = useState(false)
    const [isLoadingShuffling, setIsLoadingShuffling] = useState(false)
    const { player } = usePlayer()
    const playerRef = useRef(player)
    playerRef.current = player

    const fetchData = async () => {
        const res = await getQueue(playerRef.current)
        setSongs(res)
    }

    useEffect(() => {
        fetchData()
    }, [])

    useWebSocketConnectionHook(async () => {
        await fetchData()
      }, "RADIO_QUEUE_UPDATED");
    

    const changeOrder = async (data: Song[]) => {
        const res = await changeQueueOrder(data as QueueSong[])
        if (res === 'err') {
            toast.error('Failed to change order of queue')
            return
        }
    }

    const handleDelete = async (id: number) => {
        const res = await deleteFromQueue(id)
        if (res === 'err') {
            toast.error('Failed to delete from queue')
            return
        }
        toast.success('Deleted from queue')
    }

    const shuffleSongs = async (data: QueueSong[]) => {
        setIsLoadingShuffling(true)
        let shuffled = [...data];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        await changeOrder(shuffled)
        setIsLoadingShuffling(false)
    }

    return (
        <>
            {showEventsPopup && <EventsPopup handleClose={() => setShowEventsPopup(false)} />}
            <div className='h-screen sticky top-0 right-0 w-[300px] min-w-[300px] max-w-[300px] py-4 pr-4'>
                <div className='h-fit min-h-[calc(100vh-32px)] max-h-[calc(100vh-32px)] flex flex-col bg-surface border border-border rounded-lg p-5'>
                    <p className='text-center text-3xl font-bold mb-6'>Queue</p>
                    <div className='overflow-x-auto hideScrollbar'>
                        {songs && <ReactSortable list={songs as QueueSong[]} setList={(newState) => {
                            setSongs(newState)
                        }} onEnd={(evt) => {
                            if (evt.newIndex !== evt.oldIndex) {
                                const reorderedSongs = [...songs!];
                                const [movedItem] = reorderedSongs.splice(evt.oldIndex!, 1);
                                reorderedSongs.splice(evt.newIndex!, 0, movedItem);
                                changeOrder(reorderedSongs);
                            }
                        }} className='flex flex-col gap-0.5'>
                            {songs?.map((item, index) => (
                                <div key={index} className='p-2 hover:bg-dark-200/50 rounded-md relative hover:cursor-pointer select-none flex justify-between items-center group'>
                                    <SongCard
                                        song={item}
                                    />
                                    <button className='group-hover:opacity-100 hover:cursor-pointer p-2 bg-surface border border-border rounded-md z-10 absolute right-3 opacity-0' onClick={() => handleDelete(item.queue_id)}>
                                        <FaTrash className='text-sm text-red-600' />
                                    </button>
                                </div>
                            ))}
                        </ReactSortable>}
                    </div>
                    <div className='flex-1'></div>
                    <div className='pt-2 flex gap-2 items-center'>
                        <button onClick={() => setShowEventsPopup(true)} className='px-4 py-1.5 rounded-md outline-none appearance-none bg-secondary-background/30 font-bold hover:cursor-pointer w-full'>Events</button>
                        <TooltipButton disabled={!songs || isLoadingShuffling} onClick={() => shuffleSongs(songs as QueueSong[])} bgColor='bg-dark-200/50' text='Shuffle queue'>
                            <FaRandom />
                        </TooltipButton>
                        <TooltipButton text='Settings'>
                            <IoSettingsSharp />
                        </TooltipButton>
                    </div>
                </div>
            </div>
        </>

    )
}

export default RadioQueueBar