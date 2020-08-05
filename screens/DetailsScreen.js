import React, { Component } from 'react';
import { Image,ScrollView, View,Text,ActivityIndicator,Dimensions,Platform,PixelRatio,TouchableOpacity,StyleSheet} from 'react-native';
import TabBarIcon from '../components/TabBarIcon';
import { VictoryLine, VictoryTooltip, VictoryAxis, VictoryChart, VictoryVoronoiContainer, VictoryTheme } from "victory-native";
import * as Animatable from "react-native-animatable";

class DetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {loading: false,data: [],chartdata:[],error: null,active: 4,days:90,};
  }

  componentDidMount() {this.makeRemoteRequest(90,4);}

  makeRemoteRequest = (days, active) => {
    const { navigation } = this.props;
    this.setState({ active: active });
    const url = "https://app.agristats.eu/getprices?days="+days+"&description="+(JSON.stringify(navigation.getParam('description', 'NO-ID')).slice(1,-1));
    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.length>0){
          for (var i = 0; i < res.length; i++) {
            res[i].date=res[i].date.slice(0,-13);
          };
          this.setState({data:res,error:false});
        } else{
          this.setState({error:true});
        }
        this.setState({ loading: true });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  renderSeparator = () => {
    return (
      <View style={{height: 1,width: '86%',backgroundColor: '#CED0CE',marginLeft: '14%',}}/>
    );
  };

  render() {
    const { navigation } = this.props;
    const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT,} = Dimensions.get('window');
    const scale = SCREEN_WIDTH / 320;

    function normalize(size) {
        const newSize = size * scale;
        if (Platform.OS === 'ios') {return Math.round(PixelRatio.roundToNearestPixel(newSize))} 
        else {return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2}
    };
    if (this.state.loading==false) {
      return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#5bc0de"/></View>);
    };
    if (this.state.error==true) {
      return (
        <ScrollView>
        <Animatable.View animation="fadeInLeft" duration={500} delay={500} useNativeDriver>
          <View style={{ flexDirection: 'row',alignItems: 'center', }}>
            <Image source={JSON.stringify(navigation.getParam('image', require('../assets/images/wheat.png')))} style={{ width: 80, height: 65 }}/>
            <Text style={{ fontSize: normalize(20),textAlign: 'left', paddingLeft:10,width: 0,flexGrow: 1, }} allowFontScaling={true}>{(JSON.stringify(navigation.getParam('description', 'NO-ID')).slice(1,-1))}</Text>
          </View>
          <View style={{flex: 0,flexDirection: "row", justifyContent: 'center',}}>
            <TouchableOpacity 
              onPress={() => this.makeRemoteRequest(7,0)}
              style={this.state.active === 0 ? styles.btnActive : styles.btn }>
              <Text>7d</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => this.makeRemoteRequest(14,1)}
              style={this.state.active === 1 ? styles.btnActive : styles.btn }>
              <Text>14d</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => this.makeRemoteRequest(30,2)}
              style={this.state.active === 2 ? styles.btnActive : styles.btn }>
              <Text>30d</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => this.makeRemoteRequest(60,3)}
              style={this.state.active === 3 ? styles.btnActive : styles.btn }>
              <Text>60d</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => this.makeRemoteRequest(90,4)}
              style={this.state.active === 4 ? styles.btnActive : styles.btn }>
              <Text>90d</Text>
            </TouchableOpacity>
          </View>
          <View><Text style={{ fontSize: normalize(50),textAlign: 'center', marginTop:50}}>No data</Text></View></Animatable.View></ScrollView>
      );
    };
    return (
      <ScrollView>
      <Animatable.View animation="fadeInLeft" duration={500} delay={500} useNativeDriver style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row',alignItems: 'center', }}>
          <Image source={JSON.stringify(navigation.getParam('image', require('../assets/images/wheat.png')))} style={{ width: 80, height: 65 }}/>
          <Text style={{ fontSize: normalize(20),textAlign: 'left', paddingLeft:10,width: 0,flexGrow: 1, }} allowFontScaling={true}>{(JSON.stringify(navigation.getParam('description', 'NO-ID')).slice(1,-1))}</Text>
        </View>
        <View style={{flex: 0,flexDirection: "row", justifyContent: 'center',}}>
          <TouchableOpacity 
            onPress={() => this.makeRemoteRequest(7,0)}
            style={this.state.active === 0 ? styles.btnActive : styles.btn }>
            <Text>7d</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => this.makeRemoteRequest(14,1)}
            style={this.state.active === 1 ? styles.btnActive : styles.btn }>
            <Text>14d</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => this.makeRemoteRequest(30,2)}
            style={this.state.active === 2 ? styles.btnActive : styles.btn }>
            <Text>30d</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => this.makeRemoteRequest(60,3)}
            style={this.state.active === 3 ? styles.btnActive : styles.btn }>
            <Text>60d</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => this.makeRemoteRequest(90,4)}
            style={this.state.active === 4 ? styles.btnActive : styles.btn }>
            <Text>90d</Text>
          </TouchableOpacity>
        </View>
        <VictoryChart width={Dimensions.get("window").width} theme={VictoryTheme.material} containerComponent={
          <VictoryVoronoiContainer voronoiDimension="x" labels={({ datum }) => `${datum.date}: ${datum.price}`} labelComponent={<VictoryTooltip cornerRadius={0} flyoutStyle={{ fill: "white" }}/>}/>}>
          <VictoryAxis tickFormat={() => ''} />
          <VictoryAxis dependentAxis tickFormat={(y) => y} orientation="left"/>
          <VictoryLine animate={{duration: 2000,onLoad: { duration: 1000 }}} style={{data: { stroke: "#c43a31" },parent: { border: "1px solid #ccc"}}} data={this.state.data} x="date" y="price" />
        </VictoryChart>
      </Animatable.View></ScrollView>
    );
  }
}

DetailsScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {backgroundColor: '#024B0D'},headerTintColor: '#ffffff',
  headerRight: () => (
    <View style={{flexDirection: 'row'}}>
    <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{marginRight:15}}><TabBarIcon name='settings'/></TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Links')} style={{marginRight:15}}><TabBarIcon name='information-outline'/></TouchableOpacity>
    </View>
  ),
  headerTitleStyle: { fontSize:25, textAlign: 'left', alignSelf: 'center', color:'white', },
  title: t('prices'),
});

const styles = StyleSheet.create({
  btn: {alignItems: 'center',backgroundColor: '#5bc0de',borderColor: '#000000',borderRadius: 2,borderWidth: 1,padding: 7,},gestureEnabled: true,
  btnActive: {alignItems: 'center',backgroundColor: '#3DAB50',borderColor: '#000000',borderRadius: 2,borderWidth: 1,padding: 7,},
  container: {backgroundColor: '#fff',justifyContent: 'center'}
});

export default DetailsScreen;