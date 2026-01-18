
import ThemedButton from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { styles, stylesModal } from "@/config/style";
import { factoryReset } from "@/src/database/db_service";
import SettingsRepository from '@/src/database/settings_repository';
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";

const SettingsScreen = () => {
    const db = useSQLiteContext();
    const [settings, setSettings] = useState({
        base_url: ''
    });
    const [openModal, setOpenModal] = useState(false);

    useFocusEffect(
        //let check = axios.get(baseUrl)
        //console.log(check)
        useCallback(() => {
            console.log('BACK TO SETTINGS');
            console.log("INI SETTINGS", SettingsRepository.getAllSettings(db));
            SettingsRepository.getAllSettings(db).forEach((items) => {
                if(items.settings_name == "base_url"){
                    console.log('IZIN' , items);
                    setSettings({...settings, base_url: items.val});
                }
            });
        },[db])
    );

    const saveSettings = () => {
        try{
            SettingsRepository.saveSettings(db, settings);
            Toast.show('Settings saved!', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.TOP,
                backgroundColor: '#2ecc71',
                opacity: 0.9,
            });
        }
        catch(e){
            console.log(e);
        }
    }

    const handleReset = () => {
        factoryReset(db);
        setOpenModal(false);
    }

    return(
        <KeyboardAvoidingView style={{position:'relative', backgroundColor:'', display:'flex', flex: 1, width: '100%'}} behavior="padding">
            <Modal
                animationType="slide"
                transparent={true}
                visible={openModal}
                backdropColor={'black'}
                onRequestClose={() => {
                    alert('Modal has been closed.');
                    setOpenModal(!openModal);
                }}>
                <View style={stylesModal.centeredView}>
                    <View style={{...stylesModal.modalView, gap: 10}}>
                        <Text style={stylesModal.modalText}>Alert !</Text>
                        <Text style={{textAlign: 'center'}}>
                            Pressing confirm wil erase all of the data saved.
                            Press cancel to cancel this operation, or confirm if aware.
                        </Text>
                        <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
                            <Pressable
                                style={[stylesModal.button, stylesModal.buttonClose]}
                                onPress={() => setOpenModal(!openModal)}>
                                <Text style={stylesModal.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[stylesModal.button, stylesModal.buttonClose, ]}
                                onPress={() => handleReset()}>
                                <Text style={stylesModal.textStyle}>Confirm</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <ScrollView style={{padding: 10}}>
                <View style={{flex: 1}}>
                    <View style={{display: 'flex', gap: 10}}>
                        <View>
                            <ThemedText>Base URL:</ThemedText>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Base URL"
                                value={settings.base_url}
                                onChangeText={(text) => setSettings({...settings, base_url: text})}
                            />
                        </View>
                        <TouchableOpacity
                            style={{...styles.bgDanger, height: 40, borderRadius: 5, display:'flex', alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => setOpenModal(true)}
                        >
                            <Text style={{textAlign: 'center', color: 'white'}}>Factory Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <View style={{position: 'absolute' ,bottom: 0, padding: 10, width: '100%'}}>
                <ThemedButton 
                    text="Save Settings" 
                    textColor='white' 
                    color='#007AFF' 
                    width='100%' 
                    style={styles.button} 
                    onPress={() => saveSettings()} 
                />
            </View>
        </KeyboardAvoidingView>
    )

}

export default SettingsScreen;