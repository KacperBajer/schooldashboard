'use server'

import { Pool } from "pg";
import conn from "./db";
import { getUser } from "./user"

export const listenToOrdersChanges = async (io: any) => {
    try {
        const client = await (conn as Pool).connect()
        
        await client.query("LISTEN orders_changes")

        client.on("notification", async (msg) => {
            if (msg.channel === "orders_changes") {
                console.log("Zmiana w tabeli orders, wysyłanie WS...")

                io.emit("ORDERS_UPDATED")
            }
        })

        console.log("Nasłuchiwanie na zmiany w tabeli orders...")
    } catch (error) {
        console.error("Błąd podczas nasłuchiwania na zmiany w tabeli orders:", error)
    }
}

export const getOrders = async (status: 'all' | 'ordered' | 'not_ordered' = 'all') => {
    try {
        const user = await getUser()
        if (!user || !user.permissions.can_see_orders_section ) return []


        let query = 'SELECT * FROM orders';
        if (status === 'ordered') {
            query += ' WHERE ordered = TRUE ORDER BY order_date DESC';
        } else if (status === 'not_ordered') {
            query += ' WHERE ordered = FALSE';
        }

        const result = await (conn as Pool).query(query, []);
        return result.rows;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const addOrder = async (name: string, href: string, amount: number, cost: number) => {
    try {
        const user = await getUser()
        if(!user) return {status: 'error', error: 'You have to be logged in'}
        if(!user.permissions.can_add_order) return {status: 'error', error: 'You do not have permissions for that'}
        const query = `INSERT INTO orders (name, href, amount, cost) VALUES ($1, $2, $3, $4)`
        const result = await (conn as Pool).query(query, [name, href, amount, cost])
        return {status: 'success'}
    } catch (error) {
        console.log(error)
        return {status: 'error', error: "Something went wrong"}
    }
}
export const editOrder = async (id: number, name: string, href: string, amount: number, cost: number) => {
    try {
        const user = await getUser();
        if (!user) return { status: "error", error: "You have to be logged in" };
        if(!user.permissions.can_edit_order) return {status: 'error', error: 'You do not have permissions for that'}

        const query = `UPDATE orders SET name = $1, href = $2, amount = $3, cost = $4 WHERE id = $5`;
        const result = await (conn as Pool).query(query, [name, href, amount, cost, id]);

        if (result.rowCount === 0) {
            return { status: "error", error: "Order not found" };
        }

        return { status: "success" };
    } catch (error) {
        console.log(error);
        return { status: "error", error: "Something went wrong" };
    }
};
export const deleteOrders = async (ids: number[]) => {
    try {
        const user = await getUser()
        if(!user) return {status: 'error', error: 'You have to be logged in'}
        if(!user.permissions.can_delete_order) return {status: 'error', error: 'You do not have permissions for that'}
        const query = 'DELETE FROM orders WHERE id = $1'
        for(const id of ids) {
            await (conn as Pool).query(query, [id])
        }
        return {status: 'success'}
    } catch (error) {
        console.log(error)
        return {status: 'error', error: "Something went wrong"}
    }
}
export const markAsOrdered = async (ids: number[]) => {
    try {
        const user = await getUser()
        if(!user) return {status: 'error', error: 'You have to be logged in'}
        if(!user.permissions.can_mark_order_as_ordered) return {status: 'error', error: 'You do not have permissions for that'}
        const query = 'UPDATE orders SET ordered = true, order_date = now() WHERE id = $1'
        for(const id of ids) {
            await (conn as Pool).query(query, [id])
        }
        return {status: 'success'}
    } catch (error) {
        console.log(error)
        return {status: 'error', error: "Something went wrong"}
    }
}