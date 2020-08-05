import React from 'react';
import {Notifications} from 'expo';
import {Image,ScrollView,Text,View,Switch,StyleSheet,Picker,Alert,TouchableOpacity,Dimensions,Platform,PixelRatio} from 'react-native';
import Colors from '../constants/Colors';
import {Avatar} from 'react-native-elements';
import TabBarIcon from '../components/TabBarIcon';
import * as Animatable from "react-native-animatable";
import AgristatsStore from './../mobx/AgristatsStore';
import {observer} from 'mobx-react';
import MultiSelect from 'react-native-multiple-select';
import * as AuthSession from 'expo-auth-session';
import jwtDecode from 'jwt-decode';

const auth0ClientId = 'LJEpO3wpy6MYx7AHD72KwoO89M5agpzA';
const auth0Domain = 'https://agristats.eu.auth0.com';

@observer
export default class SettingsScreen extends React.Component {
  	// Define default states for switch components
  	state = {
  		enableNotifs:AgristatsStore.enableNotifs,
  		selectedMeasures:AgristatsStore.selectedMeasures.split(','),selectedCompanies:AgristatsStore.selectedCompanies.split(','),
    	weatherunits: AgristatsStore.weatherunits,
    	weatherlanguage: AgristatsStore.weatherlanguage,
    	newslanguage: AgristatsStore.newslanguage
  	}

  	measures = [
  		{measurename: 'Μεταποίηση γεωργικών προϊόντων',measure:'processing',},
      	{measurename: 'Σχέδια Βελτίωσης',measure:'svel',},
      	{measurename: 'Βιολογική καλλιέργεια/κτηνοτροφία',measure:'organic',},
      	{measurename: 'Γεωργοπεριβαλλοντικά',measure:'environ',},
      	{measurename: 'Εξισωτική αποζημίωση',measure:'equal',},
      	{measurename: 'Ομάδες/Οργανώσεις Παρ/γών & Συνεργασίες',measure:'groups',},
      	{measurename: 'Νέοι Γεωργοί & Μικρές εκμεταλλεύσεις',measure:'farmer',},
      	{measurename: 'Επενδύσεις πρόληψης ζημιών',measure:'risk',},
      	{measurename: 'CLLD/Leader',measure:'local',},
      	{measurename: 'Πρόωρη συνταξιοδότηση',measure:'retirement',},
      	{measurename: 'Άμεσες ενισχύσεις',measure:'directaid',},
      	{measurename: 'Συνδεδεμένες ενισχύσεις',measure:'linked',},
      	{measurename: 'de minimis',measure:'deminimis',},
      	{measurename: 'Παροχή συμβουλών',measure:'advisor',},
      	{measurename: 'Προώθηση οίνων',measure:'wine',},
      	{measurename: 'Δημόσια Έργα',measure:'dimosia',},
      	{measurename: 'Δασικά',measure:'forest',},
	];

	machinery = [
  		{companyname: 'Claas',company:'claas',},
      	{companyname: 'Deutz Fahr',company:'deutzfahr',},
      	{companyname: 'Fendt',company:'fendt',},
      	{companyname: 'John Deere',company:'deere',},
      	{companyname: 'Mahindra',company:'mahindra',},
      	{companyname: 'Massey Ferguson',company:'masseyferguson',},
      	{companyname: 'New Holland',company:'newholland',},
	];

	onSelectedMeasuresChange = selectedMeasures => {
	    //AgristatsStore.changeGrantsPrefs(selectedMeasures);
	    AgristatsStore.createUser();
	};

	onSelectedCompaniesChange = selectedCompanies => {
	    //AgristatsStore.changeCompaniesPrefs(selectedCompanies);
	    AgristatsStore.createUser();
	};

	socialLogin = async () => {
	    const redirectUrl = AuthSession.getRedirectUrl();
	    const queryParams = toQueryString({
	      client_id: auth0ClientId,
	      redirect_uri: redirectUrl,
	      response_type: 'id_token',
	      scope: 'openid profile email',
	      nonce: 'nonce',
	    });
	    const authUrl = `${auth0Domain}/authorize` + queryParams;
	    const response = await AuthSession.startAsync({ authUrl });
	    if (response.type === 'success') {
	      this.handleResponse(response.params);
	    }
	  };

