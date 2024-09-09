import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { Client } from "pg";
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

declare global {
    // This is necessary to avoid TypeScript errors when adding properties to `global`
    var _dbClient: Client | undefined;
}


export const client = global._dbClient || new Client({
    connectionString: process.env.POSTGRES_URL!
});

if (!global._dbClient) {
    client.connect().catch((err: any) => {
        console.error('Error connecting to the database:', err);
    });
    global._dbClient = client;
}

export const db = drizzle(client, {
    schema,
    logger: true,
});

export type db = typeof db;

export default db;