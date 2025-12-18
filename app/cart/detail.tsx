import ThemedButton from "@/components/button";
import PageHeader from "@/components/pageHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import styles from "@/config/style";
import thousandSeparator from "@/config/thousandSeparator";
import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const CartDetail = () => {
  
  const [cartDetail, setCartDetail] = useState({
    date: '2024-01-01',
    customer: 'Customer A',
    address: 'Jl. Example No. 123',
    items: [
        {id: 1, name: 'Barang A', satuan: 'Karton', quantity: 2, price: 10000},
        {id: 2, name: 'Barang B', satuan: 'Pcs', quantity: 1, price: 60000}
    ],
    total: 80000
  })

  return (
    <View style={{overflow: 'scroll', height: '100%', backgroundColor: 'white'}}>
      <PageHeader title="Cart Detail"  backButton={true} onBackPress={() => router.push('/cart')} />
      <ThemedView style={{padding: 10, gap: 10, overflow: 'scroll', flexGrow: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{cartDetail.customer}</Text>
            <Text style={{fontSize: 14}}>{cartDetail.address}</Text>
          </View>
          <Text style={{fontWeight: 'bold'}}>
            {cartDetail.date}
          </Text>
        </View>
        <FlatList
          style = {styles.list}
          data={cartDetail.items}
          keyExtractor={(item, key) => key.toString()}
          renderItem={({ item }) => (
            <ThemedView style={styles.listItem}>
                <View>
                    <ThemedText type="default" style={{fontWeight: 'bold'}}>{item.name}</ThemedText>
                    <ThemedText type="default">{item.satuan}</ThemedText>
                </View>
                <ThemedText type="default">{thousandSeparator(item.price)}</ThemedText>
                <Button title="-" onPress={() => addToCart(item)}></Button>
                <Button title="+" onPress={() => addToCart(item)}></Button>
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