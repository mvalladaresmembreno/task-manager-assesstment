import { Kysely } from "kysely";
import { db } from "./database";
import * as path from 'path';
import { promises as fs } from 'fs';
import { Migrator, FileMigrationProvider } from "kysely";

async function migateToLatest() {
    const migrator  = 
    new Migrator({
        db:db, 
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: path.join(__dirname, "migrations"),
        })});

    const { error, migrationResults } = 
    await migrator.migrateToLatest();

    migrationResults?.forEach((it) => {
        if (it.status === "Success") {
            console.log(`Migrated: ${it.migrationName}`);
        } else {
            console.error(`Failed to migrate: ${it.migrationName}`);
        }
    });

    if (error) {
        console.error("Migration failed with error:", error);
        process.exit(1);
    }

    await db.destroy(); //Need to close the database connection after migration
}

migateToLatest();
