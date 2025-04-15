'use server'
import { nanoid } from 'nanoid'
import { cookies, headers } from "next/headers";
import { CurrentSong, Playlist, QueueSong, Song } from "./types";
import { Pool } from "pg";
import conn from "./db";

export async function getIPAddress() {

    const header = await headers()
    const cookieStore = await cookies()
    const id = cookieStore.get('id')
    const key = nanoid(10)

    if(!id) {
        cookieStore.set('id', key)
    }

    const ip = header.get("x-forwarded-for")
    
    return `${ip}${id ? id.value : key}`;
}

export const getSong = async (player: number) => {
    try {

        const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const query = `
            SELECT s.id, s.title, s.artist, s.src, s.duration, ps.is_playing, ps.currenttime, ps.playing_device
            FROM radio_playback ps
            JOIN radio_songs s ON ps.song_id = s.id
            WHERE ps.id = $1;
        `;

        const result = await (conn as Pool).query(
            query, [player]
        );

        if (result.rows.length < 1) {
            return 'err'
        }

        return {
            song: {
                id: result.rows[0].id,
                artist: result.rows[0].artist,
                src: result.rows[0].src,
                title: result.rows[0].title,
                duration: result.rows[0].duration
            },
            ip: result.rows[0].playing_device,
            currenttime: result.rows[0].currenttime,
            isplaying: result.rows[0].is_playing,
        } as CurrentSong
    } catch (error) {
        console.log(error)
        return 'err'
    }
}

export const setOnlineDevice = async (ip: string) => {
    try {

        const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const query = `
            INSERT INTO radio_onlinedevices (ip, last_online)
            VALUES ($1, NOW())
            ON CONFLICT (ip)
            DO UPDATE SET last_online = NOW();
        `;
        const result = await (conn as Pool).query(
            query, [ip]
        );
        return 'success'
    } catch (error) {
        console.log(error)
        return 'err'
    }
}

export const getOnlineDevices = async () => {
    try {

        const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return []

        const query = `
            SELECT ip, last_online
            FROM radio_onlinedevices
            WHERE last_online >= NOW() - INTERVAL '15 seconds';
        `;

        const result = await (conn as Pool).query(query, []);
        const onlineDevices = result.rows;

        const queryPlaybackDevices = `
            SELECT id, playing_device
            FROM radio_playback;
        `;

        const playbackDevicesResult = await (conn as Pool).query(queryPlaybackDevices, []);
        const playbackDevices = playbackDevicesResult.rows.map(row => ({ id: row.id, playingdevice: row.playing_device }));
        console.log(playbackDevices)

        const onlineIPs = onlineDevices.map(device => device.ip);
        const missingDevices = playbackDevices
            .filter(device => !onlineIPs.includes(device.playingdevice))
            .map(device => ({ ip: device.playingdevice, date: null }));

        const allDevices = [...onlineDevices, ...missingDevices];
        const uniqueDevices = Array.from(new Map(allDevices.map(device => [device.ip, device])).values());

        
        return {
            devices: uniqueDevices,
            playingDevices: playbackDevices
        };
    } catch (error) {
        console.log(error);
        return 'err';
    }
};

export const changePlayingDevice = async (ip: string, player: number) => {
    try {

        const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const query = `
            UPDATE radio_playback
            SET playing_device = $1
            WHERE id = $2`;

        const result = await (conn as Pool).query(
            query, [ip, player]
        );
        return 'success'
    } catch (error) {
        console.log(error)
        return 'err'
    }
}
export const changePlayingStatus = async (isPlaying: boolean, player: number) => {
    try {

                const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const query = `
            UPDATE radio_playback
            SET is_playing = $1
            WHERE id = $2`;

        const result = await (conn as Pool).query(
            query, [!isPlaying, player]
        );
        return 'success'
    } catch (error) {
        console.log(error)
        return 'err'
    }
}
export const getPlayers = async () => {
    try {
        const query = `SELECT * FROM radio_playback ORDER BY id ASC`
        const result = await (conn as Pool).query(query, []);
        return result.rows
    } catch (error) {
        return 'err'
    }
}
export const getQueue = async (player: number) => {
    try {
        const query = `SELECT 
                s.id AS id,
                s.title,
                s.artist,
                s.src,
                q.id AS queue_id,
                q.place
            FROM 
                radio_queue q
            JOIN 
                radio_songs s 
            ON 
                q.song_id = s.id
            WHERE q.player_id = $1
            ORDER BY 
                q.place ASC;
        `

        const result = await (conn as Pool).query(
            query, [player]
        );

        if (result.rows.length < 1) {
            return null
        }

        return result.rows
    } catch (error) {
        console.log(error)
        return null
    }
}

