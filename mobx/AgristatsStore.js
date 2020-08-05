import { create, persist } from "mobx-persist";
import { observable, action } from 'mobx';
import { AsyncStorage } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Localization from 'expo-localization';
import moment from 'moment';

class AgristatsStore {

  @persist @observable newslanguage='gr';
  @persist @observable weatherlanguage='el';
  @persist @observable weatherunits='metric';
  @persist @observable enableNotifs=true;
  @persist @observable selectedMeasures='[]';
  @persist @observable selectedCompanies="[]";
  @persist @observable logged=false;
  @observable newschange=false;
  @observable news=[];
  @observable filterednews=[];
  @observable temperature = 0;
  @observable weathercondition = '';
  @observable location = '';
  @observable humidity = null;
  @observable feels_like = 0;
  @observable windspeed = 0;
  @observable weathericon = '';
  @observable country = '';
  @observable weatherforecast=[];
  @observable weatherloading=true;
  @observable prices=null;
  @observable filteredprices=null;
  @observable machinery=null;
  @observable filteredmachinery=null;
  @observable alerts=null;
  @observable filteredalerts=null;
  @observable land=null;
  @observable filteredland=null;
  @observable grants=null;
  @observable filteredgrants=null;
  @observable sunrise=null;
  @observable sunset=null;
  @observable gpsreject=false;
  @persist @observable socialid=null;
  @persist @observable socialname=null;
  @persist @observable socialemail=null;
  @persist @observable socialphotoUrl=null;
  @observable expoid=null;

  getNewsData = (newslanguage) => {
    const url = "https://app.agristats.eu/getagrinews?language="+newslanguage;
    fetch(url)
    .then(res => res.json())
    .then(res => {
      for (var i = 0; i < res.length; i++){
        res[i].publishedAt=res[i].publishedat.slice(0,-13);
      };
      this.news=res;
      this.filterednews=res;
      this.newschange = true;
    })
    .catch(error => {
      console.log(error);
    });
  };

