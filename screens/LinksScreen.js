import React, { Component} from 'react';
import {Text,FlatList,Modal,View,StyleSheet,Image,Linking,TouchableOpacity,Dimensions,Platform,PixelRatio} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Card,ListItem} from 'react-native-elements';
import * as StoreReview from 'expo-store-review';
import * as Animatable from "react-native-animatable";

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT,} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;
function normalize(size) {
    const newSize = size * scale 
    if (Platform.OS === 'ios') {return Math.round(PixelRatio.roundToNearestPixel(newSize))} 
    else {return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2}
}

class LinksScreen extends Component {
  constructor(props) {super(props);this.state = {data: [],error: null,otherappsVisible:false};}

  handleReview = () => {if (StoreReview.isAvailableAsync()) {StoreReview.requestReview();}};

  static navigationOptions = ({ screenProps: { t } }) => ({});

  render() {
    let { t, locale } = this.props.screenProps;
    const mysites = [
      {title: ' Website',icon:'globe', url: "http://agristats.eu"},
      {title: ' E-mail',icon:'envelope-o', url: "http://agristats.eu"},
      {title: ' Twitter',icon:'twitter', url: "https://twitter.com/agristatseu"},
      {title: ' Facebook page',icon:'facebook', url: "https://www.facebook.com/agristatseu/"},
      {title: ' Pinterest boards',icon:'pinterest', url: "https://gr.pinterest.com/agristatseu"},
      {title: ' Tumblr blog',icon:'tumblr', url: "https://agristatseu.tumblr.com/"},
      {title: ' GitHub project',icon:'github', url: "https://github.com/iliastsergoulas/agristats_app"},
      {title: t('privacy'),icon:'file-o', url: "http://agristats.eu/data/privacypolicy.pdf"},
      {title: t('attributions'),icon:'universal-access', url: "http://agristats.eu/data/attributions.pdf"},
    ];

    renderItem = ({ item }) => (<Animatable.View animation="fadeInLeft" duration={500} delay={500} useNativeDriver>
      <ListItem
        leftIcon={{ name:item.icon,type:'font-awesome'}}
        title={item.title}
        titleStyle={{fontSize:normalize(16)}}
        onPress={() => Linking.openURL(item.url)}
        chevron={{ color: 'black',size:normalize(22) }}
    /></Animatable.View>);

    return (
      <View>
        <Animatable.View animation="flipInX" duration={100} delay={100} useNativeDriver style={{flexDirection:'row'}}>
          <TouchableOpacity style={{width: '46%',marginLeft: '2%',marginRight: '2%',}} activeOpacity = { .5 } onPress={this.handleReview}>
            <Text style={{fontSize: normalize(16),textAlign: 'center', color:'white', marginTop:20, marginBottom:20, backgroundColor: '#024B0D',borderRadius: 2,borderWidth: 1,padding: 7,}}>{t('rateapp')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{width: '46%',marginLeft: '2%',marginRight: '2%',}} activeOpacity = { .5 } onPress={() => this.setState({ otherappsVisible: true })}>
            <Text style={{fontSize: normalize(16),textAlign: 'center', color:'white', marginTop:20, marginBottom:20, backgroundColor: '#024B0D',borderRadius: 2,borderWidth: 1,padding: 7,}}>{t('otherapps')}</Text>
          </TouchableOpacity>
        </Animatable.View>
        <FlatList
          data={mysites}
          renderItem={this.renderItem}
          keyExtractor={item => item.title}
          ItemSeparatorComponent={this.renderSeparator}
          removeClippedSubviews={true} // Unmount components when outside of window 
          initialNumToRender={7} // Reduce initial render amount
          maxToRenderPerBatch={7} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={7} // Reduce the window size
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.otherappsVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{ marginTop: 22 }}>
            <View>
              <TouchableOpacity style={{flexDirection:'row',width:SCREEN_WIDTH,marginBottom:20}} onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=com.phonegap.wineroutes")}>
                <Image source={require('../assets/images/wineroutes.png')} style={{ marginLeft:5, width: 100, height: 100 }}/>
                <View><Text style={{fontSize: normalize(16),fontWeight: 'bold'}}>Wine Routes</Text><Text style={{fontSize: normalize(14),flexShrink: 1,width:SCREEN_WIDTH-120}}>{t('wineroutes')}</Text></View>
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection:'row',width:SCREEN_WIDTH,marginBottom:20}} onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=com.agristats.greekgeography")}>
                <Image source={require('../assets/images/greekgeography.png')} style={{ marginLeft:5, width: 100, height: 100 }}/>
                <View><Text style={{fontSize: normalize(16),fontWeight: 'bold'}}>Κουίζ Γεωγραφίας</Text><Text style={{fontSize: normalize(14),flexShrink: 1,width:SCREEN_WIDTH-120}}>Ένα πλήρες παιχνίδι γεωγραφίας για μικρούς και μεγάλους</Text></View>
              </TouchableOpacity>
              <TouchableOpacity style={{width: '86%',marginLeft: '7%',marginRight: '7%',}} activeOpacity = { .5 } onPress={() => this.setState({ otherappsVisible: false })}>
                <Text style={{fontSize: normalize(16),textAlign: 'center', color:'white', marginTop:20, marginBottom:20, backgroundColor: '#024B0D',borderRadius: 2,borderWidth: 1,padding: 7,}}>{t('close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {flex: 1,justifyContent: "center",alignItems: "center",marginTop: 22},
  modalText: {marginBottom: 15,textAlign:'justify'}
});

LinksScreen.navigationOptions = () => ({
  headerStyle: {backgroundColor: '#024B0D'},headerTintColor: '#ffffff',gestureEnabled: true,
  headerTitleStyle: { fontSize:normalize(25), textAlign: 'center', alignSelf: 'center', color:'white', },
  title: t('about'),
});

export default LinksScreen;