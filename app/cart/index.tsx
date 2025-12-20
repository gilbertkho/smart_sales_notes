import { ThemedView } from '@/components/themed-view';
import styles from '@/config/style';
import thousandSeparator from "@/config/thousandSeparator";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
                            <Text style={{...styles.cartItemTitle, fontWeight:'bold'}}>{item.date}</Text>
                            <TouchableOpacity 
                                style={{backgroundColor:'#e54f53', width: 40, height: 40, display: 'flex', alignItems:'center', justifyContent:'center', borderRadius: 5, borderWidth: 3, borderColor: '#e54f53'}} 
                                onPress={() => {
                                    const newCart = cart.filter(cartItem => cartItem !== item);
                                    setCart(newCart);
                                }}
                            >
                                <Ionicons name={'close-outline'} color={'white'} size={24}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={{...styles.cartItemText, fontWeight: 'bold'}}>{item.customer}</Text>
                        <Text style={{...styles.cartItemText}}>{item.address}</Text>
                        <Text style={{...styles.cartItemText}}>Total: {thousandSeparator(item.total)}</Text>
                        <View style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 5}}>
                            <TouchableOpacity 
                                style={{...styles.bgPrimary, flexGrow: 1, height: 40, display: 'flex', alignItems:'center', justifyContent:'center', borderRadius: 5}} 
                                onPress={() => {
                                    router.push('/cart/detail')
                                }}
                            >
                                <Ionicons name={'eye-outline'} color={'white'} size={24}/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{...styles.bgSuccess, flexGrow: 1, height: 40, display: 'flex', alignItems:'center', justifyContent:'center', borderRadius: 5}} 
                                onPress={() => {
                                    console.log("DATA COPIED", item);
                                }}
                            >
                                <Ionicons name={'copy-outline'} color={'white'} size={24}/>
                            </TouchableOpacity>
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