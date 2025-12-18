import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title?: string;
  backButton?: boolean;
  onBackPress?: () => void;
};

const PageHeader: React.FC<Props> = ({ title = "", backButton = false, onBackPress }) => {
  return (
    <View style={styles.container}>
      {backButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={{ visibility: 'hidden' }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    height: 60,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",

  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
});

export default PageHeader;