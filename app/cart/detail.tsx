import ThemedButton from "@/components/button";
import PageHeader from "@/components/pageHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { styles } from "@/config/style";
import thousandSeparator from "@/config/thousandSeparator";
import CartRepository from "@/src/database/cart_repository";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const CartDetail = () => {
  const db = useSQLiteContext();
  let params = useLocalSearchParams();
  const [cartId, setCartId] = useState({});
  const [cartDetail, setCartDetail] = useState({
    date: '2024-01-01',
    customer: 'Customer A',
    address: 'Jl. Example No. 123',
    items: [
        {id: 1, kode: 'A001', name: 'Barang A', satuan: 'Karton', quantity: 2, price: 10000},
        {id: 2, kode: 'A002', name: 'Barang B', satuan: 'Pcs', quantity: 1, price: 60000}
    ],
    total: 80000
  })

  useFocusEffect(
    useCallback(() => {
      console.log("INI CART DETAIL",params);
      setCartId(params)
    },[db, params.id])
  );

  useEffect(() => {
    if(cartId.id){
      console.log(cartId);
      getCartFromDB(cartId);
    }
  },[cartId]);

  useEffect(() => {
    countTotal();
  },[cartDetail.items]);

  const getCartFromDB = ({id}) => {
    let cart = CartRepository.getCartById(db, id);
    //console.log(cart);
    setCartDetail(cart);
  }

  const countTotal = () => {
    let cartTotal = 0;
    cartDetail.items.forEach((item) => {
      cartTotal += item.quantity * item.price;
    })

    setCartDetail({...cartDetail, total: cartTotal});
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

  return (
    <View style={{overflow: 'scroll', height: '100%', backgroundColor: 'white'}}>
      <PageHeader title="Cart Detail"  backButton={true} onBackPress={() => router.push('/cart')} />
      <ThemedView style={{padding: 10, gap: 10, overflow: 'scroll', flexGrow: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{cartDetail.name  ? cartDetail.name :  cartDetail.customer_id}</Text>
            <Text style={{fontSize: 14}}>{cartDetail.address}</Text>
          </View>
          <Text style={{fontWeight: 'bold'}}>
            {cartDetail.date}
          </Text>
        </View>
        {/* <Cart items={cartDetail.items} increaseFunction={(item) => incQty(item)} decreaseFunction = {(item) => dcrQty(item)} /> */}
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
      <View style={{padding: 10, gap: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Total:</Text>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Rp. {thousandSeparator(cartDetail.total)}</Text>
        </View>
        <ThemedButton text="Save" textColor='white' color='#34C759' width='100%' style={styles.button} onPress={() => alert('Checkout Success!')} />
      </View>
    </View>
  )
}

export default CartDetail;