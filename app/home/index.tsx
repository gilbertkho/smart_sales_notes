import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";

const HomeScreen = () => {
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date().toDateString() + ' ' + new Date().toLocaleTimeString());
    const [barang, setBarang] = useState([
        {
            id: 1,
            name: 'Barang A',
            price: 10000,
            kode: 'A001'        
        },
        {
            id: 2,
            name: 'Barang B',
            price: 60000,
            kode: 'A002'        
        },
        {
            id: 3,
            name: 'Barang C',
            price: 100000,
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

    return (
        <ThemedView style={styles.mainView}>
            <TouchableOpacity style={styles.buttton}>
                <ThemedText type="button" style={{textAlign: 'center'}}>Sync</ThemedText>
            </TouchableOpacity>
            <ThemedText type="">Last Update: {lastUpdateTime}</ThemedText>
            <FlatList
                style = {styles.list}
                data={barang}
                renderItem={({item}) => (
                    <ThemedView style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <ThemedText type="default">{item.name}</ThemedText>
                        <ThemedText type="default">{item.price}</ThemedText>
                        <Button title="+" onPress={() => addToCart(item)}></Button>
                    </ThemedView>
                )}
                keyExtractor={(item,key) => key.toString()}
                nestedScrollEnabled={true}
            />
            <ThemedView style={{height:'50%', backgroundColor:'blue'}}>
                <ThemedText>Cart</ThemedText>
                 <FlatList
                    style = {styles.listCart}
                    data={cart}
                    renderItem={({item}) => (
                        <ThemedView style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Button title="-" onPress={() => {removeFromCart(item)}}></Button>
                            <ThemedText type="default">{item.name}</ThemedText>
                            <ThemedText type="default">{item.price}</ThemedText>
                        </ThemedView>
                    )}
                    keyExtractor={(item,key) => key.toString()}
                    nestedScrollEnabled={true}
                />
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        padding:10,
        gap:10,
        backgroundColor: 'red',
    },
    buttton: {
        width: 100,
        height: 40,
        justifyContent:'center',
        backgroundColor:'#007AFF', 
        borderRadius:5
    },
    list: {
        height: 10,
        backgroundColor: 'white',
    },
    listCart: {
        height: 10,
        backgroundColor: 'green'
    } 
});

export default HomeScreen;