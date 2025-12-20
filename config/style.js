import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    mainView: {
        display: 'flex',
        flexGrow: 1,
        overflowY: 'scroll',
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
    bgPrimaryBlue {
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
        height:40, 
        width:'100%',
        borderColor:'gray', 
        borderWidth:1, 
        paddingLeft:10, 
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

export default styles;