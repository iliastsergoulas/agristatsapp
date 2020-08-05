import { AppLoading, Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { AsyncStorage } from 'react-native';
import { enableScreens } from 'react-native-screens';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import AgristatsStore from './mobx/AgristatsStore';
import { observer } from 'mobx-react';

@observer
export default class App extends React.Component {
  state = {isReady: false,isLoadingComplete: false, notification: null,locale: Localization.locale,messageText: ''};

  render() {
    handleUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Updates.reloadFromCache();
        } else {alert("No updates.")}
      } catch (e) {alert(e);}
    };
    const en = {
      language: 'Language',switch1: 'Fruits',switch2: 'Animal Products',switch3: 'Cereal and Plants',switch4: 'Carbon emissions',switch5: 'Oils and beverages',
      version: ' Version',attributions: ' Attributions',products:'Products',notifications:'Notifications',updatesettings:'Update settings',
      rateapp:'Rate our app',temperature:'Temperature',humidity:'Humidity',temp_min:'Minimum temperature',temp_max:'Maximum temperature',
      feels_like:'Feels like',windspeed:'Wind speed',agriculture:'Agriculture',markets:'Markets',technology:'Technology',viewmore: 'View more',
      news:'News',prices:'Prices',weather:'Weather',settings:'Settings',about:'About',generalsettings:'General settings',
      newssettings:'News settings',pricessettings:'Prices settings',weathersettings:'Weather settings',units:'Units',
      receivenotifications:'Receive notifications',forecast:'5-day forecast',metric:'Metric',imperial:'Imperial',sunrise:'Sunrise',
      sunset:'Sunset',machinery:'Machinery',notificationtitle:'A few days have passed since you last entered the app!',
      notificationtext:'Check out the app for more news, current prices, machinery and the weather at your location.',
      alerts:'Alerts',grants:"Grants",nogps: "No GPS",tryagain:"Try again",otherapps:"Other apps",wineroutes:"Discover new wineries and wines around the world and join winelovers' community",
      loginwith:"Login with..",select:"Select",meds:"Plant protection",farm:'Farm',land:"Land",bananas:'Bananas',beef:'Beef',butter:'Butter',carbon:'Carbon',cocoa:'Cocoa',coffee:'Coffee',
      corn:'Corn',cotton:'Cotton',dairy:'Dairy',indexes:'Indexes',meat:'Meat',oats:'Oats',oils:'Oils',oranges:'Oranges',rice:'Rice',shrimps:'Shrimps',sugar:'Sugar',tea:'Tea',tobacco:'Tobacco',
      vegetables:'Vegetables',wheat:'Wheat',wool:'Wool',fish:'Fish',close:'Close',privacy:' Privacy Policy',
      disclaimertitle:'Connecting with third party services',details:'Details',
      disclaimertext:'The application is compatible with the GDPR Regulation, as no personal data is collected either directly or through third party services. The connection via auth0 service is only available for those who explicitly choose to connect in order to receive personalized notifications regardless of device.'
    };

    const el = {
      language: 'Γλώσσα',switch1: 'Φρούτα',switch2: 'Ζωικά προϊόντα',switch3: 'Δημητριακά και Λοιπά Φυτά',switch4: 'Εκπομπές άνθρακα',switch5: 'Έλαια και αφεψήματα',
      version:' Έκδοση',attributions:' Αναφορές',products:'Προϊόντα',notifications:'Ειδοποιήσεις',updatesettings:'Ενημέρωση ρυθμίσεων',
      rateapp:"Πείτε τη γνώμη σας",temperature:'Θερμοκρασία',humidity:'Υγρασία',temp_min:'Ελάχιστη θερμοκρασία',temp_max:'Μέγιστη θερμοκρασία',
      feels_like:'Αίσθηση',windspeed:'Ταχύτητα ανέμων',agriculture:'Γεωργία',markets:'Αγορές',technology:'Τεχνολογία',viewmore: 'Περισσότερα',
      news:'Ειδήσεις',prices:'Τιμές',weather:'Καιρός',settings:'Ρυθμίσεις',about:'Σχετικά',generalsettings:'Γενικές ρυθμίσεις',
      newssettings:'Ρυθμίσεις ειδήσεων',pricessettings:'Ρυθμίσεις τιμών',weathersettings:'Ρυθμίσεις καιρού',units:'Μονάδα μέτρησης',
      receivenotifications:'Λήψη ειδοποιήσεων',forecast:'Πρόβλεψη 5 ημερών',metric:'Μετρικό',imperial:'Αγγλοσαξωνικό',sunrise:"Ανατολή ηλίου",
      sunset:'Δύση ηλίου',machinery:'Μηχανήματα',notificationtitle:'Πέρασαν λίγες μέρες από την τελευταία επίσκεψη στην εφαρμογή μας!',
      notificationtext:'Ρίξτε μια ματιά για περισσότερες ειδήσεις, τρέχουσες τιμές, μηχανήματα και τον καιρό!',
      alerts:"Προειδοποιήσεις",grants:"Ενισχύσεις",nogps:"Δεν εντοπίστηκε GPS",tryagain:"Προσπαθήστε ξανά",otherapps:"Άλλες εφαρμογές",wineroutes:"Ανακαλύψτε νέα οινοποιεία & κρασιά παγκοσμίως και ενωθείτε με οινόφιλους",
      loginwith:"Σύνδεση μέσω..",select:"Επιλογή",meds:"Γεωργικά Φάρμακα",farm:"Εκμετάλλευση",land:'Απόκτηση γης',bananas:'Μπανάνες',beef:'Βοδινό',butter:'Βούτυρο',carbon:'Εκπομπές άνθρακα',cocoa:'Κακάο',coffee:'Καφές',
      corn:'Καλαμπόκι',cotton:'Βαμβάκι',dairy:'Γαλακτοκομικά',indexes:'Δείκτες',meat:'Κρέας',oats:'Βρώμη',oils:'Έλαια',oranges:'Πορτοκάλια',rice:'Ρύζι',shrimps:'Γαρίδες',sugar:'Ζάχαρη',tea:'Τσάι',tobacco:'Καπνός',
      vegetables:'Λαχανικά',wheat:'Αλεύρι',wool:'Μαλλί',fish:'Αλιεία',close:'Κλείσιμο',privacy:' Πολιτική Απορρήτου',
      disclaimertitle:'Ενημέρωση για σύνδεση μέσω τρίτων υπηρεσιών',details:'Λεπτομέρειες',
      disclaimertext:'Η εφαρμογή είναι συμβατή με τον Κανονισμό GDPR, καθώς δε συγκεντρώνονται προσωπικά δεδομένα είτε απευθείας είτε μέσω υπηρεσιών τρίτων. Η σύνδεση μέσω υπηρεσίας auth0 προσφέρεται μόνο για όσους ρητά επιλέξουν να συνδεθούν ώστε να λαμβάνουν προσωποποιημένη ενημέρωση ανεξαρτήτως συσκευής.'

    };

    i18n.fallbacks = true;
    i18n.translations = { el, en };
    setLocale = locale => {this.setState({ locale });};
    t = (scope, options) => {return i18n.t(scope, { locale: this.state.locale, ...options });};
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading startAsync={this.loadResourcesAsync} onError={this.handleLoadingError} onFinish={() => this.handleFinishLoading()}/>
      );
    } else {
      enableScreens();
      return (
        <View style={{flex: 1}}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator screenProps={{t: t,locale: this.state.locale,setLocale: setLocale,}}/>
        </View>
      );
    }
  }

  pushLocalNotification = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      let token = await Notifications.getExpoPushTokenAsync();
      AgristatsStore.setExpoid(token);
    } else {
      AgristatsStore.setExpoid("ExponentPushToken[9dIf7bABO74TRVmmibmiRG]");
    }
    this._notificationSubscription = Notifications.addListener(this.handleNotification);
  }

  handleNotification = (notification) => {
    this.setState({ notification });
  }

  handleLoadingError(error) {
    console.warn(error);
  }

  handleFinishLoading(setLoadingComplete) {
    this.pushLocalNotification();
    this.setState({isLoadingComplete: true});
  }

  async loadResourcesAsync() {
    await Promise.all([
      Asset.loadAsync([
          require('./assets/images/cotton.png'),
          require('./assets/images/beef.png'),
          require('./assets/images/banana.png'),
          require('./assets/images/butter.png'),
          require('./assets/images/cocoa.png'),
          require('./assets/images/coffee.png'),
          require('./assets/images/corn.png'),
          require('./assets/images/cotton.png'),
          require('./assets/images/meat.png'),
          require('./assets/images/dairy.png'),
          require('./assets/images/oil.png'),
          require('./assets/images/orange.png'),
          require('./assets/images/rice.png'),
          require('./assets/images/shrimp.png'),
          require('./assets/images/sugar.png'),
          require('./assets/images/tea.png'),
          require('./assets/images/tobacco.png'),
          require('./assets/images/wheat.png'),
          require('./assets/images/wool.png'),
          require('./assets/images/oat.png'),
          require('./assets/images/index.png'),
          require('./assets/images/icon.png'),
          require('./assets/images/plants.png'),
		  require('./assets/images/fish.png'),
      ]),
      Font.loadAsync({
          // This is the font that we are using for our tab bar
          ...Ionicons.font,
          // We include SpaceMono because we use it in HomeScreen.js. Feel free to
          // remove this if you are not using it in your app
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
          'courgette': require('./assets/fonts/Courgette-Regular.ttf'),
      }),
    ]);
  }
}