  fetchWeather(lat, lon, units, language) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=14b347cf62f53527af551488305cc692&units=${units}&lang=${language}`)
    .then(res => res.json())
    .then(data => {
      this.temperature= data.main.temp;
      this.weathercondition= data.weather[0].main;
      this.location= data.name;
      this.humidity= data.main.humidity;
      this.feels_like= data.main.feels_like;
      this.windspeed= data.wind.speed;
      this.country=data.sys.country;
      this.weatherloading=false;
      this.weathericon=data.weather[0].icon;
      this.sunrise=data.sys.sunrise;
      this.sunset=data.sys.sunset;
    });
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=14b347cf62f53527af551488305cc692&units=${units}&lang=${language}`)
    .then(res => res.json())
    .then(data => {
      this.weatherforecast= data.list;
    });
  }

  @action getMachinery (company) {
    const url = "https://app.agristats.eu/getmachinery?company="+company;
    fetch(url)
    .then(res => res.json())
    .then(res => {
      this.machinery=res;
      this.filteredmachinery=res;
    })
    .catch(error => {
      console.log(error);
    });
  }

  @action getAlerts () {
    const url = "https://app.agristats.eu/getagrialerts";
    fetch(url)
    .then(res => res.json())
    .then(res => {
      for (var i = 0; i < res.length; i++){
        res[i].date=moment(res[i].date).format('DD/MM/YY');
      };
      this.alerts=res;
      this.filteredalerts=res;
    })
    .catch(error => {
      console.log(error);
    });
  }

  @action getPrices (product) {
    const url = "https://app.agristats.eu/getpricesshort?product="+product;
    fetch(url)
    .then(res => res.json())
    .then(res => {
      for (var i = 0; i < res.length; i++){
        res[i].date=res[i].date.slice(0,-13);
      };
      this.prices=res;
      this.filteredprices=res;
    })
    .catch(error => {
      console.log(error);
    });
  }

  @action getGrants (measure) {
    const url = "https://app.agristats.eu/getgrants?measure="+measure;
    fetch(url)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      this.grants=res;
      this.filteredgrants=res;
    })
    .catch(error => {
      console.log(error);
    });
  }

  @action getLand (measure) {
    const url = "https://app.agristats.eu/getland";
    fetch(url)
    .then(res => res.json())
    .then(res => {
      for (var i = 0; i < res.length; i++){
        res[i].date=moment(res[i].date).format('DD/MM/YY');
      };
      this.land=res;
      this.filteredland=res;
    })
    .catch(error => {
      console.log(error);
    });
  }

  @action changeMachinery (text) {
    const newData = this.machinery.filter(item => {
      const itemData = `${item.model.toUpperCase()}}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.filteredmachinery=newData;
  }

  @action changePrices (text) {
    const newData = this.prices.filter(item => {
      const itemData = `${item.description.toUpperCase()} ${item.product.toUpperCase()} ${item.product.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.filteredprices=newData;
  }

  @action changeAlerts (text) {
    const newData = this.alerts.filter(item => {
      const itemData = `${item.unit.toUpperCase()} ${item.crop.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.filteredalerts=newData;
  }

  @action changeLand (text) {
    const newData = this.land.filter(item => {
      const itemData = `${item.title.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.filteredland=newData;
  }

  @action changeGrants (text) {
    const newData = this.grants.filter(item => {
      const itemData = `${item.subject.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.filteredgrants=newData;
  }

  @action changeNews (text) {
    const newData = this.news.filter(item => {
      const itemData = `${item.title.toUpperCase()} ${item.description.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.filterednews=newData;
  }

  @action changeNewsLanguage (newslanguage) {
    this.newslanguage = newslanguage;
    this.getNewsData(newslanguage);
  }

  @action enablenotifications() {
    if (this.enableNotifs===true){this.enableNotifs=false} 
    else {this.enableNotifs=true};
  }

  @action async changeWeatherSettings (weatherunits, weatherlanguage) {
    this.weatherloading = true;
    this.weatherunits = weatherunits;
    this.weatherlanguage = weatherlanguage;
    const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      navigator.geolocation.getCurrentPosition(
        position => {this.fetchWeather(position.coords.latitude, position.coords.longitude, this.weatherunits, this.weatherlanguage);this.gpsreject = false;},
        error => {this.gpsreject = true}
      );
    } else {
      alert('Location permission not granted');
    }
  }

  @action async deviceidsend(token){
    const url = "https://app.agristats.eu/deviceidsend?token="+token;
    fetch(url)
    .then(res => res.json())
    .then(res => {
      console.log("Sent",res);
    })
    .catch(error => {
      console.log(error);
    });
  }

  @action getSocialDetails(socialid,name,email,photoUrl){
    this.socialid=socialid;
    this.socialname=name;
    this.socialemail=email;
    this.socialphotoUrl=photoUrl;
    this.logged=true;
  }

  @action logout(){
    this.logged=false;
    this.socialid=null;
    this.socialname=null;
    this.socialemail=null;
    this.socialphotoUrl=null;
  }

  @action createUser () {
    const url = "https://app.agristats.eu/createAgristatsUser?userid="+this.socialid+"&username="+this.socialname+"&expoid="+this.expoid+"&socialid="+
      this.socialid+"&email="+this.socialemail+"&enableNotifs="+this.enableNotifs+"&grantsprefs="+this.selectedMeasures+"&companiesprefs="+this.selectedCompanies;
    fetch(url).then(res => res.json())
    .then(res => {console.log(res)})
    .catch(error => {console.log(error);});
  }

  @action updatePrefs(){
    const url = "https://app.agristats.eu/createAgristatsUser?userid="+this.socialid+"&username="+this.socialname+"&expoid="+this.expoid+"&socialid="+
      this.socialid+"&email="+this.socialemail+"&enableNotifs="+this.enableNotifs+"&grantsprefs="+this.selectedMeasures+"&companiesprefs="+this.selectedCompanies;
    fetch(url).then(res => res.json())
    .then(res => {console.log(res)})
    .catch(error => {console.log(error);});
  }

  @action changeGrantsPrefs(selectedMeasures){
    console.log(selectedMeasures);
    this.selectedMeasures=JSON.stringify(selectedMeasures);
  }

  @action changeCompaniesPrefs(selectedCompanies){
    this.selectedCompanies=JSON.stringify(selectedCompanies);
  }

  @action async setExpoid(token){
    this.expoid=token;
  }
}

const hydrate = create({storage: AsyncStorage,jsonify: true })
const store = new AgristatsStore()
export default store
hydrate('agristats', store)