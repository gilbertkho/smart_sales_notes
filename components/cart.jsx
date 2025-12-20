import { Ionicons } from "@expo/vector-icons";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import styles from '../config/style';
import thousandSeparator from "../config/thousandSeparator";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

const Cart = (items, decreaseFunction, increaseFunction) => {
    return (
        <FlatList
            style = {styles.list}
            data={items}
            keyExtractor={(item, key) => key.toString()}
            renderItem={({ item, index}) => (
            <ThemedView style={styles.listItem}>
                <View>
                    <ThemedText type="default" style={{fontWeight: 'bold'}}>{item.name}</ThemedText>
                    <ThemedText type="default">{item.satuan}</ThemedText>
                </View>
                <ThemedText type="default">{thousandSeparator(item.price)}</ThemedText>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width: 100}}>
                    <TouchableOpacity style={{...styles.cartButton, ...styles.bgDanger}} onPress={decreaseFunction(item)}>
                    <Ionicons name="remove-outline" size={20} color={'white'}/>
                    </TouchableOpacity>
                    <Text style={{fontWeight:'bold'}}>{item.quantity}</Text>
                    <TouchableOpacity style={{...styles.cartButton, ...styles.bgPrimary}} onPress={increaseFunction(item)}>
                    <Ionicons name="add-outline" size={20} color={'white'}/>
                    </TouchableOpacity>
                </View>
            </ThemedView>
            )}
        />
    )
}

export default Cart;