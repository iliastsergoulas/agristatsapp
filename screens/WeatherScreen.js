import React from 'react';
import {Text, View, ScrollView, FlatList, Image, StyleSheet, ActivityIndicator, Dimensions, Platform, PixelRatio,TouchableOpacity } from 'react-native';
import { Divider, Card} from 'react-native-elements';
import TabBarIcon from '../components/TabBarIcon';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from "react-native-animatable";
import AgristatsStore from './../mobx/AgristatsStore';
import { observer } from 'mobx-react';

@observer
export default class WeatherScreen extends React.Component {

	static navigationOptions = ({ screenProps: { t } }) => ({});

	componentDidMount() {
	    AgristatsStore.changeWeatherSettings(AgristatsStore.weatherunits,AgristatsStore.weatherlanguage);
	}

	reloadWeather(){
		this.forceUpdate();
		AgristatsStore.changeWeatherSettings(AgristatsStore.weatherunits,AgristatsStore.weatherlanguage);
	}

	replaceDecimal(number){
		let { t, locale } = this.props.screenProps;
		if (locale==='el-GR') {return (number.toString()).replace(".", ",");}
		else return(number);
	}

  	render() {
  		var moment = require('moment');
  		let { t, locale } = this.props.screenProps;
  		const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT,} = Dimensions.get('window');
		const scale = SCREEN_WIDTH / 320;

