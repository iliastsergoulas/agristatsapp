import React, { Component } from 'react';
import { Image,View, Text, FlatList, ActivityIndicator, Dimensions, Linking, Platform, PixelRatio, TouchableOpacity} from 'react-native';
import { Card, ListItem, SearchBar } from 'react-native-elements';
import TabBarIcon from '../components/TabBarIcon';
import * as Animatable from "react-native-animatable";
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
class LandScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {loading: false,data: [],isRefreshing: false,error: null,};
    }

    componentDidMount() {AgristatsStore.getLand();};

    renderSeparator = () => {return (<View style={{height: 1,width: '100%',backgroundColor: '#CED0CE',}}/>);};

    renderItem = ({ item }) => (<Animatable.View animation="fadeInLeft" duration={500} delay={500} useNativeDriver>
      <ListItem
        title={item.title}
        titleStyle={{fontSize:normalize(16)}}
        rightTitle={item.date}
        rightTitleStyle={{fontSize:normalize(18)}}
        subtitle={item.unit}
        subtitleStyle={{fontSize:normalize(11)}}
        containerStyle = {{ backgroundColor: index % 2 == 0 ? "#f2f2f2" : "#FFFFFF" }}
        onPress={() => Linking.openURL(item.file)}
        chevron={{ color: 'black' }}
    /></Animatable.View>);

    searchFilterFunction = text => {
      this.setState({value: text,});
      AgristatsStore.changeLand(text);
    };

    renderHeader = () => {return (<SearchBar placeholder="Type Here..." lightTheme round onChangeText={text => this.searchFilterFunction(text)} autoCorrect={false} value={this.state.value}/>);};

    render() {
      const { navigation } = this.props;
      if (this.state.loading) {return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#5bc0de"/></View>);};
      return (
          <View style={{ flex: 1 }}>
            <Card
              featuredTitle=' ' containerStyle={{borderWidth: 0,elevation: 0}}
              featuredSubtitle='Χρήση δημοσιευμένων δεδομένων του Υπουργείου Αγροτικής Ανάπτυξης και Τροφίμων, βάσει άρθρου 1 παρ.1 του Ν. 4305/2014.'
              featuredSubtitleStyle={{textAlign:'justify',fontSize:normalize(12)}}
              image={require('../assets/images/farm.jpg')}>
            </Card>
            <FlatList
              data={AgristatsStore.filteredland}
              renderItem={this.renderItem}
              keyExtractor={item => item.index.toString()}
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

LandScreen.navigationOptions = ({ navigation }) => ({
    headerStyle: {backgroundColor: '#024B0D'},headerTintColor: '#ffffff',headerTintColor: '#ffffff',gestureEnabled: true,
    headerRight: () => (
      <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{marginRight:15}}><TabBarIcon name='settings'/></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Links')} style={{marginRight:15}}><TabBarIcon name='information-outline'/></TouchableOpacity>
      </View>
    ),headerTitleStyle: { fontSize:normalize(25), textAlign: 'left', alignSelf: 'center', color:'white', },title: t('land'),
});

export default LandScreen;