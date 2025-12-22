import { db } from './db_service';

const ItemRepository = {
    saveItems: (items) => {
        db.withTransactionSync(() => {
            items.forEach((i) => {
                db.runSync('INSERT OR REPLACE INTO items (id, code, name, price) VALUES (?,?,?,?)',
                    [i.id, i.code, i.name, i.price]
                );
            });
        });
    },

    getAllItems: () => {
        return db.getAllSync('SELECT * FROM items');
    },
    getItemsByID: (item_id) => {
        return db.getAllSync('SELECT * FROM items WHERE id = ?', [item_id]);
    },
    searchItems: (query) => {
        return db.getAllSync('SELECT * FROM customers WHERE name LIKE ?', [`%${query}%`]);
    },
}

export default ItemRepository;