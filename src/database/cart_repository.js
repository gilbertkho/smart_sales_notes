import { db } from './db_service';

const CartRepository = {
    saveCart: (cart) => {
        db.withTransactionSync(() => {
            db.runSync('INSERT OR REPLACE INTO cart (id, date, customer_id, total) VALUES (?,?,?,?)',
                ['', cart.date, cart.customer_id, cart.total]
            );
            cart.items.forEach((i) => {
                db.runSync('INSERT OR REPLACE INTO cart_detail (id, cart_id, item_id, quantity) VALUES (?,?,?,?)',
                    [i.id, i.cart_id, i.item_id, i.quantity]
                );
            });
        });
    },
    getAllCart: () => {
        return db.getAllSync('SELECT * FROM cart');
    },
    getAllCartDetail: () => {
        return db.getAllSync('SELECT cd.* FROM cart_detail cd, items i WHERE cd.item_id = i.id');
    },
    deleteCart: (cartId) => {
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