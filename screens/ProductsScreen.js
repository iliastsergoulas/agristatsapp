import React, { Component } from 'react';
import {Dimensions,Image,View, Text, FlatList, ActivityIndicator,TouchableOpacity} from 'react-native';
import { ListItem} from 'react-native-elements';
import TabBarIcon from '../components/TabBarIcon';
import * as Animatable from "react-native-animatable";

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT,} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;
function normalize(size) {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {return Math.round(PixelRatio.roundToNearestPixel(newSize))} 
    else {return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2}
}

class ProductsScreen extends Component {

  	renderSeparator = () => {return (<View style={{height: 1,width: '86%',backgroundColor: '#CED0CE',marginLeft: '14%',}}/>);};

  	renderItem = ({ item }) => (<Animatable.View animation="fadeInLeft" duration={500} delay={500} useNativeDriver>
    	<ListItem
      	leftAvatar={{ source: item.image , size:'large', imageProps:{resizeMode:'contain',backgroundColor:"white"}}}
      	title={item.productlabel}
      	titleStyle={{fontSize:normalize(22)}}
      	onPress={() => this.props.navigation.navigate('Prices', { product:item.product, image: item.image})}
      	chevron={{ color: 'black',size:26 }}
    /></Animatable.View>);

  	render() {
	    const products = [
	    	{product: 'Bananas',productlabel:t('bananas'),image: require('../assets/images/banana.png'),},
	    	{product: 'Beef',productlabel:t('beef'),image: require('../assets/images/beef.png'),},
	    	{product: 'Butter',productlabel:t('butter'),image: require('../assets/images/butter.png'),},
	    	{product: 'Carbon',productlabel:t('carbon'),image: require('../assets/images/carbon.png'),},
	    	{product: 'Cocoa',productlabel:t('cocoa'),image: require('../assets/images/cocoa.png'),},
	      	{product: 'Coffee',productlabel:t('coffee'),image: require('../assets/images/coffee.png'),},
	      	{product: 'Corn',productlabel:t('corn'),image: require('../assets/images/corn.png'),},
	      	{product: 'Cotton',productlabel:t('cotton'),image: require('../assets/images/cotton.png'),},
	      	{product: 'Dairy',productlabel:t('dairy'),image: require('../assets/images/dairy.png'),},
	      	{product: 'Indexes',productlabel:t('indexes'),image: require('../assets/images/index.png'),},
	      	{product: 'Meat',productlabel:t('meat'),image: require('../assets/images/meat.png'),},
	      	{product: 'Oats',productlabel:t('oats'),image: require('../assets/images/oat.png'),},
	      	{product: 'Oils',productlabel:t('oils'),image: require('../assets/images/oil.png'),},
	      	{product: 'Oranges',productlabel:t('oranges'),image: require('../assets/images/orange.png'),},
	      	{product: 'Rice',productlabel:t('rice'),image: require('../assets/images/rice.png'),},
	      	{product: 'Shrimps',productlabel:t('shrimps'),image: require('../assets/images/shrimp.png'),},
	      	{product: 'Sugar',productlabel:t('sugar'),image: require('../assets/images/sugar.png'),},
	      	{product: 'Tea',productlabel:t('tea'),image: require('../assets/images/tea.png'),},
	      	{product: 'Tobacco',productlabel:t('tobacco'),image: require('../assets/images/tobacco.png'),},
	      	{product: 'Vegetables',productlabel:t('vegetables'),image: require('../assets/images/plants.png'),},
	      	{product: 'Wheat',productlabel:t('wheat'),image: require('../assets/images/wheat.png'),},
	      	{product: 'Wool',productlabel:t('wool'),image: require('../assets/images/wool.png'),},
	    ];
	    return (
	      	<View style={{ flex: 1 }}>
		        <FlatList
		          	data={products}
		          	renderItem={this.renderItem}
		          	keyExtractor={item => item.product}
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

ProductsScreen.navigationOptions = ({ navigation }) => ({
  	headerStyle: {backgroundColor: '#024B0D'},headerLeft: () => (<Image source={require('../assets/images/icon.png')} style={{ marginLeft:5, width: 50, height: 50 }}/>),
  	headerRight: () => (
  		<View style={{flexDirection: 'row'}}>
  		<TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{marginRight:15}}><TabBarIcon name='settings'/></TouchableOpacity>
  		<TouchableOpacity onPress={() => navigation.navigate('Links')} style={{marginRight:15}}><TabBarIcon name='information-outline'/></TouchableOpacity>
  		</View>
  	),gestureEnabled: true,
  	headerTitleStyle: { fontSize:normalize(25), textAlign: 'left', alignSelf: 'center', color:'white', },title: t('prices'),
});

export default ProductsScreen;