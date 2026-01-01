import { StyleSheet, Text, View } from 'react-native';

const MyEmptyListMessage = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyMessageText}>
      You have no items in your list.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    // Add styling for your empty message container
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyMessageText: {
    fontSize: 16,
    textAlign: 'center',
  },
  centerEmptyList: {
    flexGrow: 1, // Ensures the empty component can be centered vertically if the list container has a flex style
    justifyContent: 'center',
  }
});

export default MyEmptyListMessage;