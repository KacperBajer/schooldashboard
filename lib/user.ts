'use server'

import { Pool } from "pg";
import conn from "./db";
import bcrypt from "bcryptjs";
import { createSession, getSession } from "./sessions";
import { User, UserPermissions } from "./types";

type AuthUserResponse = | {status: 'success', user: User} | {status: 'error'; error: string}

export const getUser = async () => {
    try {
        const session = await getSession()

        if(!session) return null

        const query = `WITH permissions_data AS (
    SELECT p.* FROM user_dashboard_permissions p WHERE p.user_id = $1
)
SELECT 
    u.email, 
    u.avatar, 
    u.username, 
    u.id, 
    u.created_at,
    u.su,
    jsonb_strip_nulls(to_jsonb(p) - 'id' - 'user_id') AS permissions
FROM users u
JOIN permissions_data p ON u.id = p.user_id
WHERE u.id = $1;
`;
        const result = await (conn as Pool).query(query, [session.user_id]);

        if (result.rows.length === 0) return null

        return result.rows[0] as User
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getUsers = async () => {
    try {
        const user = await getUser()

        if(!user) return []

        const query = `WITH permissions_data AS (
    SELECT p.* FROM user_dashboard_permissions p
)
SELECT 
    u.email, 
    u.avatar, 
    u.username, 
    u.id, 
    u.created_at,
    u.su,
    jsonb_strip_nulls(to_jsonb(p) - 'id' - 'user_id') AS permissions
FROM users u
JOIN permissions_data p ON u.id = p.user_id;
`;
        const result = await (conn as Pool).query(query, []);

        return result.rows as User[]
    } catch (error) {
        console.log(error)
        return []
    }
}


export const getUserById = async (id: number) => {
    try {
        const user = await getUser()

        if(!user || !user.permissions.can_manage_users) return null

        const query = `WITH permissions_data AS (
    SELECT p.* FROM user_dashboard_permissions p WHERE p.user_id = $1
)
SELECT 
    u.email, 
    u.avatar, 
    u.username, 
    u.id, 
    u.created_at,
    u.su,
    jsonb_strip_nulls(to_jsonb(p) - 'id' - 'user_id') AS permissions
FROM users u
JOIN permissions_data p ON u.id = p.user_id WHERE u.id = $1;
`;
        const result = await (conn as Pool).query(query, [id]);

        return result.rows[0] as User
    } catch (error) {
        console.log(error)
        return null
    }
}

export const loginUser = async (email: string, password: string) => {
    try {
        
        if(!email || !password) return {status: 'error', error: 'Email and password are required'} as AuthUserResponse

        const query = 'SELECT * FROM users WHERE email = $1'
        const result = await (conn as Pool).query(query, [email])

        if(result.rows.length < 1) return {status: 'error', error: 'Incorrect email or password'} as AuthUserResponse

        const passMatch = await bcrypt.compare(password, result.rows[0].password_hash); 
        if(!passMatch) return {status: 'error', error: 'Incorrect email or password'} as AuthUserResponse

        const session = await createSession(result.rows[0].id)
        if(!session) return {status: 'error', error: 'Something went wrong'} as AuthUserResponse

        await (conn as Pool).query("DELETE FROM sessions WHERE expires_at < NOW()")

        const user = await getUser()

        return {status: 'success', user: user} as AuthUserResponse
    } catch (error) {
        console.log(error)
        return {status: 'error', error: 'Something went wrong'} as AuthUserResponse
    }
}
export const createUser = async (email: string, username: string, password: string) => {
    try {
        const user = await getUser()
        if(!user) return {status: 'error', error: 'You have to be logged in'}
        if(!user.permissions.can_manage_users) return {status: 'error', error: 'You do not have permissions for that'}

        if(!email || !username || !password) return {status: 'error', error: 'Email, password and username are required'} as AuthUserResponse
        
        const query = 'SELECT * FROM users WHERE email = $1'
        const result = await (conn as Pool).query(query, [email])

        if(result.rows.length > 0) return {status: 'error', error: 'Email is already taken'} as AuthUserResponse
       
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        const createUserQuery = `INSERT INTO users (email, password_hash, username, avatar) VALUES ($1, $2, $3, '/avatar.png') RETURNING *`
        const createUserResult = await (conn as Pool).query(createUserQuery, [email, hash, username])

        return {status: 'success'} as AuthUserResponse
    } catch (error) {
        console.log(error)
        return {status: 'error', error: 'Something went wrong'} as AuthUserResponse
    }
}
export const checkPassword = async (password: string) => {
    try {
        if(!password) return false
        const user = await getUser()
        if(!user) return false
        const query = `SELECT * FROM users WHERE id = $1`
        const result = await (conn as Pool).query(query, [user.id])
        if(result.rows.length === 0) return false
        const passMatch = await bcrypt.compare(password, result.rows[0].password_hash); 
        if(!passMatch) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
export const deleteUser = async (id: number) => {
    try {
        const user = await getUser()
        if(!user) return {status: 'error', error: 'You have to be logged in'}
        if(!user.permissions.can_manage_users) return {status: 'error', error: 'You do not have permissions for that'}
        if(user.id === id) return {status: 'error', error: 'You cannot delete your account'}
        const deletingUser = await getUserById(id)
        if(!deletingUser) return {status: 'error', error: 'Cannot find user'}
        if(deletingUser.su) return {status: 'error', error: 'This user cannot be deleted'}
        if(deletingUser.permissions.can_manage_users && !user.su) return {status: 'error', error: 'You cannot delete this user'}

        const query = `DELETE FROM users WHERE id = $1`
        const result = (conn as Pool).query(query, [id])

        return {status: 'success'}
    } catch (error) {
        console.log(error)    
        return {status: 'error', error: 'Something went wrong'}    
    }
}
export const savePermissions = async (permissions: UserPermissions, managedUser: User) => {
    try {
        const user = await getUser()
        if(!user) return {status: 'error', error: 'You have to be logged in'}
        if(!user.permissions.can_manage_users) return {status: 'error', error: 'You do not have permissions for that'}
        if(!user.su && (permissions.can_manage_users !== managedUser.permissions.can_manage_users)) return {status: 'error', error: 'Something went wrong'}
        if(managedUser.su) return {status: 'error', error: 'Something went wrong'}
        if(!permissions.can_see_orders_section && (permissions.can_add_order || permissions.can_delete_order || permissions.can_edit_order || permissions.can_mark_order_as_ordered || permissions.can_see_order_history)) return {status: 'error', error: 'Something went wrong'}
        if(!permissions.can_see_users_section && permissions.can_manage_users) return {status: 'error', error: 'Something went wrong'}

        const query = `
        UPDATE user_dashboard_permissions SET
          can_see_doors_section = $2,
          can_see_lights_section = $3,
          can_see_network_section = $4,
          can_see_kommer_section = $5,
          can_see_radio_section = $6,
          can_see_orders_section = $7,
          can_see_order_history = $8,
          can_add_order = $9,
          can_delete_order = $10,
          can_mark_order_as_ordered = $11,
          can_edit_order = $12,
          can_see_users_section = $13,
          can_manage_users = $14,
          can_see_cards_section = $15,
          "can_see_school-id_section" = $16,
          can_see_barriers_section = $17
        WHERE user_id = $1
      `;
      
      const result = await (conn as Pool).query(query, [
        managedUser.id,
        permissions.can_see_doors_section,
        permissions.can_see_lights_section,
        permissions.can_see_network_section,
        permissions.can_see_kommer_section,
        permissions.can_see_radio_section,
        permissions.can_see_orders_section,
        permissions.can_see_order_history,
        permissions.can_add_order,
        permissions.can_delete_order,
        permissions.can_mark_order_as_ordered,
        permissions.can_edit_order,
        permissions.can_see_users_section,
        permissions.can_manage_users,
        permissions.can_see_cards_section,
        permissions['can_see_school-id_section'],
        permissions.can_see_barriers_section,
      ]);
      
      return {status: 'success'}

    } catch (error) {
        console.log(error)
        return {status: 'error', error: 'Something went wrong'}  
    }
}