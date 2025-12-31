import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

const LoadingScreen = (visible = false) => {
    return(
       <Modal transparent visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.text}>Syncing Data...</Text>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    container: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center'
    },
    text: { marginTop: 10, fontWeight: 'bold' }
});

export default LoadingScreen;