	socialLogout = async () => {
	    const redirectUrl = AuthSession.getRedirectUrl();
	    const queryParams = toQueryString({
	      	client_id: auth0ClientId,
	      	returnTo: AuthSession.getRedirectUrl()
	    });
	    const authUrl = `${auth0Domain}/v2/logout` + queryParams;
	    const response = await AuthSession.startAsync({ authUrl });
	    if (response.type === 'success') {
	      	AgristatsStore.logout();
	    }
	};

	askLogin = () => {
	    Alert.alert(t('disclaimertitle'),t('disclaimertext'),
	      	[{text: 'ΑΚΥΡΟ',style: 'cancel',},{text: 'OK', onPress: () => this.socialLogin()},],
	      	{ cancelable: false }
	    );
	}

	handleResponse = (response) => {
	    if (response.error) {
	      alert('Authentication error', response.error_description || 'something went wrong');
	      return;
	    }
	    const jwtToken = response.id_token;
	    const decoded = jwtDecode(jwtToken);
	    const { name,picture,email,sub } = decoded;
	    AgristatsStore.getSocialDetails(sub,name,email,picture);
	    AgristatsStore.createUser();
	};

  	static navigationOptions = ({ screenProps: { t } }) => ({});

  	onChangeText = (text) => {this.setState({text: text});}

