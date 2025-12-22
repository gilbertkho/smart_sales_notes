import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseAsync('sales_v1.db');

export const initDatabase = () => {
    db.execSync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS items(id INTEGER PRIMARY KEY, code TEXT, name TEXT, price REAL);
        CREATE TABLE IF NOT EXISTS customers(id INTEGER PRIMARY KEY, name TEXT, address TEXT);
        CREATE TABLE IF NOT EXISTS cart(id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, customer_id INTEGER);
        CREATE TABLE IF NOT EXISTS cart_detail(id INTEGER PRIMARY KEY AUTOINCREMENT, cart_id INTEGER, item_id INTEGER, quantity INTEGER);
    `);
}