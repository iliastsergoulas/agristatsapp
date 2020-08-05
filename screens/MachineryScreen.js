import React, { Component } from 'react';
import {Dimensions,View,Image, FlatList,ActivityIndicator,TouchableOpacity} from 'react-native';
import { ListItem} from 'react-native-elements';
import TabBarIcon from '../components/TabBarIcon';
import * as Animatable from "react-native-animatable";

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT,} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;
function normalize(size) {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {return Math.round(PixelRatio.roundToNearestPixel(newSize))} 
    else {return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2}
};

class MachineryScreen extends Component {

  	renderSeparator = () => {return (<View style={{height: 1,width: '86%',backgroundColor: '#CED0CE',marginLeft: '14%',}}/>);};

  	renderItem = ({ item }) => (<Animatable.View animation="fadeInLeft" duration={500} delay={500} useNativeDriver>
    	<ListItem
      	leftAvatar={{ source: item.image , size:'large', imageProps:{resizeMode:'contain'}}}
      	title={item.companyname}
      	titleStyle={{fontSize:normalize(16)}}
      	onPress={() => this.props.navigation.navigate('MachineryDetails', { company:item.company, image: item.image})}
      	chevron={{ color: 'black',size:26 }}
    /></Animatable.View>);

  	render() {
	    const companies = [
	      	{companyname: 'Claas',company:'claas',image: require('../assets/images/claas.png'),},
	      	{companyname: 'Deutz Fahr',company:'deutzfahr',image: require('../assets/images/deutzfahr.png'),},
	      	{companyname: 'Fendt',company:'fendt',image: require('../assets/images/fendt.png'),},
	      	{companyname: 'John Deere',company:'deere',image: require('../assets/images/deere.png'),},
	      	{companyname: 'Mahindra',company:'mahindra',image: require('../assets/images/mahindra.png'),},
	      	{companyname: 'Massey Ferguson',company:'masseyferguson',image: require('../assets/images/masseyferguson.png'),},
	      	{companyname: 'New Holland',company:'newholland',image: require('../assets/images/newholland.png'),},
	    ];
	    return (
	      	<View style={{ flex: 1 }}>
		        <FlatList
		          	data={companies}
		          	renderItem={this.renderItem}
		          	keyExtractor={item => item.company}
		          	ItemSeparatorComponent={this.renderSeparator}
		          	removeClippedSubviews={true} // Unmount components when outside of window 
			    	initialNumToRender={7} // Reduce initial render amount
			    	maxToRenderPerBatch={7} // Reduce number in each render batch
			    	updateCellsBatchingPeriod={100} // Increase time between renders
			    	windowSize={7} // Reduce the window size
		        />
	      	</View>
	    );
  	}
}

MachineryScreen.navigationOptions = ({ navigation }) => ({
  	headerStyle: {backgroundColor: '#024B0D'},headerTintColor: '#ffffff',gestureEnabled: true,
  	headerRight: () => (
  		<View style={{flexDirection: 'row'}}>
  		<TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{marginRight:15}}><TabBarIcon name='settings'/></TouchableOpacity>
  		<TouchableOpacity onPress={() => navigation.navigate('Links')} style={{marginRight:15}}><TabBarIcon name='information-outline'/></TouchableOpacity>
  		</View>
  	),headerTitleStyle: { fontSize:normalize(25), textAlign: 'left', alignSelf: 'center', color:'white', },title: t('machinery'),
});

export default MachineryScreen;