'use server'

import { Pool } from "pg"
import conn from "./db"

export const listenToDatabaseChanges = async (io: any) => {
    try {
        const client = await (conn as Pool).connect();

        const channels = [
            { name: "radio_playlists_changes", event: "RADIO_PLAYLISTS_LIST_UPDATED" },
            { name: "users_changes", event: "USERS_UPDATED" },
            { name: "doors_changes", event: "DOORS_UPDATED" },
            { name: "orders_changes", event: "ORDERS_UPDATED" },
            { name: "radio_queue_changes", event: "RADIO_QUEUE_UPDATED" },
            { name: "barriers_changes", event: "BARRIERS_UPDATED" },
        ];

        for (const channel of channels) {
            await client.query(`LISTEN ${channel.name}`);
        }

        client.on("notification", (msg) => {
            const channel = channels.find(ch => ch.name === msg.channel);
            if (channel) {
                console.log(`Zmiana w tabeli ${msg.channel}, wysyłanie WS...`);
                io.emit(channel.event);
            }
        });

        console.log("Nasłuchiwanie na zmiany w bazie danych...");
    } catch (error) {
        console.error("Błąd podczas nasłuchiwania na zmiany w bazie danych:", error);
    }
};

