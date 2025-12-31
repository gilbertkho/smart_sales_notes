const SettingsRepository = {
    saveSettings: (db, items) => {
        const keys = Object.keys(items)
        for (const key of keys) {
            const value = items[key]; // Access the value using the key
            console.log(`${key}: ${value}`);
            db.runSync('INSERT OR REPLACE INTO settings (settings_name, val) VALUES (?,?)',[key, value]);
        }
        console.log("SAVE SETTINGS", items);
    }, 
    
    getAllSettings: (db) => {
        try{
            return db.getAllSync('SELECT * FROM settings');
        }
        catch(error){
            console.log(error);
        }
    }
}

export default SettingsRepository;