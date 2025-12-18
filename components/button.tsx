import { TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";

const ThemedButton  = ({text, style,onPress, color, textColor, width, disabled}) => {

    return (
        <TouchableOpacity style={{...style, backgroundColor: disabled ? 'gray' : color, width: width ?? "auto", padding: 7} } onPress={onPress} disabled={disabled ?? false}>
            <ThemedText type="button" style={{textAlign: 'center', color: textColor}}>{text}</ThemedText>
        </TouchableOpacity>
    )
}

export default ThemedButton;