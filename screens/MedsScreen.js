import React, { Component } from 'react';
import { Image,View, Text, FlatList, ActivityIndicator, Dimensions, Linking, Platform, PixelRatio, TouchableOpacity} from 'react-native';
import { Card, ListItem, SearchBar } from 'react-native-elements';
import TabBarIcon from '../components/TabBarIcon';
import * as Animatable from "react-native-animatable";
import AgristatsStore from './../mobx/AgristatsStore';
import { observer } from 'mobx-react';
import Protection from '../assets/plantprotection.json';

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT,} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;
function normalize(size) {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {return Math.round(PixelRatio.roundToNearestPixel(newSize))} 
    else {return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2}
};

@observer
class MedsScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {loading: false,data: Protection,error: null};
    }

    renderSeparator = () => {return (<View style={{height: 1,width: '100%',backgroundColor: '#CED0CE',}}/>);};

    searchFilterFunction = text => {
      this.setState({value: text,});
      const newData = Protection.filter(item => {
          const itemData = `${item.KATHG.toUpperCase()} ${item.EIDOS.toUpperCase()} ${item.EMPORIKHON.toUpperCase()} ${item.ONOMADRON.toUpperCase()} ${item.NAMECOMPAN.toUpperCase()} ${item.KATHGORIES.toUpperCase()}`;
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      this.setState({data: newData,});
    };

    renderItem = ({ item }) => (<Animatable.View animation="fadeInLeft" duration={500} delay={500} useNativeDriver>
      <ListItem onPress={() => Linking.openURL(item.FILE)} titleStyle={{fontSize:normalize(16)}} chevron={{ color: 'black',size:26 }} title={item.EMPORIKHON} subtitle={item.EIDOS}/>
    </Animatable.View>);

    renderHeader = () => {return (<SearchBar placeholder="Type Here..." lightTheme round onChangeText={text => this.searchFilterFunction(text)} autoCorrect={false} value={this.state.value}/>);};

    render() {
      if (this.state.loading) {return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>);};
      return (
          <View style={{ flex: 1 }}>
          	<Card
                featuredTitle='Να συμβουλεύεστε πάντα γεωπόνο.' containerStyle={{borderWidth: 0,elevation: 0}}
                featuredSubtitle='Χρήση δημοσιευμένων δεδομένων του Υπουργείου Αγροτικής Ανάπτυξης και Τροφίμων, βάσει άρθρου 1 παρ.1 του Ν. 4305/2014.'
                featuredSubtitleStyle={{textAlign:'justify',fontSize:normalize(12)}} featuredTitleStyle={{textAlign:'center'}}
                onPress={() => this.props.navigation.navigate('Webview', { url:"https://dip.opekepe.gr/"})}
                image={require('../assets/images/plants.jpg')}>
            </Card>
           	<FlatList
            data={this.state.data}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            removeClippedSubviews={true} // Unmount components when outside of window 
            initialNumToRender={10} // Reduce initial render amount
            maxToRenderPerBatch={2} // Reduce number in each render batch
            updateCellsBatchingPeriod={100} // Increase time between renders
            windowSize={10} // Reduce the window size
            extraData={this.state.isRefreshing}
            />
          </View>
      );
    }
}

MedsScreen.navigationOptions = ({ navigation }) => ({
  	headerStyle: {backgroundColor: '#024B0D'},headerTintColor: '#ffffff',headerTintColor: '#ffffff',gestureEnabled: true,
  	headerRight: () => (
  		<View style={{flexDirection: 'row'}}>
  		<TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{marginRight:15}}><TabBarIcon name='settings'/></TouchableOpacity>
  		<TouchableOpacity onPress={() => navigation.navigate('Links')} style={{marginRight:15}}><TabBarIcon name='information-outline'/></TouchableOpacity>
  		</View>
  	),headerTitleStyle: { fontSize:normalize(25), textAlign: 'left', alignSelf: 'center', color:'white', },title: t('meds'),
});

export default MedsScreen;