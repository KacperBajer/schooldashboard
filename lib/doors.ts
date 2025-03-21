'use server'

import { Pool } from "pg"
import conn from "./db"
import { getUser } from "./user"


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
