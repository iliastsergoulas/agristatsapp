import React, { Component } from 'react';
import { View,Image, FlatList,ActivityIndicator,Dimensions,Text,PixelRatio,Linking,TouchableOpacity} from 'react-native';
import {Card,ListItem} from 'react-native-elements';
import TabBarIcon from '../components/TabBarIcon';
import * as Animatable from "react-native-animatable";

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT,} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;
function normalize(size) {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {return Math.round(PixelRatio.roundToNearestPixel(newSize))} 
    else {return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2}
}

class GrantsScreen extends Component {

  	renderSeparator = () => {return (<View style={{height: 1,width: '86%',backgroundColor: '#CED0CE',marginLeft: '14%',}}/>);};

  	renderItem = ({ item }) => (<Animatable.View animation="fadeInLeft" duration={500} delay={500} useNativeDriver>
    	<ListItem
      	leftAvatar={{ source: item.image , size:'large', imageProps:{resizeMode:'contain',backgroundColor:"white"}}}
      	leftAvatarStyle={{backgroundColor:'#FFF' }}
      	title={item.measurename}
      	titleStyle={{fontSize:16}}
      	onPress={() => this.props.navigation.navigate('GrantsDetails', { measure:item.measure, image: item.image})}
      	chevron={{ color: 'black',size:26 }}
    /></Animatable.View>);

  	render() {
	    const measures = [
	      	{measurename: 'Μεταποίηση γεωργικών προϊόντων',measure:'processing',image: require('../assets/images/factory.png'),},
	      	{measurename: 'Σχέδια Βελτίωσης',measure:'svel',image: require('../assets/images/tractor.png'),},
	      	{measurename: 'Βιολογική καλλιέργεια/κτηνοτροφία',measure:'organic',image: require('../assets/images/organic.png'),},
	      	{measurename: 'Γεωργοπεριβαλλοντικά',measure:'environ',image: require('../assets/images/environ.png'),},
	      	{measurename: 'Εξισωτική αποζημίωση',measure:'equal',image: require('../assets/images/equal.png'),},
	      	{measurename: 'Ομάδες/Οργανώσεις Παραγωγών & Συνεργασίες',measure:'groups',image: require('../assets/images/groups.png'),},
	      	{measurename: 'Νέοι Γεωργοί & Μικρές εκμεταλλεύσεις',measure:'farmer',image: require('../assets/images/farmer.png'),},
	      	{measurename: 'Επενδύσεις πρόληψης ζημιών',measure:'risk',image: require('../assets/images/risk.png'),},
	      	{measurename: 'CLLD/Leader',measure:'local',image: require('../assets/images/local.png'),},
	      	{measurename: 'Πρόωρη συνταξιοδότηση',measure:'retirement',image: require('../assets/images/retirement.png'),},
	      	{measurename: 'Άμεσες ενισχύσεις',measure:'directaid',image: require('../assets/images/directaid.png'),},
	      	{measurename: 'Συνδεδεμένες ενισχύσεις',measure:'linked',image: require('../assets/images/linked.png'),},
	      	{measurename: 'de minimis',measure:'deminimis',image: require('../assets/images/deminimis.png'),},
	      	{measurename: 'Παροχή συμβουλών',measure:'advisor',image: require('../assets/images/advisor.png'),},
	      	{measurename: 'Προώθηση οίνων',measure:'wine',image: require('../assets/images/wine.png'),},
	      	{measurename: 'Δημόσια Έργα',measure:'dimosia',image: require('../assets/images/dimosia.png'),},
	      	{measurename: 'Δασικά',measure:'forest',image: require('../assets/images/forest.png'),},
			{measurename: 'Αλιεία',measure:'fish',image: require('../assets/images/fish.png'),},
	    ];
	    return (
	      	<View style={{ flex: 1 }}>
	      		<TouchableOpacity onPress={() => this.props.navigation.navigate('Webview', { url:"https://dip.opekepe.gr/"})}>
	      			<Card
		                featuredTitle='Δείτε αν πληρωθήκατε' containerStyle={{borderWidth: 0,elevation: 0}}
		                featuredSubtitle='Χρήση δημοσιευμένων δεδομένων του Υπουργείου Αγροτικής Ανάπτυξης και Τροφίμων, βάσει άρθρου 1 παρ.1 του Ν. 4305/2014.'
		                featuredSubtitleStyle={{textAlign:'justify',fontSize:normalize(12)}} featuredTitleStyle={{textAlign:'center'}}
		                image={require('../assets/images/tree.jpg')}>
		            </Card>
              	</TouchableOpacity>
		        <FlatList
		          	data={measures}
		          	renderItem={this.renderItem}
		          	keyExtractor={item => item.measure}
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

GrantsScreen.navigationOptions = ({ navigation }) => ({
  	headerStyle: {backgroundColor: '#024B0D'},headerLeft: () => (<Image source={require('../assets/images/icon.png')} style={{ marginLeft:5, width: 50, height: 50 }}/>),gestureEnabled: true,
  	headerRight: () => (
  		<View style={{flexDirection: 'row'}}>
  		<TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{marginRight:15}}><TabBarIcon name='settings'/></TouchableOpacity>
  		<TouchableOpacity onPress={() => navigation.navigate('Links')} style={{marginRight:15}}><TabBarIcon name='information-outline'/></TouchableOpacity>
  		</View>
  	),
  	headerTitleStyle: { fontSize:normalize(25), textAlign: 'left', alignSelf: 'center', color:'white', },title: t('grants'),
});

export default GrantsScreen;