export const skipSong = async (player: number) => {
    try {

                const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const checkIsNextSongAvailableQuery = `SELECT * FROM radio_queue WHERE player_id = $1`
        const resultChecking = await (conn as Pool).query(
            checkIsNextSongAvailableQuery, [player]
        );
        if(resultChecking.rows.length < 1) {
            return 'err'
        }
        const playingQuery = 'SELECT song_id FROM radio_playback WHERE id = $1'
        const resultPlaying = await (conn as Pool).query(
            playingQuery, [player]
        );

        const historyQuery = `INSERT INTO radio_songshistory (song_id, player_id, date) VALUES ($1, $2, NOW())`
        await (conn as Pool).query(historyQuery, [resultPlaying.rows[0].song_id, player]);

        const insertPlaybackQuery = `
           UPDATE radio_playback
            SET song_id = (
                SELECT song_id
                FROM radio_queue
                WHERE player_id = $1
                ORDER BY place ASC
                LIMIT 1
            ), currenttime = 0, is_playing = true
            WHERE id = $1;
        `;

        await (conn as Pool).query(insertPlaybackQuery, [player]);

        const query = `
            DELETE FROM radio_queue
            WHERE id = (
                SELECT id
                FROM radio_queue
                WHERE player_id = $1
                ORDER BY place ASC
                LIMIT 1
            );
        `
        const result = await (conn as Pool).query(
            query, [player]
        );

        const updateQuery = `
            WITH updated_queue AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY place ASC) AS new_place
                FROM radio_queue
                WHERE player_id = $1
            )
            UPDATE radio_queue
            SET place = updated_queue.new_place
            FROM updated_queue
            WHERE radio_queue.id = updated_queue.id;
        `;

        const update = await (conn as Pool).query(
            updateQuery, [player]
        );

        const song = await getSong(player)
        return song
    } catch (error) {
        console.log(error)
        return 'err'
    }
}

export const addToQueue = async (songIds: number | number[], player: number) => {
    try {
        
                const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const songs = Array.isArray(songIds) ? songIds : [songIds];

        const maxPlaceQuery = `
            SELECT COALESCE(MAX(place), 0) AS max_place
            FROM radio_queue WHERE player_id = $1;
        `;
        const maxPlaceResult = await (conn as Pool).query(maxPlaceQuery, [player]);
        let maxPlace = parseInt(maxPlaceResult.rows[0]?.max_place) || 0;

        const insertQuery = `
            INSERT INTO radio_queue (song_id, place, player_id)
            VALUES ($1, $2, $3);
        `;

        for (const songId of songs) {
            maxPlace += 1;
            await (conn as Pool).query(insertQuery, [songId, maxPlace, player]);
        }

        return 'success';
    } catch (error) {
        console.error(error);
        return 'err';
    }
};
export const addToQueueFirst = async (songIds: number | number[], player: number) => {
    try {

                const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const songs = Array.isArray(songIds) ? songIds : [songIds];

        const shiftQuery = `
            UPDATE radio_queue
            SET place = place + $1
            WHERE player_id = $2;
        `

        await (conn as Pool).query(shiftQuery, [songs.length, player])

        const insertQuery = `
            INSERT INTO radio_queue (song_id, place, player_id)
            VALUES ($1, $2, $3);
        `

        let currentPlace = 1
        for (const songId of songs) {
            await (conn as Pool).query(insertQuery, [songId, currentPlace, player])
            currentPlace += 1
        }

        return 'success'
    } catch (error) {
        console.error(error);
        return 'err'
    }
};
export const getPlaylist = async (playlist: string) => {
    try {

        const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return null

        const playlistQuery = `
            SELECT 
                id,
                name, 
                description, 
                is_protected
            FROM 
                radio_playlists
            WHERE 
                id = $1;
        `;

        const songsQuery = `
            SELECT 
                s.id AS id,
                s.title,
                s.artist,
                s.src,
                s.duration
            FROM 
                radio_playlistssong ps
            JOIN 
                radio_songs s 
            ON 
                ps.song_id = s.id
            WHERE 
                ps.playlist_id = $1;
        `;

        const playlistResult = await (conn as Pool).query(playlistQuery, [playlist]);
        const songsResult = await (conn as Pool).query(songsQuery, [playlist]);

        if (playlistResult.rows.length === 0) {
            return null;
        }

        const playlistData = playlistResult.rows[0];

        return {
            id: playlistData.id,
            name: playlistData.name,
            description: playlistData.description,
            isProtected: playlistData.is_protected,
            songs: songsResult.rows
        } as Playlist;
    } catch (error) {
        console.log(error);
        return null;
    }
};


