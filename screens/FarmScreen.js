import React, { Component } from 'react';
import {ImageBackground,Image,View,Text,FlatList,ActivityIndicator,AsyncStorage,Button,RefreshControl,Dimensions,TouchableOpacity} from 'react-native';
import TabBarIcon from '../components/TabBarIcon';
import * as Animatable from "react-native-animatable";
import { ListItem, SearchBar, Card } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

class FarmScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
        error: null
      };
    }

    render() {
      if (this.state.loading) {return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>);};
      const { navigation } = this.props;
      return (
          <View style={{ flex: 1 }}>
             <TouchableOpacity onPress={() => navigation.navigate('Machinery')}>
              <Card
                featuredTitle={t('machinery')} containerStyle={{borderWidth: 0,elevation: 0}}
                image={require('../assets/images/tractor.jpg')}>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Land')}>
              <Card
                featuredTitle={t('land')} containerStyle={{borderWidth: 0,elevation: 0}}
                image={require('../assets/images/farm.jpg')}>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Meds')}>
              <Card
                featuredTitle={t('meds')} containerStyle={{borderWidth: 0,elevation: 0}}
                image={require('../assets/images/plants.jpg')}>
              </Card>
            </TouchableOpacity>
          </View>
      );
    }
}

FarmScreen.navigationOptions = ({ navigation }) => ({
  	headerStyle: {backgroundColor: '#024B0D'},headerTintColor: '#ffffff',headerLeft: () => (<Image source={require('../assets/images/icon.png')} style={{ marginLeft:5, width: 50, height: 50 }}/>),
  	headerRight: () => (
  		<View style={{flexDirection: 'row'}}>
  		<TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{marginRight:15}}><TabBarIcon name='settings'/></TouchableOpacity>
  		<TouchableOpacity onPress={() => navigation.navigate('Links')} style={{marginRight:15}}><TabBarIcon name='information-outline'/></TouchableOpacity>
  		</View>
  	),gestureEnabled: true,
  	headerTitleStyle: { fontSize:25, textAlign: 'left', alignSelf: 'center', color:'white', },title: t('farm'),
});

export default FarmScreen;