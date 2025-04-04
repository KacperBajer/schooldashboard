import { ReactElement } from "react";
import { boolean } from "zod";

export type Session = {
  session_id: string;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
};
export type User = {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  avatar: string;
  permissions: UserPermissions;
  su: boolean;
};

export type Sections = {
  icon: ReactElement;
  name: string;
  href: string;
};
export type UserPermissions = {
  can_see_doors_section: boolean;
  can_see_light_section: boolean;
  can_see_network_section: boolean;
  can_see_kommer_section: boolean;
  can_see_radio_section: boolean;
  can_see_orders_section: boolean;
  can_see_order_history: boolean;
  can_add_order: boolean;
  can_delete_order: boolean;
  can_mark_order_as_ordered: boolean;
  can_edit_order: boolean;
  can_see_users_section: boolean;
  can_manage_users: boolean;
  can_see_cards_section: boolean
  'can_see_school-id_section': boolean
};

export type Door = {
  id: number;
  name: string;
  status: "open" | "closed";
  connection_status: "connected" | "disconnected";
  mode: "auto-close" | "toggle";
  ip_addr: string;
};
export type OrderItem = {
  id: number;
  ordered: boolean;
  name: string;
  href: string;
  amount: number;
  cost: number;
  order_date?: Date;
};

export type Song = {
  id: number;
  title: string;
  artist: string;
  src: string;
  duration: number;
};
export type CurrentSong = {
  song: Song;
  ip: string;
  currenttime: number;
  isplaying: boolean;
};
export type Playlist = {
  id: number;
  description: string;
  name: string;
  isProtected: boolean;
  songs: Song[];
};
export type QueueSong = {
  queue_id: number;
  place: number;
} & Song;
export type CreateEventData = {
  name: string;
  function: string;
  recurring: null | boolean;
  date: null | string | Date;
  days: string[];
  time: string;
};

export type KommerUser = {
  id:  string
  employeeNumber: string
  firstName: string
  lastName: string
  departmentNumber: string
  departmentName: string
  gender: string
  presenceZone: string
  fingerprintCount: string
  cardNumber: string
  workPhone: string
  additionalId: string;
  photo: string
  validityDate: string
  description: string
};

export type Card = {
  id: number
  first_name: string
  last_name: string
  card_number: number
  group_name: 'UHF' | 'pracownicy' | "nauczyciele" | 'uczniowie'
  group_id: number
  class?: string
}