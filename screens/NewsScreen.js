import React, { Component } from 'react';
import { Image,View, Text, FlatList, ActivityIndicator, Linking, ScrollView, TouchableOpacity, Dimensions, Platform, PixelRatio} from 'react-native';
import { Card, SearchBar } from 'react-native-elements';
import TabBarIcon from '../components/TabBarIcon';
import * as Animatable from "react-native-animatable";
import AgristatsStore from './../mobx/AgristatsStore';
import { observer } from 'mobx-react';
import moment from 'moment';

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT,} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;
function normalize(size) {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {return Math.round(PixelRatio.roundToNearestPixel(newSize))} 
    else {return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2}
}

@observer
class NewsScreen extends Component {
  	constructor(props) {
	    super(props);
	    this.state = {loading: false,data: [],isRefreshing: false,error: null,};
  	}

  	static navigationOptions = ({ screenProps: { t } }) => ({});

  	componentDidMount() {
    	AgristatsStore.changeNewsLanguage(AgristatsStore.newslanguage);
    	this.setState({loading: true,});
  	};

  	renderSeparator = () => {return (<View style={{height: 1,width: '86%',backgroundColor: '#CED0CE',marginLeft: '14%',}}/>);};

  	searchFilterFunction = text => {
	    this.setState({value: text,});
	    AgristatsStore.changeNews(text);
  	};

  	renderItem = ({ item }) => (<View style={{ flex: 1, flexDirection: 'column', }}>
      	<TouchableOpacity style={{justifyContent: 'center'}} onPress={() => this.props.navigation.navigate('Webview', { url:item.url})}>
        	<Card
		        title={item.title}
		        titleStyle={{fontSize:normalize(12), }}
		        titleNumberOfLines={3}
		        image={{ uri: item.urltoimage }}
		        containerStyle={{ padding: 0, elevation: 0, borderWidth:0}}
		    ></Card>
		    <Text style={{textAlign:'center',fontSize:normalize(12)}}>{moment(item.publishedat).format('YYYY/MM/DD')}</Text>
		</TouchableOpacity>
	</View>);

  	renderHeader = () => {return (<SearchBar placeholder="Type Here..." lightTheme round onChangeText={text => this.searchFilterFunction(text)} autoCorrect={false} value={this.state.value}/>);};

  	render() {
  		let { t, locale } = this.props.screenProps;
	    const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT,} = Dimensions.get('window');
		const scale = SCREEN_WIDTH / 320;
		function normalize(size) {
		  	const newSize = size * scale 
		  	if (Platform.OS === 'ios') {return Math.round(PixelRatio.roundToNearestPixel(newSize))} 
		  	else {return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2}
		}
		if (AgristatsStore.newschange===false) {return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#5bc0de"/></View>);};
	    return (
      		<Animatable.View animation="fadeInLeft" duration={500} delay={500} useNativeDriver>
		        <FlatList
		          	data={AgristatsStore.filterednews.slice()}
		          	renderItem={this.renderItem}
		          	numColumns={2}
		          	keyExtractor={item => item.url}
		          	ListHeaderComponent={this.renderHeader}
		          	removeClippedSubviews={true} // Unmount components when outside of window 
			    	initialNumToRender={4} // Reduce initial render amount
			    	maxToRenderPerBatch={2} // Reduce number in each render batch
			    	updateCellsBatchingPeriod={100} // Increase time between renders
			    	windowSize={4} // Reduce the window size
		        />
		    </Animatable.View>
	    );
  	}
}

NewsScreen.navigationOptions = ({ navigation }) => ({
  	headerStyle: {backgroundColor: '#024B0D'},headerLeft: () => (<Image source={require('../assets/images/icon.png')} style={{ marginLeft:5, width: 50, height: 50 }}/>),
  	headerRight: () => (
  		<View style={{flexDirection: 'row'}}>
  		<TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{marginRight:15}}><TabBarIcon name='settings'/></TouchableOpacity>
  		<TouchableOpacity onPress={() => navigation.navigate('Links')} style={{marginRight:15}}><TabBarIcon name='information-outline'/></TouchableOpacity>
  		</View>
  	),gestureEnabled: true,
  	headerTitleStyle: { fontSize:25, textAlign: 'center', alignSelf: 'center', color:'white',},
    title: t('news'),
});

export default NewsScreen;
