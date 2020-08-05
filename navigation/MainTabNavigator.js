import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import TabBarIcon from '../components/TabBarIcon';
import GrantsScreen from '../screens/GrantsScreen';
import GrantsDetailsScreen from '../screens/GrantsDetailsScreen';
import MachineryScreen from '../screens/MachineryScreen';
import MachineryScreenInit from '../screens/MachineryScreenInit';
import MachineryDetailsScreen from '../screens/MachineryDetailsScreen';
import ProductsScreen from '../screens/ProductsScreen';
import PricesScreen from '../screens/PricesScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DetailsScreen from '../screens/DetailsScreen';
import WeatherScreen from '../screens/WeatherScreen';
import AlertsScreen from '../screens/AlertsScreen';
import NewsScreen from '../screens/NewsScreen';
import MedsScreen from '../screens/MedsScreen';
import LandScreen from '../screens/LandScreen';
import FarmScreen from '../screens/FarmScreen';
import WebviewScreen from '../screens/WebviewScreen';
import * as Localization from 'expo-localization';

const config = Platform.select({web: { headerMode: 'screen' },default: {},});

var locale=Localization.locale;

const ProductsStack = createStackNavigator({Products:ProductsScreen, Prices: PricesScreen, Details:DetailsScreen, Links: LinksScreen,Settings: SettingsScreen,Webview:WebviewScreen},config,{initialRouteName: 'Products',});
ProductsStack.navigationOptions = {
  tabBarLabel: <View/>,
  tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name='trending-up'/>),
};
ProductsStack.path = '';

const NewsStack = createStackNavigator({News: NewsScreen,Links: LinksScreen,Settings: SettingsScreen,Webview:WebviewScreen},config,{initialRouteName: 'News'});
NewsStack.navigationOptions = {
  tabBarLabel: <View/>,
  tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name='newspaper'/>),
};
NewsStack.path = '';

const WeatherStack = createStackNavigator({Weather: WeatherScreen, Links: LinksScreen,Settings: SettingsScreen,Webview:WebviewScreen},config,{initialRouteName: 'Weather',});
WeatherStack.navigationOptions = {
  tabBarLabel: <View/>,
  tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name='white-balance-sunny'/>),
};
WeatherStack.path = '';

if (locale==='el-GR'){
	const GrantsStack = createStackNavigator({Grants:GrantsScreen,GrantsDetails:GrantsDetailsScreen, Links: LinksScreen,Settings: SettingsScreen,Webview:WebviewScreen},config,{initialRouteName: 'Grants',});
	GrantsStack.navigationOptions = {
	  tabBarLabel: <View/>,
	  tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name='tree'/>),
	};
	GrantsStack.path = '';
	const FarmStack = createStackNavigator({Farm:FarmScreen,Machinery:MachineryScreen,MachineryDetails:MachineryDetailsScreen,Meds:MedsScreen,Land:LandScreen,Links:LinksScreen,Settings:SettingsScreen,Webview:WebviewScreen},config,{initialRouteName: 'Farm',},);
	FarmStack.navigationOptions = {
	  tabBarLabel: <View/>,
	  tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name='tractor'/>),
	};
	FarmStack.path = '';
	var tabs={NewsStack,ProductsStack,FarmStack,GrantsStack,WeatherStack}
}
else {
	const FarmStack = createStackNavigator({Machinery:MachineryScreenInit,MachineryDetails:MachineryDetailsScreen,Links:LinksScreen,Settings:SettingsScreen,Webview:WebviewScreen},config,{initialRouteName: 'Machinery',},);
	FarmStack.navigationOptions = {
	  tabBarLabel: <View/>,
	  tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name='tractor'/>),
	};
	FarmStack.path = '';
	var tabs={NewsStack,ProductsStack,FarmStack,WeatherStack}
}
const tabNavigator = createBottomTabNavigator(tabs,{tabBarOptions: {style: {height: 55,backgroundColor: '#024B0D'}}});
tabNavigator.path = '';

export default tabNavigator;