const CartRepository = {
    saveCart: (db, cart) => {
        try{
            db.withTransactionSync(() => {
                const headerResult = db.runSync('INSERT INTO cart (id, date, customer_id, total) VALUES (?,?,?,?)',
                    [null, cart.date, cart.customer_id, cart.total]
                );

                if(headerResult.changes > 0){
                    const newCartId = headerResult.lastInsertRowId;
                    console.log("NEW CART ID", newCartId);

                    cart.items.forEach((item) => {
                        const detailResult = db.runSync('INSERT INTO cart_detail (id, cart_id, item_id, quantity) VALUES (?,?,?,?)',
                            [null, newCartId, item.id, item.quantity]
                        );

                        if (detailResult.changes > 0) {
                            console.log(`- Item ${item.name} added.`);
                        }
                    });

                }
            });
        }
        catch(error){
            console.error("Transaction Failed. No data was saved:", error);
        }
    },
    getAllCart: (db) => {
        return db.getAllSync(
            `SELECT c.*, cs.name, cs.address FROM cart c LEFT JOIN customers cs ON c.customer_id = cs.id`);
    },
    getAllCartDetail: (db) => {
        return db.getAllSync('SELECT cd.*, i.* FROM cart_detail cd, items i WHERE cd.item_id = i.id');
    },
    getCartById: (db, id) => {
        try{
            let cartHeader = db.getFirstSync(
                `SELECT c.*, cs.name, cs.address 
                FROM cart c LEFT JOIN customers cs ON c.customer_id = cs.id 
                WHERE c.id = ?`,
                [id]
            );
            console.log("GOTCHA HEADER", cartHeader);
            let cartDetail = db.getAllSync(
                `SELECT cd.*, i.*
                FROM cart_detail cd, items i
                WHERE cd.item_id = i.id
                AND cd.cart_id = ?`,
                [id]
            );
            let cart = {
                id: cartHeader.id,
                date: cartHeader.date,
                customer_id: cartHeader.customer_id,
                name: cartHeader.name, //customer_name
                address: cartHeader.address, //customer_address
                total: cartHeader.total,
                items: cartDetail,
            }
            return cart;
        }
        catch(error){
            console.log('Failed to get cart by id', error);
        }
    },
    deleteCart: (db, cartId) => {
        try {
            db.runSync('DELETE FROM cart WHERE id= ?',[cartId]);
            db.runSync('DELETE FROM cart_detail WHERE cart_id= ?',[cartId]);
            return { success: true };
        } catch (error) {
            console.error("Clear cart failed", error);
            return { success: false };
        }
    }
}

export default CartRepository;