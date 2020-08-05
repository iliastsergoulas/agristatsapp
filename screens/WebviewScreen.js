import React, { Component} from 'react';
import {Text,View,Image,TouchableOpacity,Dimensions,Platform,PixelRatio} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import TabBarIcon from '../components/TabBarIcon';
import { WebView } from 'react-native-webview';

class WebviewScreen extends Component {
  constructor(props) {super(props);this.state = {data: [],error: null,};}

  static navigationOptions = ({ screenProps: { t } }) => ({});

  render() {
    const { navigation } = this.props;
    let { t, locale } = this.props.screenProps;
    return <WebView source={{ uri: this.props.navigation.getParam('url') }} style={{ marginTop: 20 }} />;
  }
}

WebviewScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {backgroundColor: '#024B0D'},headerTintColor: '#ffffff',
  headerTitleStyle: { fontSize:25, textAlign: 'center', alignSelf: 'center', color:'white', },headerRight: () => (
    <View style={{flexDirection: 'row'}}>
    <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{marginRight:15}}><TabBarIcon name='settings'/></TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Links')} style={{marginRight:15}}><TabBarIcon name='information-outline'/></TouchableOpacity>
    </View>
  ),gestureEnabled: true,title: t('details'),
});

export default WebviewScreen;