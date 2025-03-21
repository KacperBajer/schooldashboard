'use server'

import { Pool } from "pg"
import conn from "./db"
import { getUser } from "./user"
import { Server } from "ws"


export const getDoors = async () => {
    try {
        const user = await getUser()
        if(!user || !user.permissions.can_see_doors_section) return []
        const query = `SELECT * FROM doors`
        const result = await (conn as Pool).query(query, [])
        return result.rows
    } catch (error) {
        console.log(error)
        return []
    }
}

export const listenToDoorsChanges = async (io: any) => {
    try {
        const client = await (conn as Pool).connect()
        
        await client.query("LISTEN doors_changes")

        client.on("notification", async (msg) => {
            if (msg.channel === "doors_changes") {
                console.log("Zmiana w tabeli doors, wysyłanie WS...")
                
                io.emit("DOORS_UPDATED")
            }
        })

        console.log("Nasłuchiwanie na zmiany w tabeli doors...")
    } catch (error) {
        console.error("Błąd podczas nasłuchiwania na zmiany w tabeli doors:", error)
    }
}