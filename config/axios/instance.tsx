import axios from "axios";
import * as SQLite from "expo-sqlite";

const api = axios.create({
    timeout: 10000
});

api.interceptors.request.use(async (config) => {
    try {
        const db = await SQLite.openDatabaseAsync('sales_note.db');

        // 1. Check if the 'settings' table even exists yet
        const tableCheck = await db.getFirstAsync(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='settings'"
        );
        const allTables = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table'");
        console.log("Actual tables in DB:", allTables);

        if (!tableCheck) {
            console.log("Settings table not created yet. Using default URL.");
            config.baseURL = 'http://192.168.1.100'; // Hardcoded fallback
            return config
        }

        // 2. If table exists, try to get the URL
        const result = await db.getFirstAsync(
            'SELECT val FROM settings WHERE settings_name = ?',
            ['base_url']
        );

        config.baseURL = result?.val || 'http://192.168.1.100';

    } catch (error) {
        console.error("Critical DB Error in Axios:", error);
        config.baseURL = 'http://192.168.1.100'; // Always have a fallback
    }
    return config;
});

export default api;