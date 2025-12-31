const ItemsRepository = {
    saveItems: (db, items) => {
        db.withTransactionSync(() => {
            items.forEach((i) => {
                db.runSync('INSERT OR REPLACE INTO items (id, code, name, units, price) VALUES (?,?,?,?,?)',
                    [i.id, i.code, i.name, i.units, i.price]
                );
            });
        });
    },

    getAllItems: (db) => {
        return db.getAllSync('SELECT * FROM items');
    },
    getItemsByID: (db, item_id) => {
        return db.getAllSync('SELECT * FROM items WHERE id = ?', [item_id]);
    },
    searchItems: (db, query) => {
        return db.getAllSync('SELECT * FROM items WHERE name LIKE ? OR code LIKE ? COLLATE NOCASE', [`%${query}%`,`%${query}%`]);
    },
}

export default ItemsRepository;