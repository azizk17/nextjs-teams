import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { Client } from 'pg';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

declare global {
    // This is necessary to avoid TypeScript errors when adding properties to `global`
    var _dbClient: Client | undefined;
}

// Reuse existing client in dev mode to avoid creating new connections on every hot-reload
if (!global._dbClient) {
    global._dbClient = new Client({
        connectionString: process.env.POSTGRES_URL!,
    });

    global._dbClient.connect().catch((err: any) => {
        console.error('Error connecting to the database:', err);
        process.exit(1);  // Optional: stop the app if the DB connection fails
    });
}

export const client = global._dbClient;

export const db = drizzle(client, {
    schema,
    logger: true,
});

export type db = typeof db;

export default db;
