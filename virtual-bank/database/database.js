const {readFileSync, truncateSync} = require("fs");
const CountdownLatch = require('../util/countdown-latch')
const path = require("path");
const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "database/db.sqlite"

const latch1 = new CountdownLatch(1);
const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        console.log('Init data')
        try {
            const latch2 = new CountdownLatch(1);
            db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const ignored_tables = [ 'sqlite_sequence', 'sqlite_master']
                let tablesToDrop = tables.filter(table => !ignored_tables.includes(table.name));

                console.log(tablesToDrop)
                const latch3 = new CountdownLatch(tablesToDrop.length);
                tablesToDrop
                    .forEach((table) => {
                    const tableName = table.name;
                    const dropTableQuery = `DROP TABLE ${tableName}`;

                    db.run(dropTableQuery, (err) => {
                        if (err) {
                            console.error(`Error dropping table ${tableName}:`, err);
                        } else {
                            console.log(`Table ${tableName} dropped successfully.`);
                        }
                        latch2.countDown()
                    });
                });
                latch3.await()
                latch2.countDown()
            });
            latch2.await()
            let dataSqlScriptPath = path.resolve('database'+ path.sep + 'data.sql');
            const dataSql = readFileSync(dataSqlScriptPath).toString();
            db.exec(dataSql, (err) => {
                if (err) {
                    console.error(`Error executing data script ${dataSqlScriptPath}:`, err);
                } else {
                    console.log(`Data script ${dataSqlScriptPath} executed successfully.`);
                }
            })
        } catch (e) {
            console.error("Error while executing data script {}", e)
            throw e
        }
    }
    latch1.countDown();
});
latch1.await()

module.exports = db