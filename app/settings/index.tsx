
import ThemedButton from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import styles from "@/config/style";
import { TextInput, View } from "react-native";

export const unstable_settings = {
  anchor: '(home)', // Tells the app this is the home base
};

const SettingsScreen = () => {

    return(
        <ThemedView style={styles.mainView}>
            <View style={{flexGrow: 1, justifyContent:'center'}}>
                <ThemedText>Base URL:</ThemedText>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter Base URL"
                />
            </View>
            <ThemedButton text="Save Settings" textColor='white' color='#007AFF' width='100%' style={styles.button} onPress={() => alert('Settings Saved!')} />
        </ThemedView>
    )

}

export default SettingsScreen;