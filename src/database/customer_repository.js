import { db } from './db_service';

const CustomerRepository = {
    saveCustomers: (customers) => {
        db.withTransactionSync(() => {
            customers.forEach((i) => {
                db.runSync('INSERT OR REPLACE INTO customers (id, name, address) VALUES (?,?,?)',
                    [i.id, i.name, i.address]
                );
            });
        });
    },
    getAllCustomers: () => {
        return db.getAllSync('SELECT * FROM customers');
    },
    searchCustomers: (query) => {
        return db.getAllSync('SELECT * FROM customers WHERE name LIKE ?', [`%${query}%`])
    }

}

export default CustomerRepository