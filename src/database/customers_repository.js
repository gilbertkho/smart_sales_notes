const CustomersRepository = {
    saveCustomers: (db, customers) => {
        db.withTransactionSync(() => {
            customers.forEach((i) => {
                db.runSync('INSERT OR REPLACE INTO customers (id, name, address) VALUES (?,?,?)',
                    [i.id, i.name, i.address]
                );
            });
        });
    },
    getAllCustomers: (db) => {
        return db.getAllSync('SELECT * FROM customers');
    },
    searchCustomers: (db, query) => {
        return db.getAllSync('SELECT * FROM customers WHERE name LIKE ? COLLATE NOCASE', [`%${query}%`])
    }

}

export default CustomersRepository