  	render() {
  		let { t, locale } = this.props.screenProps;
  		const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT,} = Dimensions.get('window');
		const scale = SCREEN_WIDTH / 320;
		function normalize(size) {
		  	const newSize = size * scale;
		  	if (Platform.OS === 'ios') {return Math.round(PixelRatio.roundToNearestPixel(newSize))} 
		  	else {return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2}
		};
		const { selectedMeasures,selectedCompanies } = this.state;
	    return (
	      	<ScrollView style={styles.container}>
	      		<Animatable.View animation="fadeInLeft" duration={500} delay={500} useNativeDriver>
		      		<View><Text style={{fontSize: normalize(24),flex: 1, paddingHorizontal: 15,marginBottom:10,marginHorizontal:10}}>{t('notifications')}</Text></View>
		        	{AgristatsStore.logged===false && <View style={{flexDirection:'row',justifyContent:'center'}}>
		              	<TouchableOpacity onPress={this.askLogin} style={{backgroundColor: '#4267B2',borderRadius: 5,justifyContent: 'center', padding: 10,margin: 10,width:SCREEN_WIDTH-10,height: SCREEN_HEIGHT/15}}>
		                	<Text style={{fontSize: normalize(16),color: '#fff',textAlign:'center'}}>{t('loginwith')}</Text>
		              	</TouchableOpacity>
		            </View>}
		            {AgristatsStore.logged===true && AgristatsStore.socialname!==null && <View>
		            	<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
			              	<View style={{alignItems:'center',}}><Avatar rounded size="medium" source={{uri:AgristatsStore.socialphotoUrl,}}/>
			              	<Text style={styles.text}>{AgristatsStore.socialname}</Text></View>
			              	<TouchableOpacity onPress={() => this.socialLogout()} style={{backgroundColor: '#4267B2',borderRadius: 5,padding: 10,margin: 20,width:SCREEN_WIDTH/3,height: SCREEN_HEIGHT/15}}>
			                	<Text style={{fontSize: normalize(16),color: '#fff',textAlign:'center'}}>Αποσύνδεση</Text>
			              	</TouchableOpacity>
			            </View>
			            <View style={styles.switchrowContainer}>
				        	<Text style={styles.switchLabel}>{t('receivenotifications')}</Text>
			          		<View style={styles.switchContainer}>
				          		<Switch trackColor={{true: Colors.tintColor}} onValueChange={() => AgristatsStore.enablenotifications()} value={AgristatsStore.enableNotifs} />
			          		</View>
			        	</View>
			        	{locale==='el-GR' && 
			            <MultiSelect
			            	hideTags
				          	items={this.measures} fontSize={normalize(16)} 
				          	uniqueKey="measure"
				          	ref={(component) => { this.multiSelect = component }}
				          	onSelectedItemsChange={this.onSelectedMeasuresChange}
				          	selectedItems={selectedMeasures}
				          	selectText={t('grants')}
				          	searchInputPlaceholderText="Αναζήτηση..."
				          	onChangeInput={ (text)=> console.log(text)}
				          	tagRemoveIconColor="#024B0D"
				          	tagBorderColor="#024B0D"
				          	tagTextColor="#024B0D"
				          	selectedItemTextColor="#024B0D"
				          	selectedItemIconColor="#024B0D"
				          	styleMainWrapper={{paddingHorizontal: 25}}
				          	styleTextDropdown={{color:'black'}}
				          	itemTextColor="#000"
				          	displayKey="measurename"
				          	searchInputStyle={{ color: 'black' }}
				          	submitButtonColor="#024B0D"
				          	submitButtonText={t('select')}
				        />}
				        <MultiSelect
				        	hideTags
				          	items={this.machinery} fontSize={normalize(16)}
				          	uniqueKey="company"
				          	ref={(component) => { this.multiSelect = component }}
				          	onSelectedItemsChange={this.onSelectedCompaniesChange}
				          	selectedItems={selectedCompanies}
				          	selectText={t('machinery')}
				          	searchInputPlaceholderText="Αναζήτηση..."
				          	onChangeInput={ ()=> console.log(this.state.selectedCompanies)}
				          	tagRemoveIconColor="#024B0D"
				          	tagBorderColor="#024B0D"
				          	tagTextColor="#024B0D"
				          	selectedItemTextColor="#024B0D"
				          	selectedItemIconColor="#024B0D"
				          	styleMainWrapper={{paddingHorizontal: 25}}
				          	styleTextDropdown={{color:'black'}}
				          	itemTextColor="#000"
				          	displayKey="companyname"
				          	searchInputStyle={{ color: '#024B0D' }}
				          	submitButtonColor="#024B0D"
				          	submitButtonText={t('select')}
				        />
				    </View>}
		      		<View style={{height: 2,width: '86%',backgroundColor: '#CED0CE',marginLeft: '7%',marginRight: '7%',}}/>
		      	</Animatable.View>
		      	<Animatable.View animation="fadeInLeft" duration={500} delay={500} useNativeDriver>
		      		<View><Text style={{fontSize: normalize(24),flex: 1, paddingHorizontal: 15,marginBottom:10}}>{t('newssettings')}</Text></View>
	      			<View style={styles.switchrowContainer}>
		        		<Text style={styles.switchLabel}>{t('language')}</Text>
		          		<View style={styles.switchContainer}>
			          		<Picker
							  	selectedValue={AgristatsStore.newslanguage}
							  	style={{height: 50, width: 150,fontSize:18}}
							  	mode='dialog'
							  	onValueChange={(itemValue, itemIndex) =>AgristatsStore.changeNewsLanguage(itemValue)}>
							  	<Picker.Item label="Ελληνικά" value="gr" />
							  	<Picker.Item label="Arabic" value="ar" />
							  	<Picker.Item label="Deutsch" value="de" />
							  	<Picker.Item label="English" value="en" />
							  	<Picker.Item label="Español" value="es" />
							  	<Picker.Item label="Français" value="fr" />
							  	<Picker.Item label="Italiano" value="it" />
							  	<Picker.Item label="Nederlands" value="nl" />
							  	<Picker.Item label="Português" value="pt" />
							  	<Picker.Item label="русский" value="ru" />
							  	<Picker.Item label="中文" value="zh" />
							</Picker>
		          		</View>
	        		</View>
		        	<View style={{height: 2,width: '86%',backgroundColor: '#CED0CE',marginLeft: '7%',marginRight: '7%',}}/>
	        	</Animatable.View>
		      	<Animatable.View animation="fadeInLeft" duration={500} delay={500} useNativeDriver>
		        	<View><Text style={{fontSize: normalize(24),flex: 1, paddingHorizontal: 15,marginBottom:10,}}>{t('weathersettings')}</Text></View>
	      			<View style={{display: 'flex',alignItems: 'center',flexDirection: 'row',justifyContent: 'space-between',paddingHorizontal: 25,flex:1,}}>
		        		<Text style={styles.switchLabel}>{t('units')}</Text>
		          		<View style={styles.switchContainer}>
			          		<Picker selectedValue={AgristatsStore.weatherunits} style={{height: 50, width: 150,fontSize:18}} mode='dialog'
							  	onValueChange={(itemValue, itemIndex) =>AgristatsStore.changeWeatherSettings(itemValue,AgristatsStore.weatherlanguage)}>
							  	<Picker.Item label={t('metric')} value="metric" />
							  	<Picker.Item label={t('imperial')} value="imperial" />
							</Picker>
		          		</View>
	        		</View>
	        		<View style={styles.switchrowContainer}>
		        		<Text style={styles.switchLabel}>{t('language')}</Text>
		          		<View style={styles.switchContainer}>
			          		<Picker selectedValue={AgristatsStore.weatherlanguage} style={{height: 50, width: 150,fontSize:normalize(18)}} mode='dialog'
							  	onValueChange={(itemValue, itemIndex) =>AgristatsStore.changeWeatherSettings(AgristatsStore.weatherunits, itemValue)}>
							  	<Picker.Item label="Afrikaans" value="af" />
								<Picker.Item label="Arabic" value="ar" />
								<Picker.Item label="Azerbaijani" value="az" />
								<Picker.Item label="Bulgarian" value="bg" />
								<Picker.Item label="Catalan " value="ca" />
								<Picker.Item label="Czech" value="cz" />
								<Picker.Item label="Danish" value="da" />
								<Picker.Item label="German" value="de" />
								<Picker.Item label="Greek" value="el" />
								<Picker.Item label="English" value="en" />
								<Picker.Item label="Basque" value="eu" />
								<Picker.Item label="Persian (Farsi)" value="fa" />
								<Picker.Item label="Finnish" value="fi" />
								<Picker.Item label="French" value="fr" />
								<Picker.Item label="Galician" value="gl" />
								<Picker.Item label="Hebrew" value="he" />
								<Picker.Item label="Hindi" value="hi" />
								<Picker.Item label="Croatian" value="hr" />
								<Picker.Item label="Hungarian" value="hu" />
								<Picker.Item label="Indonesian" value="id" />
								<Picker.Item label="Italian" value="it" />
								<Picker.Item label="Japanese" value="ja" />
								<Picker.Item label="Korean" value="kr" />
								<Picker.Item label="Latvian" value="la" />
								<Picker.Item label="Lithuanian" value="lt" />
								<Picker.Item label="North Macedonian" value="mk" />
								<Picker.Item label="Norwegian" value="no" />
								<Picker.Item label="Dutch" value="nl" />
								<Picker.Item label="Polish" value="pl" />
								<Picker.Item label="Portuguese" value="pt" />
								<Picker.Item label="Português Brasil" value="pt_br" />
								<Picker.Item label="Romanian" value="ro" />
								<Picker.Item label="Russian" value="ru" />
								<Picker.Item label="Swedish" value="se" />
								<Picker.Item label="Slovak" value="sk" />
								<Picker.Item label="Slovenian" value="sl" />
								<Picker.Item label="Spanish" value="es" />
								<Picker.Item label="Serbian" value="sr" />
								<Picker.Item label="Thai" value="th" />
								<Picker.Item label="Turkish" value="tr" />
								<Picker.Item label="Ukrainian" value="ua, uk" />
								<Picker.Item label="Vietnamese" value="vi" />
								<Picker.Item label="Chinese Simplified" value="zh_cn" />
								<Picker.Item label="Chinese Traditional" value="zh_tw" />
								<Picker.Item label="Zulu" value="zu" />
							</Picker>
		          		</View>
        			</View>
        		</Animatable.View>
	        	<View style={{height: 2,width: '86%',backgroundColor: '#CED0CE',marginLeft: '7%',marginRight: '7%',}}/>
	      	</ScrollView>
    	)
  	}
}

function toQueryString(params) {
  	return '?' + Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

SettingsScreen.navigationOptions = ({ navigation }) => ({
  	headerStyle: {backgroundColor: '#024B0D'},headerTintColor: '#ffffff',gestureEnabled: true,
  	headerTitleStyle: { fontSize:25, textAlign: 'center', alignSelf: 'center', color:'white',},
    title: t('settings'),
});

const styles = StyleSheet.create({
  	switchrowContainer: {display: 'flex',alignItems: 'center',flexDirection: 'row',justifyContent: 'space-between',marginBottom: 15,paddingHorizontal: 25,flex:1},
	switchContainer: {display: 'flex',alignItems: 'center',flexDirection: 'row',justifyContent: 'space-around',flex:1},
	switchLabel: {flex: 1,fontSize:18}
});