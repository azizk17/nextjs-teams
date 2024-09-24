// ---------------------------------------------------------------- //
// WARNING: DO NOT MODIFY THIS FILE                                 //
// The logic in this file is considered final and should not be     //
// altered without careful consideration and approval. Changes to   //
// this file may have significant impacts on the seeding process.   //
// If modifications are necessary, please consult with the team     //
// responsible for database management and seeding.                 //
// ---------------------------------------------------------------- //



import db, { client } from '../index';
import * as schema from "../schema"
import { sql, getTableName } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { exit } from 'process';
import { seed as userSeed } from './userSeed';
import { seed as initalSeed } from './initalSeed';
import { seed as mediaSeed } from './mediaSeed';
import { seedMeilisearch as meilisearchSeed } from './meilisearchSeed';
// if (!process.env.DB_SEEDING) {
//     throw new Error('You must set DB_SEEDING to "true" when running seeds');
// }

if (process.env.NODE_ENV !== "development") {
    throw new Error("Seeding is only supported in development environment");
}

async function main() {
    console.log("Seeding...");

    await initalSeed();
    //!! fake data only for dev environment
    await userSeed();
    await mediaSeed();
    // await meilisearchSeed();
    console.log("*** Seeding complete ***");
}



// ---------------------------------------------------------------- //
// Reset tables before dumping data                                 // 
// only in DEV environment                                          //
// ---------------------------------------------------------------- //
async function resetTable(table: string) {
    return db.execute(
        sql.raw(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`)
    );
}


console.log("Resetting tables...");
for (const [_, value] of Object.entries(schema)) {
    if (value && typeof value === "object" && value instanceof PgTable) {
        resetTable(getTableName(value));
    }
}

// Run main and handle unhandled rejections
main().catch(error => {
    console.log("Error", error);
    console.log("!! Ending with error...");
}).finally(async () => {
    console.log("Closing connection...");
    await client.end();
    exit(0);
});