import { MdOutlineSensorDoor } from "react-icons/md";
import { FaNetworkWired } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";
import { IoRadio } from "react-icons/io5";
import { BiSolidTrafficBarrier } from "react-icons/bi";
import { GoPackage } from "react-icons/go";
import { FaUsers } from "react-icons/fa6";
import { User } from "./types";
import { FaAddressCard } from "react-icons/fa";
import { FaRoadBarrier } from "react-icons/fa6";

export const SideBarLinks = [
    {
        title: 'Doors',
        name: 'doors',
        icon: <MdOutlineSensorDoor className="text-xl" />,
        href: '/doors'
    },
    {
        title: 'Barriers',
        name: 'barriers',
        icon: <FaRoadBarrier className="text-xl" />,
        href: '/barriers'
    },
    {
        title: 'Lights',
        name: 'lights',
        icon: <FaRegLightbulb className="text-xl" />,
        href: '/lights'
    },
    {
        title: 'Network',
        name: 'network',
        icon: <FaNetworkWired className="text-xl" />,
        href: '/network'
    },
    {
        title: 'Kommer',
        name: 'kommer',
        icon: <BiSolidTrafficBarrier className="text-xl" />,
        href: '/kommer'
    },
    {
        title: 'Radio',
        name: 'radio',
        icon: <IoRadio className="text-xl" />,
        href: '/radio'
    },
    {
        title: 'Orders',
        name: 'orders',
        icon: <GoPackage className="text-xl" />,
        href: '/orders'
    },
    {
        title: 'Users',
        name: 'users',
        icon: <FaUsers className="text-xl" />,
        href: '/users'
    },
    {
        title: 'Cards',
        name: 'cards',
        icon: <FaAddressCard className="text-xl" />,
        href: '/cards'
    },
]

export const showOrderTopBarPermissions = (user: User) => user.permissions.can_add_order || user.permissions.can_see_order_history || user.permissions.can_mark_order_as_ordered || user.permissions.can_delete_order
export const showMoreBoxOrderPermissions = (user: User) => user.permissions.can_delete_order || user.permissions.can_edit_order || user.permissions.can_mark_order_as_ordered

export const EventActions = [
    {
        name: 'Play',
        function: 'play'
    },
    {
        name: 'Pause',
        function: 'pause'
    },
    {
        name: 'Play next',
        function: 'playNext'
    },
]

export const days = ['Monday', 'Tuesday', "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]