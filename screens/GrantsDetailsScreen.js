import React, { Component } from 'react';
import { Image,View, Text, FlatList, ActivityIndicator, Dimensions, Platform, PixelRatio, Linking, TouchableOpacity} from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import TabBarIcon from '../components/TabBarIcon';
import AgristatsStore from './../mobx/AgristatsStore';
import { observer } from 'mobx-react';

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT,} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;
function normalize(size) {
  	const newSize = size * scale;
  	if (Platform.OS === 'ios') {return Math.round(PixelRatio.roundToNearestPixel(newSize))} 
  	else {return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2}
};

@observer
class GrantsDetailsScreen extends Component {
  	constructor(props) {
	    super(props);
	    this.state = {loading: false,data: [],isRefreshing: false,error: null,};
  	}

  	componentDidMount() {AgristatsStore.getGrants(this.props.navigation.getParam('measure', 'processing'));};

  	renderSeparator = () => {return (<View style={{height: 1,width: '100%',backgroundColor: '#CED0CE',}}/>);};

  	renderItem = ({ item }) => (<ListItem
      	title={item.subject}
      	titleStyle={{fontSize:normalize(14)}}
      	subtitle={item.date}
      	subtitleStyle={{fontSize:normalize(12)}}
      	onPress={() => Linking.openURL(item.url)}
      	chevron={{ color: 'black' }}
    />);

  	searchFilterFunction = text => {
	    this.setState({value: text,});
	    AgristatsStore.changeGrants(text);
  	};

  	renderHeader = () => {return (<SearchBar placeholder="Type Here..." lightTheme round onChangeText={text => this.searchFilterFunction(text)} autoCorrect={false} value={this.state.value}/>);};

  	render() {
	    if (this.state.loading) {return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#5bc0de"/></View>);};
	    return (
	      	<View style={{ flex: 1 }}>
		        <FlatList
		          	data={AgristatsStore.filteredgrants}
		          	renderItem={this.renderItem}
		          	keyExtractor={item => item.title}
		          	ItemSeparatorComponent={this.renderSeparator}
		          	ListHeaderComponent={this.renderHeader}
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

GrantsDetailsScreen.navigationOptions = ({ navigation }) => ({
  	headerStyle: {backgroundColor: '#024B0D'},headerTintColor: '#ffffff',gestureEnabled: true,
  	headerRight: () => (
  		<View style={{flexDirection: 'row'}}>
  		<TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{marginRight:15}}><TabBarIcon name='settings'/></TouchableOpacity>
  		<TouchableOpacity onPress={() => navigation.navigate('Links')} style={{marginRight:15}}><TabBarIcon name='information-outline'/></TouchableOpacity>
  		</View>
  	),
  	headerTitleStyle: { fontSize:normalize(25), textAlign: 'left', alignSelf: 'center', color:'white', },title: t('grants'),
});

export default GrantsDetailsScreen;