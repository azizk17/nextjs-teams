
import { defineConfig } from 'drizzle-kit';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
    dialect: 'postgresql',
    out: './src/db/drizzle',
    schema: './src/db/schema/index.ts',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        ssl: false,
    },
    // Print all statements
    verbose: true,
    // Always ask for confirmation
    strict: true,
});

