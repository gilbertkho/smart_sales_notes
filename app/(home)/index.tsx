import ThemedButton from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import MyEmptyListMessage from "@/components/ui/empty-list";
import { styles, stylesModal } from "@/config/style";
import thousandSeparator from "@/config/thousandSeparator";
import CartRepository from "@/src/database/cart_repository";
import CustomersRepository from "@/src/database/customers_repository";
import ItemsRepository from "@/src/database/items_repository";
import SettingsRepository from "@/src/database/settings_repository";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Keyboard,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-root-toast";

// const barang = [
//     {
//         id: 1,
//         name: 'Barang A',
//         price: 10000,
//         units: 'karton',
//         code: 'A001'
//     },
//     {
//         id: 2,
//         name: 'Barang B',
//         price: 60000,
//         units: 'lusin',
//         code: 'A002'
//     },
//     {
//         id: 3,
//         name: 'Barang C',
//         price: 100000,
//         units: 'pcs',
//         code: 'A003'
//     }
// ];

// const customer = [
//     {id:1, name: 'Customer A', address: 'Alamat A'},
//     {id:2, name: 'Customer B', address: 'Alamat B'},
//     {id:3, name: 'Customer C', address: 'Alamat C'},
//     {id:4, name: 'Customer D', address: 'Alamat D'},
//     {id:5, name: 'Customer E', address: 'Alamat E'}
// ];

