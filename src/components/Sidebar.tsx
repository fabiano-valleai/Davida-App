import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";


const { width, height } = Dimensions.get("window");

const Sidebar = () => {

  return (
      <View style={styles.mainContainer}>
        
      </View>
  )
}

const styles = StyleSheet.create({
    mainContainer: {
        height:  height * 1.0,
        width: width * 0.2,
    },
});
export default Sidebar;