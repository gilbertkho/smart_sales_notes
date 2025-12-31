import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        padding:10,
        gap:10,
    },
    button: {
        width: 100,
        height: 40,
        justifyContent:'center',
        backgroundColor:'#007AFF', 
        borderRadius:5,
        color: 'white'
    },
    bgPrimary: { 
        backgroundColor: '#20a8ec'
    },
    bgPrimaryBlue: {
        backgroundColor: '#234de4'
    },
    bgDanger: {
        backgroundColor: '#e54f53'
    },
    bgSuccess: {
        backgroundColor: '#96ca5d'
    },
    cartButton: {
        width:30, 
        height:30, 
        borderRadius:100, 
        display:'flex', 
        alignItems:'center',  
        justifyContent:'center',
    },
    list: {
        minHeight: 200,
        flex: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: 'white'
    },
    listCart: {
        minHeight: 200,
        flex: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: 'white'
    },
    listItem: {
        flexDirection:'row', 
        justifyContent:'space-between', 
        alignItems:'center',
        borderBottomWidth: 2,
        borderBottomColor: 'lightgray',
        padding: 7, 
    },
    textInput: {
        height: 40,
        flexGrow: 1,
        borderColor: 'gray', 
        borderWidth: 1, 
        paddingLeft: 10, 
        borderRadius: 5
    },
    searchCustomerList: {
        padding: 5,
        gap: 5,
        maxHeight: 100,
        backgroundColor: 'white',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'gray',
        position: 'absolute',
        zIndex: 2,
        width: '100%',
        top: 40,
    }
});

export const stylesModal = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});