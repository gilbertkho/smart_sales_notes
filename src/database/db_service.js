export const initDatabase = (db) => {
    try{
        db.execAsync(`
            PRAGMA journal_mode = WAL;
    
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY, 
                code TEXT, 
                name TEXT,
                units TEXT, 
                price REAL
            );
    
            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY, 
                name TEXT, 
                address TEXT
            );
    
            CREATE TABLE IF NOT EXISTS cart (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                date TEXT, 
                customer_id TEXT,
                total REAL
            );
    
            CREATE TABLE IF NOT EXISTS cart_detail (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cart_id INTEGER,
                item_id INTEGER, 
                quantity INTEGER
            );

            CREATE TABLE IF NOT EXISTS settings (
                settings_name TEXT PRIMARY KEY,
                val TEXT
            );
        `);
        console.log('DB & Tables initialized sucessfully');
    }
    catch(error){
        console.log('Error initializing DB', error);
    }
}


export const factoryReset = async (db) => {
    try {
        // 1. Get all tables. 
        // result will look like: [{ name: 'items' }, { name: 'orders' }]
        const allTables = await db.getAllSync(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        );

        console.log("Tables found to drop:", allTables);

        if (!allTables || allTables.length === 0) {
            console.log("No tables found to reset.");
            return;
        }

        // 2. Start Transaction
        await db.withTransactionSync(async () => {
            for (const table of allTables) {
            // table is an object like { name: 'items' }, so we use table.name
            await db.runSync(`DROP TABLE IF EXISTS ${table.name}`);
            console.log(`Dropped table: ${table.name}`);
            }
            
            // 3. Reset the version so onInit runs again on next launch
            await db.execSync(`PRAGMA user_version = 0`);
        });

        alert("Factory reset complete. Please restart the app to re-initialize.");
    } catch (error) {
        console.error("Factory Reset Failed:", error);
    }
}