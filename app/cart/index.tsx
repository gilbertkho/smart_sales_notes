import ThemedButton from "@/components/button";
import { ThemedView } from '@/components/themed-view';
import styles from '@/config/style';
import { router } from "expo-router";
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const CartScreen = () => {

    const [cart, setCart] = useState([
        {
            date: '2024-01-01',
            customer: 'Customer A',
            address: 'Jl. Example No. 123',
            items: [
                {id: 1, name: 'Barang A', quantity: 2, price: 10000},
                {id: 2, name: 'Barang B', quantity: 1, price: 60000}
            ],
            total: 80000
        },
        {
            date: '2024-01-01',
            customer: 'Customer B',
            address: 'Jl. Example No. 123',
            items: [
                {id: 1, name: 'Barang A', quantity: 2, price: 10000},
                {id: 2, name: 'Barang B', quantity: 1, price: 60000}
            ],
            total: 80000
        },
        {
            date: '2024-01-01',
            customer: 'Customer C',
            address: 'Jl. Example No. 123',
            items: [
                {id: 1, name: 'Barang A', quantity: 2, price: 10000},
                {id: 2, name: 'Barang B', quantity: 1, price: 60000}
            ],
            total: 80000
        },
    ]);

    return (
        <ThemedView style={styles.mainView}>
            <FlatList
                data={cart}
                keyExtractor={(item, key) => key.toString()}
                style={{borderRadius: 5}}
                renderItem={({ item }) => (
                    <View style={cartStyles.cartItems}>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={styles.cartItemTitle}>{item.date}</Text>
                            <ThemedButton text="X" textColor='white' color='#FF3B30' width={40} style={styles.button} onPress={() => {
                                const newCart = cart.filter(cartItem => cartItem !== item);
                                setCart(newCart);
                            }} />
                        </View>
                        <Text style={styles.cartItemText}>{item.customer}</Text>
                        <Text style={styles.cartItemText}>{item.address}</Text>
                        <Text style={styles.cartItemText}>Total: {item.total}</Text>
                        <View style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 5}}>
                            <ThemedButton text="View" textColor='white' color='#007AFF' style={styles.button} onPress={() => {router.push('/cart/detail')}} />
                            <ThemedButton text="Copy" textColor='white' color='#007AFF'  style={styles.button} onPress={() => {console.log('copy data: ', item)}} />
                        </View>
                    </View>
                )}
            />
        </ThemedView>
    )
}

const cartStyles = StyleSheet.create({
    cartItems: {
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
        gap: 2,
        borderColor: 'black',
        borderWidth: 1
    },
});

export default CartScreen;