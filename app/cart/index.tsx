import { ThemedView } from '@/components/themed-view';
import MyEmptyListMessage from '@/components/ui/empty-list';
import { styles, stylesModal } from '@/config/style';
import thousandSeparator from "@/config/thousandSeparator";
import CartRepository from '@/src/database/cart_repository';
import SettingsRepository from '@/src/database/settings_repository';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-root-toast';

const cart = [{
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
}]

const CartScreen = () => {
    const [baseUrl, setBaseUrl] = useState('');
    let db = useSQLiteContext();
    const [cartList, setCartList] = useState([]);
    const [openDeleteCart, setOpenDeleteCart] = useState(false);
    const [selectedCart, setSelectedCart] = useState({});

    useFocusEffect(
        useCallback(() => {
            getCartFromDB();
            let baseUrlFromDB = SettingsRepository.getAllSettings(db);
            console.log("BASE URL SETTINGS", baseUrl);
            if(baseUrlFromDB.length > 0){
                baseUrlFromDB = baseUrlFromDB.filter((setting) => {
                    return setting.settings_name == "base_url" && setting.val != '';
                })
                setBaseUrl(baseUrlFromDB[0].val);
            }
            console.log("BASE URL SETTINGS", baseUrl);
        },[db])
    );

    const getCartFromDB = () => {
        const cart_header = CartRepository.getAllCart(db);
        const cart_detail = CartRepository.getAllCartDetail(db);
        let cart_fixed = [];
        console.log("HEADER",cart_header);
        console.log("DETAIL",cart_detail);
        if(cart_header.length > 0 && cart_detail.length > 0){
            for(let i = 0; i < cart_header.length; i++){
                let cart_items = cart_detail.filter((cd : any) => {
                    return cart_header[i].id === cd.cart_id
                })
                cart_fixed.push({
                    id: cart_header[i].id,
                    date: cart_header[i].date,
                    customer_id: cart_header[i].customer_id,
                    name: cart_header[i].name ?? cart_header[i].customer_id, //customer_name
                    address: cart_header[i].address, //customer_address
                    total: cart_header[i].total,
                    is_sent: cart_header[i].is_sent,
                    items: cart_items,
                })
            };
            if(cart_fixed.length > 0) setCartList(cart_fixed);
            console.log(cart_fixed[0]);
        }
        else{
            setCartList([]);
        }
    }

    const handleDeleteCart = () => {
        if(selectedCart.id != '') CartRepository.deleteCart(db, selectedCart.id);
        setOpenDeleteCart(false);
        getCartFromDB();
    }

    useEffect(() => {
        console.log('SELECTED CART', selectedCart);
    },[selectedCart])


    const copyToClipboard = async (text) => {
        console.log(text);
        Clipboard.setStringAsync(text);
        Toast.show('Cart data copied!', {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            backgroundColor: '#2ecc71',
            opacity: 0.9,
        });
    }

    const sendToPOS = async (cart) => {
        console.log("BASE URL", baseUrl);
        try{
            let responseBarang = await axios.post(`http://${baseUrl}/pos-agape/smart/sync`, cart);
            console.log(responseBarang);
            //update is_sent status
            CartRepository.markCartAsSent(db, cart.id);
            getCartFromDB();
            Toast.show('Cart Successfully Sent!', {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                backgroundColor: '#2ecc71',
                opacity: 0.9,
            });
        }
        catch(error){
            console.log(error);
            Toast.show('Cart failed to sent! Please check your connection', {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                backgroundColor: '#e54f53',
                opacity: 0.9,
            });
        }   
    }

    return (
        <ThemedView style={styles.mainView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={openDeleteCart}
                backdropColor={'black'}
                onRequestClose={() => {
                    setOpenDeleteCart(!openDeleteCart);
                }}>
                <View style={stylesModal.centeredView}>
                    <View style={{...stylesModal.modalView, gap: 10}}>
                        <Text style={stylesModal.modalText}>Alert !</Text>
                        <Text style={{textAlign: 'center'}}>
                          Are you sure to delete this cart from
                          <Text style={{fontWeight:'bold'}}> {selectedCart.name} </Text>
                          with the total of 
                          <Text style={{fontWeight:'bold'}}> {thousandSeparator(selectedCart.total)}</Text>?
                        </Text>
                        <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
                            <Pressable
                                style={[stylesModal.button, stylesModal.buttonClose]}
                                onPress={() => setOpenDeleteCart(!openDeleteCart)}>
                                <Text style={stylesModal.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[stylesModal.button, stylesModal.buttonClose, ]}
                                onPress={() => handleDeleteCart()}>
                                <Text style={stylesModal.textStyle}>Confirm</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <FlatList
                data={cartList}
                keyExtractor={(item, key) => key.toString()}
                style={{borderRadius: 5}}
                ListEmptyComponent={MyEmptyListMessage}
                renderItem={({item}) => (
                    <View style={cartStyles.cartItems}>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={{...styles.cartItemTitle, fontWeight:'bold'}}>{item.date}</Text>
                            <TouchableOpacity 
                                style={{backgroundColor:'#e54f53', width: 40, height: 40, display: 'flex', alignItems:'center', justifyContent:'center', borderRadius: 5, borderWidth: 3, borderColor: '#e54f53'}} 
                                onPress={() => {
                                    // const newCart = cartList.filter(cartItem => cartItem !== item);
                                    // setCartList(newCart);
                                    setOpenDeleteCart(true);
                                    setSelectedCart(item);
                                    console.log("ITEM SELECTED", item);
                                }}
                            >
                                <Ionicons name={'close-outline'} color={'white'} size={24}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={{...styles.cartItemText, fontWeight: 'bold'}}>{item.name}</Text>
                        <Text style={{...styles.cartItemText}}>{item.address}</Text>
                        <Text style={{...styles.cartItemText}}>Total: {thousandSeparator(item.total)}</Text>
                        <View style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 5}}>
                            <TouchableOpacity 
                                style={{...styles.bgPrimary, flexGrow: 1, height: 40, display: 'flex', alignItems:'center', justifyContent:'center', borderRadius: 5}} 
                                disabled = {item.id == null || item.id == '' || !Object.hasOwn(item, 'id') ? true : false}
                                onPress={() => {
                                    console.log('SELECTED CART', item.id);
                                    router.push({pathname: '/cart/detail', params: {id: JSON.stringify(item.id)}})
                                }}
                            >
                                <Ionicons name={'eye-outline'} color={'white'} size={24}/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{...styles.bgSuccess, flexGrow: 1, height: 40, display: 'flex', alignItems:'center', justifyContent:'center', borderRadius: 5}} 
                                onPress={() => {
                                    console.log("DATA COPIED", item);
                                    copyToClipboard(JSON.stringify(item));
                                }}
                            >
                                <Ionicons name={'copy-outline'} color={'white'} size={24}/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[item.is_sent === 0? styles.bgSuccess : styles.bgPrimary, {flexGrow: 1, height: 40, display: 'flex', alignItems:'center', justifyContent:'center', borderRadius: 5}]} 
                                onPress={() => {
                                    sendToPOS(item);
                                }}
                            >
                                <Ionicons name={'send-outline'} color={'white'} size={24}/>
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