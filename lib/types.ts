import { ReactElement } from "react"

export type Session = {
    session_id: string
    user_id: number
    token: string
    expires_at: Date
    created_at: Date
}
export type User = {
    id: number
    username: string
    email: string
    created_at: Date
    avatar: string
    permissions: UserPermissions
    su: boolean
}

export type Sections = {
    icon: ReactElement
    name: string
    href: string
}
export type UserPermissions = {
    can_see_doors_section: boolean
    can_see_light_section: boolean
    can_see_network_section: boolean
    can_see_kommer_section: boolean
    can_see_radio_section: boolean
    can_see_orders_section: boolean
    can_see_order_history: boolean
    can_add_order: boolean
    can_delete_order: boolean
    can_mark_order_as_ordered: boolean
    can_edit_order: boolean
    can_see_users_section: boolean
    can_manage_users: boolean
}

export type Door = {
    id: number
    name: string
    status: 'open' | 'closed'
    connection_status: 'connected' | 'disconnected'
    mode: 'auto-close' | 'toggle'
    ip_addr: string
}
export type OrderItem = {
    id: number
    ordered: boolean
    name: string
    href: string
    amount: number
    cost: number
    order_date?: Date
}