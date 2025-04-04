'use server'

import { Pool } from "pg"
import conn from "./db"
import { getUser } from "./user"
import { Card } from "./types"

export const getCards = async (page: string) => {
    try {
        const user = await getUser()
        if(!user || !user.permissions.can_see_cards_section) return []

        const offset = (parseInt(page) - 1) * 15

        const query = `SELECT * FROM cards ORDER BY id LIMIT 15 OFFSET $1`
        const result = await (conn as Pool).query(query, [offset])

        return result.rows as Card[]
    } catch (error) {
        console.log(error)
        return []
    }
}