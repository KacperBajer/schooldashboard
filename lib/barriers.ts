'use server'

import { Pool } from "pg";
import conn from "./db";
import { getUser } from "./user";
import { createKommerSession } from "./kommer";
import { Barrier } from "./types";

export const getControllers = async () => {
    try {
        const user = await getUser();

        if (!user || !user.permissions.can_see_barriers_section) return []

        let query = 'SELECT id, ip, name, connection, "order", openlink FROM barriers ORDER BY "order" ASC';

        const controllers = await (conn as Pool).query(query, []);
        return controllers.rows as Barrier[]
    } catch (error) {
        console.error(error);
        return []
    }
};

export const getOpenLink = async (id: number) => {
    try {
        const query = 'SELECT openlink FROM barriers WHERE id = $1'
        const result = await (conn as Pool).query(
            query, [id]
        );
        return result.rows[0].openlink ?  result.rows[0].openlink : null
    } catch (error) {
        console.log(error)
        return null
    }
}

export const openController = async (id: number) => {
    try {

        const user = await getUser();
        if (!user || !user.permissions.can_see_barriers_section) return  {
            status: 'error',
            error: 'You do not have permissions for that'
        }


        const sessionId = await createKommerSession();

       if (sessionId.status === 'error') return {
            status: 'error',
            error: 'Something went wrong'
        }

        const link = await getOpenLink(id);

        if(!link) return {
            status: 'error',
            error: 'Barrier not found'
        }

        const response = await fetch(link as string, {
            method: 'GET',
            headers: {
                'Cookie': `sessionidadms=${sessionId.data}`,
            },
            credentials: 'include',
        });

        if (!response.ok) return {
            status: 'error',
            error: 'Failed open door'
        }

        return {
            status: 'success'
        };

    } catch (error) {
        console.error(error);
        return  {
            status: 'error',
            error: 'Something went wrong'
        }
    }
};
export const getOpenLinkWithToken = async (id: number) => {
    try {
        const query = 'SELECT openapitoken FROM barriers WHERE id = $1'
        const result = await (conn as Pool).query(
            query, [id]
        );
        if(result.rows.length < 1) return {
            status: 'error',
            error: 'Barrier not found'
        }
        return  {
            status: 'success',
            url: `${process.env.API_URL}/api/barriers?token=${result.rows[0].openapitoken}`
        }
    } catch (error) {
        console.log(error)
        return {
            status: 'error',
            error: 'Something went wrong'
        }
    }
}

export const openByUrlWithToken = async (token: string) => {
    try {
        const query = 'SELECT id FROM barriers WHERE openapitoken = $1'
        const result = await (conn as Pool).query(
            query, [token]
        );
        if(result.rows.length < 1) return {
            status: 'error',
            error: 'Barrier not found'
        }

        const sessionId = await createKommerSession();

       if (sessionId.status === 'error') return {
            status: 'error',
            error: 'Something went wrong'
        }

        const link = await getOpenLink(result.rows[0].id);

        if(!link) return {
            status: 'error',
            error: 'Barrier not found'
        }

        const response = await fetch(link as string, {
            method: 'GET',
            headers: {
                'Cookie': `sessionidadms=${sessionId.data}`,
            },
            credentials: 'include',
        });

        if (!response.ok) return {
            status: 'error',
            error: 'Failed open door'
        }

        return {
            status: 'success'
        };

    } catch (error) {
        return {
            status: 'error',
            error: 'Something went wrong'
        }
    }
}