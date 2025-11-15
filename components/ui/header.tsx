import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, StatusBar, ViewStyle, TextStyle, ImageStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";

type HeaderProps = {
  title: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  backImageStyle?: ImageStyle;
  onBackPress?: () => void;
};

const Header: React.FC<HeaderProps> = ({ title, style, titleStyle, backImageStyle, onBackPress }) => {
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity onPress={onBackPress ? onBackPress : () => navigation.goBack()}>
        <Image
          source={require('../../assets/backbutton.png')}
          style={[styles.backImage, backImageStyle]}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 12,
    borderBottomWidth: 3,
    borderBottomColor: "#1f2937",
    backgroundColor: 'white',
  },
  backImage: {
    width: 40,
    height: 40,
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: "#041a46ff",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: 'Snowball',
  },
});
