import ThemedButton from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import styles from '@/config/style';
import thousandSeparator from "@/config/thousandSeparator";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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

    const [cartDetail, setCartDetail] = useState({
        date: '',
        customer: '',
        address: '',
        items: [],
        total: 0,
    });

    useEffect(() => {
        console.log(lastUpdateTime)
    }, []);

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
    
    useEffect(() => {
        countTotal();
    },[cartDetail.items]);

    const addToCart = (item: any) => {
        let items = [...cartDetail.items];
        //check if item exists
        let checkIdx = cartDetail.items.findIndex(existCart => {
            return existCart.id === item.id
        });
        console.log("CHECKKK", checkIdx);
        if (checkIdx <= -1){
            let cartItem = {...item, quantity: 1}; //add item to cart
            items.push(cartItem);
        }
        else{
            items[checkIdx].quantity++; //add item quantity
        }

        setCartDetail({...cartDetail,items: items});
    }

    const removeFromCart = (item: any) => {
        const index = cartDetail.items.findIndex(i => i.id === item.id);
        if (index > -1) {
            const newCart = [...cartDetail.items];
            newCart.splice(index, 1);
            setCartDetail({...cartDetail, items: newCart});
        }
    }

    const incQty = (item, index) => {
        let items = [...cartDetail.items];
        items[index].quantity++;
        
        setCartDetail({...cartDetail, items: items});
    }

    const dcrQty = (item, index) => {
        let items = [...cartDetail.items];
        if(items[index].quantity - 1 > 0){
            items[index].quantity--;
        }
        else{
            items.splice(index,1);
            //add modal confirmation
        }
        console.log(items);
        setCartDetail({...cartDetail, items: items});
    }

    const countTotal = () => {
        let cartTotal = 0;
        cartDetail.items.forEach((item) => {
            cartTotal += item.quantity * item.price;
        })

        setCartDetail({...cartDetail, total: cartTotal});
    }

    return (
        <View style={{display: 'flex', justifyContent: 'space-between', height: '100%', maxHeight: '100%'}}>
            <ThemedView style={{...styles.mainView, flexGrow: 1}}>
            <TouchableOpacity style={{width:30, height:30, borderRadius:100, display:'flex', alignItems:'center',  justifyContent:'center', backgroundColor:'#20a8ec'}} onPress={() => addToCart(item)}>
                <Ionicons name="add-outline" size={20} color={'white'}/>
            </TouchableOpacity>
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
                            renderItem={({item, index}) => (
                                <ThemedView style={styles.listItem}>
                                    <View>
                                        <ThemedText type="default" style={{fontWeight: 'bold'}}>{item.name}</ThemedText>
                                        <ThemedText type="">{item.satuan}</ThemedText>
                                    </View>
                                    <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', width: 100}}>
                                        <ThemedText type="default">{thousandSeparator(item.price)}</ThemedText>
                                        {/* <Button title="+" onPress={() => addToCart(item)}></Button> */}
                                        <TouchableOpacity style={{width:30, height:30, borderRadius:100, display:'flex', alignItems:'center',  justifyContent:'center', backgroundColor:'#20a8ec'}} onPress={() => addToCart(item)}>
                                            <Ionicons name="add-outline" size={20} color={'white'}/>
                                        </TouchableOpacity>
                                    </View>
                                </ThemedView>
                            )}
                            keyExtractor={(item,key) => key.toString()}
                            nestedScrollEnabled={true}
                        />
                    </ThemedView>
                    <ThemedView style={{gap: 10}}>
                        <ThemedText style={{fontWeight:'bold', fontSize: 18}}>Order {cartDetail.items.length > 0 ? cartDetail.items.length : ''}</ThemedText>
                        <View style={{zIndex: 100}}>
                            <View style={{flexDirection:'row', gap: 3, margin:0, position:'relative'}}>
                                <TextInput placeholder="Cari Customer" style={{...styles.textInput,marginBottom: 0}} onChangeText={(text) => searchCustomer(text)} value={searchTextCustomer}/>
                                {
                                    searchTextCustomer.length > 0 ?
                                    <TouchableOpacity style={{backgroundColor:'transparent', width: 40, display: 'flex', alignItems:'center', justifyContent:'center', borderRadius: 5, borderWidth: 3, borderColor: '#e54f53'}} onPress={() => clearSearchCustomer()}>
                                        <Ionicons name={'close-outline'} color={'#e54f53'} size={24}/>
                                    </TouchableOpacity> 
                                    : null
                                }
                            </View>
                            {
                                searchResultCustomer.length > 0 ?
                                <FlatList
                                    style = {styles.searchCustomerList}
                                    data = {searchResultCustomer}
                                    renderItem={({item}) => (
                                        <ThemedView style={{flexDirection:'column', justifyContent:'space-between', borderBottomWidth: 1, borderBottomColor: 'gray', width:'95%'}}>
                                            <ThemedText type="default" style={{fontWeight: 'bold'}}>{item.name}</ThemedText>
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
                            data={cartDetail.items}
                            keyExtractor={(item, key) => key.toString()}
                            renderItem={({ item, index}) => (
                                <ThemedView style={styles.listItem}>
                                    <View>
                                        <ThemedText type="default" style={{fontWeight: 'bold'}}>{item.name}</ThemedText>
                                        <ThemedText type="default">{item.satuan}</ThemedText>
                                    </View>
                                    <ThemedText type="default">{thousandSeparator(item.price)}</ThemedText>
                                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width: 100}}>
                                    <TouchableOpacity style={{...styles.cartButton, ...styles.bgDanger}} onPress={() => dcrQty(item, index)}>
                                        <Ionicons name="remove-outline" size={20} color={'white'}/>
                                    </TouchableOpacity>
                                    <Text style={{fontWeight:'bold'}}>{item.quantity}</Text>
                                    <TouchableOpacity style={{...styles.cartButton, ...styles.bgPrimary}} onPress={() => incQty(item, index)}>
                                        <Ionicons name="add-outline" size={20} color={'white'}/>
                                    </TouchableOpacity>
                                    </View>
                                </ThemedView>
                            )}
                        />
                    </ThemedView>
                </ThemedView>
                : null
            }
            </ThemedView>
            <View style={COStyles.checkOutContainer}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Total:</Text>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Rp. {thousandSeparator(cartDetail.total)}</Text>
                </View>
                <ThemedButton disabled={cartDetail.items.length <= 0 || cartDetail.customer == '' ? true : false}text="Checkout" textColor='white' color='green' width="100%" style={styles.button} onPress={() => {console.log("CHECKOUT")}} />
            </View>
        </View>
    );
}

const COStyles = StyleSheet.create({
    checkOutContainer: {
        padding: 10,
        gap: 10,
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