const HomeScreen = () => {
  let baseUrl = "";
  let db = useSQLiteContext();
  let inputRef = useRef(null);
  useFocusEffect(() => {
    baseUrl = SettingsRepository.getAllSettings(db);
    if (baseUrl.length > 0) {
      baseUrl = baseUrl.filter((setting) => {
        return setting.settings_name == "base_url" && setting.val != "";
      });
    } else {
      baseUrl = "";
    }
  });
  const [lastUpdateTime, setLastUpdateTime] = useState(
    new Date().toDateString() + " " + new Date().toLocaleTimeString(),
  );
  const [customers, setCustomers] = useState([]);
  const [searchResultCustomer, setSearchResultCustomer] = useState([]);
  const [searchTextCustomer, setSearchTextCustomer] = useState("");
  const [searchResultBarang, setSearchResultBarang] = useState([]);
  const [searchTextBarang, setSearchTextBarang] = useState("");
  const [barang, setBarang] = useState([]);
  const [cartDetail, setCartDetail] = useState({
    date: "",
    customer: "",
    items: [],
    total: 0,
  });
  const [showCOConfirmation, setShowCOConfirmation] = useState(false);

  useEffect(() => {
    //GET BARANG FROM DB
    let getBarang = ItemsRepository.getAllItems(db);
    console.log("TOTAL BARANG", getBarang.length);
    if (getBarang.length > 0) {
      console.log(getBarang[0]);
      setBarang(getBarang);
    }

    //GET CUSTOMER FROM DB
    let getCustomers = CustomersRepository.getAllCustomers(db);
    console.log("CUSTOMER LIST", getCustomers);
    if (getCustomers.length > 0) {
      console.log(getCustomers[0]);
      setCustomers(getCustomers);
    }

    //GET LAST UPDATE TIME FROM DB
    let getLastUpdateTime = SettingsRepository.getAllSettings(db);
    console.log("LAST UPDATE FROM DB", getLastUpdateTime);
    getLastUpdateTime = getLastUpdateTime.filter((time) => {
      return (
        time.settings_name == "sync_time" && time.val != "-" && time.val != ""
      );
    });
    console.log("FILTER RESULT", getLastUpdateTime);
    if (
      getLastUpdateTime.length > 0 &&
      getLastUpdateTime[0].val != "-" &&
      getLastUpdateTime[0].val! + ""
    ) {
      console.log("LAST UPDATED", getLastUpdateTime);
      setLastUpdateTime(getLastUpdateTime[0].val);
    } else {
      setLastUpdateTime("-");
    }
  }, []);

  const syncData = async () => {
    console.log("BASE URL", baseUrl);
    try {
      let responseBarang = await axios.get(
        `http://${baseUrl[0].val}/pos-agape/barang-smart`,
      );
      const { data } = responseBarang;
      if (data.length > 0) {
        setBarang(data);
        ItemsRepository.saveItems(db, data);
      }
      setLastUpdateTime(
        new Date().toDateString() + " " + new Date().toLocaleTimeString(),
      );
      Toast.show("Barang Successfully Synced!", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "#2ecc71",
        opacity: 0.9,
      });
    } catch (error) {
      console.log(error);
      Toast.show("Barang data fetch failed! Please check your connection", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "#e54f53",
        opacity: 0.9,
      });
    }

    try {
      let responseCustomers = await axios.get(
        `http://${baseUrl[0].val}/pos-agape/customer-smart`,
      );
      const { data } = responseCustomers;
      if (data.length > 0) {
        setCustomers(data);
        CustomersRepository.saveCustomers(db, data);
      }
      setLastUpdateTime(
        new Date().toDateString() + " " + new Date().toLocaleTimeString(),
      );
      Toast.show("Customers Successfully Synced!", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "#2ecc71",
        opacity: 0.9,
      });
    } catch (error) {
      console.log(error);
      Toast.show("Customers data fetch failed! Please check your connection", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "#e54f53",
        opacity: 0.9,
      });
    }
  };

  useEffect(() => {
    if (lastUpdateTime != "-" && lastUpdateTime != "") {
      SettingsRepository.saveSettings(db, { sync_time: lastUpdateTime });
      console.log("SAVED TIME", lastUpdateTime);
    }
  }, [lastUpdateTime]);

  const searchCustomer = (text: any) => {
    setSearchTextCustomer(text);
    let resultCustomer = [];
    resultCustomer = customers.filter((customer) => {
      return customer.name.toLowerCase().includes(text.toLowerCase());
    });
    let newCustomer = {
      id: 0,
      name: text,
      address: "",
    };

    resultCustomer.push(newCustomer);

    console.log("RESULT", resultCustomer);
    setSearchResultCustomer(resultCustomer);
  };

  const clearSearchCustomer = () => {
    console.log("CLEAR INPUT CUSTOMER");
    setSearchTextCustomer("");
    setSearchResultCustomer([]);
  };

  useEffect(() => {
    if (searchTextCustomer.length <= 0) {
      setSearchResultCustomer([]);
    }
  }, [searchTextCustomer]);

  useEffect(() => {
    countTotal();
  }, [cartDetail.items]);

  useEffect(() => {
    console.log("MY CART", cartDetail);
  }, [cartDetail]);

  const addToCart = (item: any) => {
    let items = [...cartDetail.items];
    //check if item exists in cart
    let checkIdx = cartDetail.items.findIndex((existCart) => {
      return existCart.id == item.id;
    });
    console.log("CHECKKK", checkIdx);
    if (checkIdx <= -1) {
      let cartItem = { ...item, quantity: 1 }; //add item to cart
      items.push(cartItem);
    } else {
      items[checkIdx].quantity++; //add item quantity
    }

    setCartDetail({ ...cartDetail, items: items });
  };

  const incQty = (item: any, index: number) => {
    let items = [...cartDetail.items];
    items[index].quantity++;

    setCartDetail({ ...cartDetail, items: items });
  };

  const dcrQty = (item: any, index: number) => {
    let items = [...cartDetail.items];
    if (items[index].quantity - 1 > 0) {
      items[index].quantity--;
    } else {
      items.splice(index, 1);
      //add modal confirmation
    }
    console.log(items);
    setCartDetail({ ...cartDetail, items: items });
  };

  const countTotal = () => {
    let cartTotal = 0;
    cartDetail.items.forEach((item) => {
      cartTotal += item.quantity * item.price;
    });

    setCartDetail({ ...cartDetail, total: cartTotal });
  };

  const selectCustomer = (cust: any) => {
    console.log("SELECTED CUSTOMER", cust);
    setSearchResultCustomer([]);
    setSearchTextCustomer(cust.name);
    setCartDetail({
      ...cartDetail,
      customer: cust.id == 0 ? cust.name : cust.id,
    });
  };

  const searchBarang = (text: string) => {
    setSearchTextBarang(text);
    if (text.trim().length > 0) {
      // 1. Split search text into words and lowercase them
      const searchWords = text.toLowerCase().trim().split(/\s+/);

      let resultBarang: any = barang.filter((item) => {
        const itemName = item.name.toLowerCase();
        const itemCode = item.code.toLowerCase();
        return searchWords.every(
          (word) => itemName.includes(word) || itemCode.includes(word),
        );
      });

      console.log("HASIL SEARCH", resultBarang.length);
      setSearchResultBarang(resultBarang);
    } else {
      clearSearchBarang();
    }
  };

  const clearSearchBarang = () => {
    setSearchResultBarang([]);
    setSearchTextBarang("");
  };

  const checkoutConfirmation = () => {
    setShowCOConfirmation(true);
  };

  const resetCart = () => {
    setCartDetail({
      date: "",
      customer: "",
      items: [],
      total: 0,
    });
    setSearchTextCustomer("");
  };

  const handleCheckout = () => {
    try {
      let cart = {
        date: new Date().toDateString() + " " + new Date().toLocaleTimeString(),
        customer_id: cartDetail.customer,
        items: cartDetail.items,
        total: cartDetail.total,
      };
      CartRepository.saveCart(db, cart);
      setShowCOConfirmation(false);
      resetCart();
    } catch (error) {
      console.log("SAVIN CART ERROR", error);
      Toast.show(
        "Error saving cart data to database, please contact the admin",
        {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          backgroundColor: "#e54f53",
          opacity: 0.9,
        },
      );
    }
  };

  return (
    <View style={{ justifyContent: "space-between", flex: 1 }}>
      {/* <LoadingScreen visible={true}/> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCOConfirmation}
        backdropColor={"black"}
        onRequestClose={() => {
          alert("Modal has been closed.");
          setShowCOConfirmation(!showCOConfirmation);
        }}
      >
        <View style={stylesModal.centeredView}>
          <View style={{ ...stylesModal.modalView, gap: 10 }}>
            <Text style={stylesModal.modalText}>Alert !</Text>
            <Text style={{ textAlign: "center" }}>
              Are you sure to submit cart for
              <Text style={{ fontWeight: "bold" }}> {searchTextCustomer} </Text>
              with the total of
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                {thousandSeparator(cartDetail.total)}
              </Text>
              ?
            </Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 20 }}>
              <Pressable
                style={[stylesModal.button, stylesModal.buttonClose]}
                onPress={() => setShowCOConfirmation(!showCOConfirmation)}
              >
                <Text style={stylesModal.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[stylesModal.button, stylesModal.buttonClose]}
                onPress={() => handleCheckout()}
              >
                <Text style={stylesModal.textStyle}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <ThemedView style={styles.mainView}>
        <TouchableOpacity
          style={{
            ...styles.bgPrimaryBlue,
            width: 100,
            height: 40,
            borderRadius: 100,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => syncData()}
        >
          <Ionicons name="sync-outline" size={20} color={"white"} />
          <ThemedText style={{ color: "white" }}>Sync</ThemedText>
        </TouchableOpacity>
        <Text>Last Update: {lastUpdateTime}</Text>

        <ThemedView style={{ backgroundColor: "", gap: 10, flex: 1 }}>
          <ThemedView style={{ backgroundColor: "", gap: 10, flex: 1 }}>
            <View style={{ flexDirection: "row", gap: 3, margin: 0 }}>
              <TextInput
                placeholder="Cari Barang"
                style={styles.textInput}
                value={searchTextBarang}
                onChangeText={(text) => searchBarang(text)}
              />
              {searchTextBarang.length > 0 ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: "transparent",
                    width: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    borderWidth: 3,
                    borderColor: "#e54f53",
                  }}
                  onPress={() => clearSearchBarang()}
                >
                  <Ionicons
                    name={"close-outline"}
                    color={"#e54f53"}
                    size={24}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            {searchResultBarang.length > 0 ? (
              <Text>{`Showing ${searchResultBarang.length} results`}</Text>
            ) : searchTextBarang.length <= 0 ? (
              ""
            ) : (
              <Text>{"Item not found"}</Text>
            )}
            <FlatList
              style={{ ...styles.list }}
              data={searchResultBarang.length > 0 ? searchResultBarang : barang}
              keyExtractor={(item, key) => key.toString()}
              nestedScrollEnabled={true}
              ListEmptyComponent={MyEmptyListMessage}
              renderItem={({ item, index }) => (
                <ThemedView style={{ ...styles.listItem }}>
                  <View style={{ width: "10%" }}>
                    <ThemedText type="default" style={{ fontWeight: "bold" }}>
                      {item.code.slice(-5)}
                    </ThemedText>
                  </View>
                  <View
                    style={{
                      width: "55%",
                      paddingLeft: 7,
                      borderColor: "grey",
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                    }}
                  >
                    <ThemedText type="default" style={{ fontWeight: "bold" }}>
                      {item.name}
                    </ThemedText>
                    <ThemedText type="">{item.units}</ThemedText>
                  </View>
                  <ThemedText
                    style={{ width: "15%", paddingLeft: 7 }}
                    type="default"
                  >
                    {thousandSeparator(item.price)}
                  </ThemedText>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      width: "20%",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#20a8ec",
                      }}
                      onPress={() => addToCart(item)}
                    >
                      <Ionicons name="add-outline" size={20} color={"white"} />
                    </TouchableOpacity>
                  </View>
                </ThemedView>
              )}
            />
          </ThemedView>
          <ThemedView style={{ backgroundColor: "", gap: 10, flex: 1 }}>
            <ThemedText style={{ fontWeight: "bold", fontSize: 18 }}>
              Order {cartDetail.items.length > 0 ? cartDetail.items.length : ""}
            </ThemedText>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 3,
                  margin: 0,
                  position: "relative",
                }}
              >
                <TextInput
                  placeholder="Cari Customer"
                  style={{ ...styles.textInput, marginBottom: 0 }}
                  onChangeText={(text) => searchCustomer(text)}
                  value={searchTextCustomer}
                  onBlur={Keyboard.dismiss}
                />
                {searchTextCustomer.length > 0 ? (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "transparent",
                      width: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                      borderWidth: 3,
                      borderColor: "#e54f53",
                    }}
                    onPress={() => clearSearchCustomer()}
                  >
                    <Ionicons
                      name={"close-outline"}
                      color={"#e54f53"}
                      size={24}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              {searchResultCustomer.length > 0 ? (
                <FlatList
                  style={styles.searchCustomerList}
                  data={searchResultCustomer}
                  keyExtractor={(item, key) => key.toString()}
                  nestedScrollEnabled={true}
                  ListEmptyComponent={MyEmptyListMessage}
                  renderItem={({ item }) => (
                    <ThemedView
                      style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderBottomWidth: 1,
                        borderBottomColor: "gray",
                        width: "95%",
                      }}
                    >
                      <TouchableOpacity onPress={() => selectCustomer(item)}>
                        <ThemedText
                          type="default"
                          style={{ fontWeight: "bold" }}
                        >
                          {item.name}
                        </ThemedText>
                        <ThemedText type="default">{item.address}</ThemedText>
                      </TouchableOpacity>
                    </ThemedView>
                  )}
                />
              ) : null}
            </View>
            <FlatList
              style={styles.listCart}
              data={cartDetail.items}
              keyExtractor={(item, key) => key.toString()}
              ListEmptyComponent={MyEmptyListMessage}
              renderItem={({ item, index }) => (
                <ThemedView style={{ ...styles.listItem }}>
                  <View style={{ width: "10%" }}>
                    <ThemedText type="default" style={{ fontWeight: "bold" }}>
                      {item.code.slice(-5)}
                    </ThemedText>
                  </View>
                  <View
                    style={{
                      width: "55%",
                      paddingLeft: 7,
                      borderColor: "grey",
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                    }}
                  >
                    <ThemedText type="default" style={{ fontWeight: "bold" }}>
                      {item.name}
                    </ThemedText>
                    <ThemedText type="default">{item.units}</ThemedText>
                  </View>
                  <ThemedText
                    style={{ width: "15%", paddingLeft: 7 }}
                    type="default"
                  >
                    {thousandSeparator(item.price)}
                  </ThemedText>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "20%",
                    }}
                  >
                    <TouchableOpacity
                      style={{ ...styles.cartButton, ...styles.bgDanger }}
                      onPress={() => dcrQty(item, index)}
                    >
                      <Ionicons
                        name="remove-outline"
                        size={20}
                        color={"white"}
                      />
                    </TouchableOpacity>
                    <Text style={{ fontWeight: "bold" }}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={{ ...styles.cartButton, ...styles.bgPrimary }}
                      onPress={() => incQty(item, index)}
                    >
                      <Ionicons name="add-outline" size={20} color={"white"} />
                    </TouchableOpacity>
                  </View>
                </ThemedView>
              )}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <View style={COStyles.checkOutContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Total:</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Rp. {thousandSeparator(cartDetail.total)}
          </Text>
        </View>
        <ThemedButton
          disabled={
            cartDetail.items.length <= 0 || cartDetail.customer == ""
              ? true
              : false
          }
          text="Checkout"
          textColor="white"
          color="green"
          width="100%"
          style={styles.button}
          onPress={() => {
            checkoutConfirmation();
          }}
        />
      </View>
    </View>
  );
};

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
    shadowRadius: 16.0,
    elevation: 24,
  },
});

export default HomeScreen;