		function normalize(size) {
		  	const newSize = size * scale;
		  	if (Platform.OS === 'ios') {return Math.round(PixelRatio.roundToNearestPixel(newSize))} 
		  	else {return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2}
		};
	  	const styles = StyleSheet.create({
			loadingContainer: {flex: 1,alignItems: 'center',justifyContent: 'center',backgroundColor: '#FFFDE4'},
			weatherContainer: {flex: 0,backgroundColor: '#FFFDE4'},
			headerContainer: {textAlign: 'left',justifyContent: 'space-around'},
			subtitleView: {paddingLeft: 10,paddingTop: 5},
			loadingText: {fontSize: normalize(14)},
			tempText: {fontSize: normalize(15),},
			title: {fontSize: normalize(15),textAlign: 'left',},
			subtitle: {fontSize: normalize(13),},
			time:{fontSize:normalize(14), textAlign: 'center', alignSelf: 'center',},
		    notes: {fontSize: normalize(16),textTransform:'capitalize',textAlign: 'right',},
		    notes1: {fontSize: normalize(12),textTransform:'capitalize',textAlign: 'center',},
		    current_notes: {fontSize: normalize(14),textTransform:'capitalize',textAlign: 'right',},
		});
	    if (AgristatsStore.gpsreject===true) {
	      	return (
	      	<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
	      		<Text style={{ fontSize: normalize(50),textAlign: 'center'}}>{t('nogps')}</Text>
	      		<TouchableOpacity onPress={() => this.reloadWeather()}><Text style={{ marginTop:40, fontSize: normalize(30),textAlign: 'center'}}>{t('tryagain')}</Text></TouchableOpacity>
	      	</View>);
	    };
	    if (AgristatsStore.weatherloading) {return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#5bc0de"/></View>);};
	    return (
	      	<ScrollView>
            	<View>
            		<View style={styles.headerContainer}><Text style={{fontSize: normalize(25),textAlign: 'center'}}>{AgristatsStore.location}, {AgristatsStore.country}</Text></View>
		          	<Text style={{fontSize:normalize(60),textAlign: 'center', alignSelf: 'center', color:'#024B0D'}}>{this.replaceDecimal(Math.round( AgristatsStore.temperature * 10) / 10) }&#8451;</Text>
		          	<View style={{flexDirection:'row', justifyContent:'center',alignItems: 'center'}}>
		          		<View style={{flexDirection:'row', justifyContent:'space-between'}}>
							<View style={{flexDirection:'column', justifyContent:'space-between',}}>
							    <Text style={styles.current_notes}>{t('feels_like')}</Text>
							    <Text style={styles.current_notes}>{t('humidity')}</Text>
							    <Text style={styles.current_notes}>{t('windspeed')}</Text>
							    <Text style={styles.current_notes}>{t('sunrise')}</Text>
							    <Text style={styles.current_notes}>{t('sunset')}</Text>
							</View>
							<View style={{flexDirection:'column', justifyContent:'space-between', marginLeft:20}}>
							    <Text style={styles.current_notes}>{this.replaceDecimal(Math.round( AgristatsStore.feels_like * 10) / 10) }&#8451;</Text>
							    <Text style={styles.current_notes}>{this.replaceDecimal(AgristatsStore.humidity)}%</Text>
							    <Text style={styles.current_notes}>{this.replaceDecimal(AgristatsStore.windspeed)}</Text>
							    <Text style={styles.current_notes}>{moment.unix(AgristatsStore.sunrise).format('h:mm a')}</Text>
							    <Text style={styles.current_notes}>{moment.unix(AgristatsStore.sunset).format('h:mm a')}</Text>
							</View>
						</View>
						<Image style={{width:80, height:40, marginLeft:30}} source={{uri:"https://openweathermap.org/img/w/" + AgristatsStore.weathericon + ".png"}} />
					</View>
				</View>
			    <View style={{height: 2,width: '100%',backgroundColor: '#CED0CE',marginTop:30,}}/>
			    <View style={{marginTop:30}}>
			    	<View style={{flexDirection:'row', justifyContent:'space-between'}}>
				    	<View style={styles.card}>
			          		<Text style={styles.time}></Text>
			          		<Text style={styles.time}></Text>
							<Image style={{width:30, height:30, alignSelf: 'center',marginTop:15}} />
							<Divider style={{ backgroundColor: '#dfe6e9', marginTop:5, marginBottom:15}} />
						    <MaterialCommunityIcons name='oil-temperature' color='#024B0D' size={34} style={styles.notes}/>
						    <MaterialCommunityIcons name='snowman' color='#024B0D' size={34} style={styles.notes}/>
						    <MaterialCommunityIcons name='water' color='#024B0D' size={34} style={styles.notes}/>
						    <MaterialCommunityIcons name='weather-windy' color='#024B0D' size={34} style={styles.notes}/>
						</View>
		        		<FlatList 
				          	data={AgristatsStore.weatherforecast}
				          	renderItem={({ item }) => (
				          		<Animatable.View animation="fadeInUpBig" duration={500} delay={500} useNativeDriver style={styles.card}>
					          		<Text style={styles.time}>{moment(item.dt_txt).format('ddd')} </Text>
					          		<Text style={styles.time}>{moment(item.dt_txt).format('h a')}</Text>
									<Image style={{width:60, height:30, alignSelf: 'center',marginTop:15}} source={{uri:"https://openweathermap.org/img/w/" + item.weather[0].icon + ".png"}} />
									<Divider style={{ backgroundColor: '#dfe6e9', marginTop:5, marginBottom:15}} />
								    <Text style={styles.notes1}>{this.replaceDecimal(Math.round( item.main.temp * 10) / 10) }&#8451;</Text>
								    <Text style={styles.notes1}>{this.replaceDecimal(Math.round( item.main.feels_like * 10) / 10) }&#8451;</Text>
								    <Text style={styles.notes1}>{this.replaceDecimal(item.main.humidity)}%</Text>
								    <Text style={styles.notes1}>{this.replaceDecimal(item.wind.speed)}</Text>
								</Animatable.View>
				          	)}
				          	keyExtractor={item => item.dt_txt}
				          	ItemSeparatorComponent={this.renderSeparator}
				          	ListHeaderComponent={this.renderHeader}
				          	removeClippedSubviews={true} // Unmount components when outside of window 
					    	initialNumToRender={10} // Reduce initial render amount
					    	maxToRenderPerBatch={7} // Reduce number in each render batch
					    	updateCellsBatchingPeriod={100} // Increase time between renders
					    	windowSize={7} // Reduce the window size
					    	extraData={AgristatsStore.weatherforecast}
					    	horizontal={true}
				        />	
				    </View>
			    </View>
	      	</ScrollView>
	    );
	}
}

WeatherScreen.navigationOptions = ({ navigation }) => ({
	headerStyle: {backgroundColor: '#024B0D'},headerLeft: () => (<Image source={require('../assets/images/icon.png')} style={{ marginLeft:5, width: 50, height: 50 }}/>),
	headerRight: () => (
  		<View style={{flexDirection: 'row'}}>
  		<TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{marginRight:15}}><TabBarIcon name='settings'/></TouchableOpacity>
  		<TouchableOpacity onPress={() => navigation.navigate('Links')} style={{marginRight:15}}><TabBarIcon name='information-outline'/></TouchableOpacity>
  		</View>
  	),gestureEnabled: true,
  	headerTitleStyle: { fontSize:25, textAlign: 'center', alignSelf: 'center',color:'white', },
    title: t('weather'),
});