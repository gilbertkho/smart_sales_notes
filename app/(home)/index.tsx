import ThemedButton from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import styles from '@/config/style';
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, TextInput, View } from "react-native";

const HomeScreen = () => {
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date().toDateString() + ' ' + new Date().toLocaleTimeString());
    const [customers, setCustomers] = useState([
        {id:1, name: 'Customer A', alamat: 'Alamat A'},
        {id:2, name: 'Customer B', alamat: 'Alamat B'},
        {id:3, name: 'Customer C', alamat: 'Alamat C'},
        {id:4, name: 'Customer D', alamat: 'Alamat D'},
        {id:5, name: 'Customer E', alamat: 'Alamat E'}
    ]);
    const [searchResultCustomer, setSearchResultCustomer] = useState([]);
    const [searchTextCustomer, setSearchTextCustomer] = useState('');
    const [barang, setBarang] = useState([
        {
            id: 1,
            name: 'Barang A',
            price: 10000,
            satuan: 'karton',
            kode: 'A001'
        },
        {
            id: 2,
            name: 'Barang B',
            price: 60000,
            satuan: 'lusin',
            kode: 'A002'         
        },
        {
            id: 3,
            name: 'Barang C',
            price: 100000,
            satuan: 'pcs',
            kode: 'A003'        
        }
    ]);

    const [cart, setCart] = useState([]);

    useEffect(() => {
        console.log(lastUpdateTime)
    }, []);

    const addToCart = (item: any) => {
        setCart([...cart, item]);
    }

    const removeFromCart = (item: any) => {
        const index = cart.findIndex(i => i.id === item.id);
        if (index > -1) {
            const newCart = [...cart];
            newCart.splice(index, 1);
            setCart(newCart);
        }
    }

    const searchCustomer = (text : any) => {
        setSearchTextCustomer(text);
        let result = customers.filter(customer => customer.name.toLowerCase().includes(text.toLowerCase()));
        console.log('RESULT', result);
        setSearchResultCustomer(result);
    }

    const clearSearchCustomer = () => {
        console.log('CLEAR INPUT CUSTOMER');
        setSearchTextCustomer('');
        setSearchResultCustomer([]);
    }

    useEffect(() => {
        if(searchTextCustomer.length <= 0){
            setSearchResultCustomer([]);
        }
    }, [searchTextCustomer]);

    return (
        <View style={{display: 'flex', justifyContent: 'space-between', height: '100%', maxHeight: '100%'}}>
            <ThemedView style={{...styles.mainView, flexGrow: 1}}>
            <ThemedButton text="Sync" textColor='white' color='#007AFF' width={100} style={styles.button} onPress={() => {
                setLastUpdateTime(new Date().toDateString() + ' ' + new Date().toLocaleTimeString());
            }} />
            <ThemedText type="">Last Update: {lastUpdateTime}</ThemedText>
            {
                barang.length > 0 ? 
                <ThemedView style={{display: 'flex', gap:10, backgroundColor:'white', height: 300, marginBottom: 10}}>
                    <ThemedView style={{backgroundColor:'white', gap:10}}>
                        <TextInput placeholder="Cari Barang" style={styles.textInput} />
                        <FlatList
                            style = {styles.list}
                            data={barang}
                            renderItem={({item}) => (
                                <ThemedView style={styles.listItem}>
                                    <View>
                                        <ThemedText type="default" style={{fontWeight: 'bold'}}>{item.name}</ThemedText>
                                        <ThemedText type="">{item.satuan}</ThemedText>
                                    </View>
                                    <ThemedText type="default">{item.price}</ThemedText>
                                    <Button title="+" onPress={() => addToCart(item)}></Button>
                                </ThemedView>
                            )}
                            keyExtractor={(item,key) => key.toString()}
                            nestedScrollEnabled={true}
                        />
                    </ThemedView>
                    <ThemedView style={{gap: 10}}>
                        <ThemedText>Order {cart.length > 0 ? cart.length : ''}</ThemedText>
                        <View style={{zIndex: 100}}>
                            <View style={{flexDirection:'row', gap: 5, margin:0, position:'relative'}}>
                                <TextInput placeholder="Cari Customer" style={{...styles.textInput,marginBottom: 0}} onChangeText={(text) => searchCustomer(text)} value={searchTextCustomer}/>
                                {
                                    searchTextCustomer.length > 0 ?
                                    <Button title="X" color={'red'} onPress={() => clearSearchCustomer()}></Button> : null
                                }
                            </View>
                            {
                                searchResultCustomer.length > 0 ?
                                <FlatList
                                    style = {styles.searchCustomerList}
                                    data = {searchResultCustomer}
                                    renderItem={({item}) => (
                                        <ThemedView style={{flexDirection:'column', justifyContent:'space-between', borderBottomWidth: 1, borderBottomColor: 'gray'}}>
                                            <ThemedText type="default">{item.name}</ThemedText>
                                            <ThemedText type="default">{item.alamat}</ThemedText>
                                        </ThemedView>
                                    )}
                                    keyExtractor={(item,key) => key.toString()}
                                    nestedScrollEnabled={true}
                                /> 
                                : null
                            }
                        </View>
                        <FlatList
                            style = {styles.list}
                            data={cart}
                            renderItem={({item}) => (
                                <ThemedView style={styles.listItem}>
                                    <View>
                                        <ThemedText type="default" style={{fontWeight: 'bold'}}>{item.name}</ThemedText>
                                        <ThemedText type="">{item.satuan}</ThemedText>
                                    </View>
                                    <Button title="-" onPress={() => {removeFromCart(item)}}></Button>
                                </ThemedView>
                            )}
                            keyExtractor={(item,key) => key.toString()}
                            nestedScrollEnabled={true}
                        />
                    </ThemedView>
                </ThemedView>
                : null
            }
            </ThemedView>
            <View style={COStyles.checkOutContainer}>
                <ThemedButton disabled={cart.length <=0 ? true : false}text="Checkout" textColor='white' color='green' width="100%" style={styles.button} onPress={() => {console.log("CHECKOUT")}} />
            </View>
        </View>
    );
}

const COStyles = StyleSheet.create({
    checkOutContainer: {
        padding: 10,
        zIndex: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
    }
});

export default HomeScreen;