export const getAllPlaylists = async () => {
    try {

        const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return null

        const query = `
            SELECT * FROM radio_playlists ORDER BY place ASC;
        `;

        const result = await (conn as Pool).query(query, []);
        return result.rows as Playlist[];
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getNotProtectedPlaylist = async () => {
    try {
        const query = `
            SELECT * FROM radio_playlists WHERE is_protected = false ORDER BY place ASC;
        `;

        const result = await (conn as Pool).query(query, []);
        return result.rows as Playlist[];
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const addToAnotherPlaylists = async (
    playlists: string[] | number[],
    songs: number[]
) => {
    try {

        for (const playlistId of playlists) {
            for (const songId of songs) {
                const checkQuery = `
            SELECT 1 
            FROM radio_playlistssong 
            WHERE playlist_id = $1 AND song_id = $2
            LIMIT 1;
          `;
                const checkResult = await (conn as Pool).query(checkQuery, [playlistId, songId]);

                if (checkResult.rowCount === 0) {
                    const insertQuery = `
              INSERT INTO radio_playlistssong (playlist_id, song_id)
              VALUES ($1, $2);
            `;
                    await (conn as Pool).query(insertQuery, [playlistId, songId]);
                }
            }
        }
        return 'success'
    } catch (error) {
        console.log(error)
        return 'err'
    }
};

export const deleteFromPlaylist = async (playlistId: string | number, songIds: number[]) => {
    try {

        const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const deleteQuery = `
            DELETE FROM radio_playlistssong
            WHERE playlist_id = $1 AND song_id = ANY($2);
        `;

        const result = await (conn as Pool).query(deleteQuery, [playlistId, songIds]);

        return 'success'

    } catch (error) {
        console.log(error)
        return 'err'
    }
}

export const updatePlaybackState = async (songId: number | null, currentTime: number, isPlaying: boolean, player: number) => {
    try {
        let query: string;
        let params: any[] = [songId, currentTime, isPlaying];

        const forcedCheckQuery = `
            SELECT id, song_id, currenttime, is_playing
            FROM radio_playback
            WHERE id = $1;
        `;
        const result = await (conn as Pool).query(forcedCheckQuery, [player])


        if (result.rows.length > 0) {
            const dbRow = result.rows[0]
        
            const timeDifference = Math.abs(dbRow.currenttime - currentTime)

            if (
                dbRow.song_id !== songId ||
                dbRow.is_playing !== isPlaying ||
                timeDifference > 10
            ) {
                const song = await getSong(player);
                return {
                    action: 'update',
                    data: song
                }
            }
        }
        

        if (songId === null) {
            return {
                action: 'error',
                data: ''
            }
        } else {
            query = `
                UPDATE radio_playback
                SET song_id = $1, currenttime = $2, is_playing = $3
                WHERE id = $4;
            `;
            params = [songId, currentTime, isPlaying, player];
        }

        await (conn as Pool).query(query, params);

        const queryPlayingDevice = `SELECT playing_device FROM radio_playback WHERE id = $1`
        const resultPlayingDevice = await (conn as Pool).query(queryPlayingDevice, [player]);
        return {
            action: 'success',
            data: resultPlayingDevice.rows[0].playing_device
        }
    } catch (error) {
        console.log(error)
        return {
            action: 'error',
            data: ''
        }
    }
}


export const changeSongProgress = async (player: number, progress: number) => {
    try {

        const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const query = `
            UPDATE radio_playback
            SET currenttime = $1
            WHERE id = $2;
        `;
        const params = [progress, player];

        await (conn as Pool).query(query, params);

        return 'success'
    } catch (error) {
        console.log(error);
        return 'err'
    }
};
export const handlePlayPlayback = async (isPlaying: boolean, player: number) => {
    try {
        const query = `
            UPDATE radio_playback
            SET is_playing = $1
            WHERE id = $2;
        `;
        await (conn as Pool).query(query, [!isPlaying, player]);
        return 'success'
    } catch (error) {
        console.log(error)
        return 'err'
    }
}

export const addPlaylist = async (name: string, description: string) => {
    try {
        const query = `
            INSERT INTO radio_playlists (name, description)
            VALUES ($1, $2);
        `;

        const result = await (conn as Pool).query(query, [name, description]);
        return 'success';
    } catch (error) {
        console.log(error);
        return 'err';
    }
};
export const editPlaylist = async (name: string, description: string, id: number) => {
    try {

        const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const query = `
            UPDATE radio_playlists
            SET name = $1, description = $2
            WHERE id = $3;
        `;

        const result = await (conn as Pool).query(query, [name, description, id]);
        return 'success';
    } catch (error) {
        console.log(error);
        return 'err';
    }
};
export const copyPlaylist = async (id: number) => {
    try {

        const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const getQuery = `
            SELECT name, description
            FROM radio_playlists
            WHERE id = $1;
        `;
        const getResult = await (conn as Pool).query(getQuery, [id]);

        if (getResult.rows.length === 0) {
            return 'err'
        }

        const { name, description } = getResult.rows[0];

        const query = `
            INSERT INTO radio_playlists (name, description)
            VALUES ($1, $2) RETURNING id;
        `;

        const insertResult = await (conn as Pool).query(query, [`Copy of ${name}`, description]);

        const newPlaylistId = insertResult.rows[0].id;

        const copySongsQuery = `
            INSERT INTO radio_playlistssong (playlist_id, song_id)
            SELECT $1, song_id
            FROM radio_playlistssong
            WHERE playlist_id = $2;
        `;
        await (conn as Pool).query(copySongsQuery, [newPlaylistId, id]);


        return newPlaylistId;
    } catch (error) {
        console.log(error);
        return 'err';
    }
};
export const deletePlaylist = async (id: number) => {
    try {

        const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const checkQuery = `
        SELECT is_protected FROM radio_playlists WHERE id = $1
        `;
        const checkResult = await (conn as Pool).query(checkQuery, [id]);

        if (checkResult.rowCount === 0) {
            return 'Playlist not found';
        }

        const isProtected = checkResult.rows[0].is_protected;

        if (isProtected) {
            return 'Playlist is protected and cannot be deleted';
        }

        const query = `
            DELETE FROM radio_playlists WHERE id = $1
        `;

        const result = await (conn as Pool).query(query, [id]);
        return 'success';
    } catch (error) {
        console.log(error);
        return 'err';
    }
};
export const changePlaylistOrder = async (playlists: Playlist[]) => {
    try {

        const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const query = `
            UPDATE radio_playlists
            SET place = $1
            WHERE id = $2
        `
        for (let i = 0; i < playlists.length; i++) {
            const playlist = playlists[i]
            const result = await (conn as Pool).query(query, [i + 1, playlist.id]);
        }
        return 'success'
    } catch (error) {
        return 'err'
    }
}
export const changeQueueOrder = async (songs: QueueSong[]) => {
    try {
        const query = `
            UPDATE radio_queue
            SET place = $1
            WHERE id = $2
        `
        for (let i = 0; i < songs.length; i++) {
            const song = songs[i]
            const result = await (conn as Pool).query(query, [i + 1, song.queue_id]);
        }
        return 'success'
    } catch (error) {
        console.log(error)
        return 'err'
    }
}

export const deleteFromQueue = async (id: number | string) => {
    try {

        const user = await getUser()
        if(!user || !user.permissions.can_see_radio_section) return 'err'

        const query = `DELETE FROM radio_queue WHERE id = $1`

        const result = await (conn as Pool).query(query, [id]);

        return 'success'

    } catch (error) {
        return 'err'
    }
}

export const playPrevSong = async (player: number) => {
    try {
        const queryPlaying = `SELECT song_id FROM radio_playback WHERE id = $1`
        const resultPlaying = await (conn as Pool).query(queryPlaying, [player])
        const currentSongId = resultPlaying.rows[0]?.songid

        const queryPrev = `SELECT * FROM radio_songshistory WHERE player_id = $1 ORDER BY date DESC LIMIT 1`
        const resultPrev = await (conn as Pool).query(queryPrev, [player])

        if (resultPrev.rows.length === 0) {
            return 'No songs'
        }

        const prevSong = resultPrev.rows[0];

        const deletePrevQuery = `DELETE FROM radio_songshistory WHERE id = $1`;
        await (conn as Pool).query(deletePrevQuery, [prevSong.id]);

        const updatePlaybackQuery = `
            UPDATE radio_playback
            SET currenttime = 0, is_playing = true, song_id = $1
            WHERE id = $2;
        `;
        await (conn as Pool).query(updatePlaybackQuery, [prevSong.songid, player]);

        if (currentSongId) {
            await addToQueueFirst(currentSongId, player);
        }

        return 'success';
    } catch (error) {
        console.log(error);
        return 'err';
    }
};


import { spawn } from 'child_process';
import path from 'path';
import { getUser } from './user';

interface SongData {
    title: string;
    artist: string;
    duration: number;
}

export const downloadSongs = async (playlists: string[] | number[], url: string) => {
    try {
        if (!/^https?:\/\/.+/i.test(url)) {
            throw new Error('Invalid YouTube URL');
        }

        const ytDlpPath = path.resolve(`${process.env.RADIO_DOWNLOAD_LOCATION}`, 'yt-dlp');

        const playlistProcess = spawn(ytDlpPath, ['--flat-playlist', '--print-json', url]);

        let playlistData = '';
        const playlistErrorData: Buffer[] = [];

        for await (const chunk of playlistProcess.stdout) {
            playlistData += chunk;
        }

        for await (const chunk of playlistProcess.stderr) {
            playlistErrorData.push(chunk);
        }

        await new Promise<void>((resolve, reject) => {
            playlistProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`yt-dlp failed to fetch playlist: ${Buffer.concat(playlistErrorData).toString()}`));
                } else {
                    resolve();
                }
            });
        });

        const jsonObjects: string[] = playlistData
            .split('\n')
            .filter((line) => line.trim().length > 0);

        const playlistEntries = jsonObjects.map((jsonString) => {
            try {
                return JSON.parse(jsonString);
            } catch (err) {
                console.error('Error parsing JSON string:', jsonString);
                throw err;
            }
        });

        for (const entry of playlistEntries) {
            const videoUrl = entry.url || `https://www.youtube.com/watch?v=${entry.id}`;

            const videoInfoProcess = spawn(ytDlpPath, ['--print-json', videoUrl]);
            let videoInfoData = '';
            const videoErrorData: Buffer[] = [];

            for await (const chunk of videoInfoProcess.stdout) {
                videoInfoData += chunk;
            }

            for await (const chunk of videoInfoProcess.stderr) {
                videoErrorData.push(chunk);
            }

            await new Promise<void>((resolve, reject) => {
                videoInfoProcess.on('close', (code) => {
                    if (code !== 0) {
                        reject(new Error(`yt-dlp failed to fetch video info: ${Buffer.concat(videoErrorData).toString()}`));
                    } else {
                        resolve();
                    }
                });
            });

            const videoInfo = JSON.parse(videoInfoData);
            const { title = 'Unknown Title', uploader = 'Unknown Artist', duration = 0 } = videoInfo;

            const songData: SongData = {
                title: title || 'Unknown_Title',
                artist: uploader,
                duration,
            };



            const sanitizedTitle = songData.title.replace(/[^a-zA-Z0-9]/g, '_');
            const mp3OutputPath = `${process.env.DOWNLOAD_LOCATION}${sanitizedTitle}.mp3`;

            const checkSongQuery = `
                SELECT id FROM radio_songs 
                WHERE title = $1 
                AND ABS(duration - $2) <= 1
            `;
            const existingSong = await (conn as Pool).query(checkSongQuery, [
                songData.title,
                songData.duration,
            ]);

            if (existingSong.rows.length > 0) {
                await addToAnotherPlaylists(playlists, [existingSong.rows[0].id])
                continue; 
            }


            // Download and convert to MP3
            const downloadProcess = spawn(ytDlpPath, [
                '-o',
                `/nuty/radio/${sanitizedTitle}.%(ext)s`,
                '-x',
                '--audio-format',
                'mp3',
                '-o',
                `${mp3OutputPath}`,
                videoUrl,
            ]);
            const downloadErrorData: Buffer[] = [];

            for await (const chunk of downloadProcess.stderr) {
                downloadErrorData.push(chunk);
            }

            await new Promise<void>((resolve, reject) => {
                downloadProcess.on('close', (code) => {
                    if (code !== 0) {
                        reject(new Error(`yt-dlp failed to download or convert video: ${Buffer.concat(downloadErrorData).toString()}`));
                    } else {
                        resolve();
                    }
                });
            });

            const insertSongQuery = `
                INSERT INTO radio_songs (title, src, artist, duration)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `;
            const result = await (conn as Pool).query(insertSongQuery, [
                songData.title,
                `/${sanitizedTitle}.mp3`,
                songData.artist,
                songData.duration,
            ]);

            const songId: number = result.rows[0].id;

            const insertPlaylistSongQuery = `
                INSERT INTO radio_playlistssong (playlist_id, song_id)
                VALUES ($1, $2)
            `;

            for (const playlistId of playlists) {
                await (conn as Pool).query(insertPlaylistSongQuery, [playlistId, songId]);
            }
            await (conn as Pool).query(insertPlaylistSongQuery, [1, songId]);
        }

        return 'success';
    } catch (error) {
        console.error(error);
        return 'err';
    }
};