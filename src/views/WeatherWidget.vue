<script lang="ts">
import { defineComponent } from 'vue';
import WidgetSettings from "@/components/WidgetSettings.vue";
import weatherWidget from "@/Services/widget/weatherWidget";
export default defineComponent({
  components: {
    WidgetSettings
  },
  data() {
    return {
      settingsActive: false as boolean,
      cities: [
        'london',
        'Moscow'
      ],
      data: {
        coord: {
            lon: null as unknown as number,
            lat: undefined as unknown as number
        },
        weather: [
          {
            id: undefined as unknown as number,
            main: undefined as unknown as string,
            description: undefined as unknown as string,
            icon: undefined as unknown as string,
          }
        ],
        base: undefined as unknown as string,
        main: {
          temp: undefined as unknown as number,
          feels_like: undefined as unknown as number,
          temp_min: undefined as unknown as number,
          temp_max: undefined as unknown as number,
          pressure: undefined as unknown as number,
          humidity: undefined as unknown as number,
        },
        visibility: undefined as unknown as number,
        wind: {
          speed: undefined as unknown as number,
          deg: undefined as unknown as number,
        },
        clouds: {
          all: undefined as unknown as number,
        },
        dt: undefined as unknown as number,
        sys: {
          type: undefined as unknown as number,
          id: undefined as unknown as number,
          message: undefined as unknown as number,
          country: undefined as unknown as string,
          sunrise: undefined as unknown as number,
          sunset: undefined as unknown as number,
        },
        timezone: undefined as unknown as number,
        id: undefined as unknown as number,
        name: undefined as unknown as string,
        cod: undefined as unknown as number ,
      },
      weatherInCities: null as unknown as Array<object>
    }
  },
  methods: {
    changeCardList(val: any) {
      this.weatherInCities[val.onDropCard.index] = val.currentCard.card; // ставим карточку в руках на место карточки над которой держим
      this.cities[val.onDropCard.index] = val.currentCard.card.name; //меняем города местами для сохранения состояния после перезагрузки

      this.weatherInCities[val.currentCard.index] = val.onDropCard.card; // ставим карточку над которой держали на место карточки которую бросили
      this.cities[val.currentCard.index] = val.onDropCard.card.name;
      localStorage.setItem('cities', JSON.stringify(this.cities));
    },
    openSettings() {
      (this.$refs.widget as HTMLElement).style.overflowY = "hidden"
      this.settingsActive = true;
    },
    closeSettings() {
      (this.$refs.widget as HTMLElement).style.overflowY = "auto"
      this.settingsActive = false
    },
    removeWeatherElement(index: number) {
      this.weatherInCities.splice(index, 1);
      this.cities.splice(index, 1);
      if (this.cities.length == 0) {
        return localStorage.removeItem('cities');
      } else {
        return localStorage.setItem('cities', JSON.stringify(this.cities));
      }

    },
    async addNewLocation(newLocation: string) {
      this.cities.push(newLocation);
      this.weatherInCities.push(await this.getWeather(newLocation));
      localStorage.setItem('cities', JSON.stringify(this.cities));
    },
    async getWeather(city: string) {
      const weather = new weatherWidget();
      await weather.getCurrentWeatherData(city);
      return weather.getWeather;
    },
    async checkHaveWeatherCities() {
      this.cities = JSON.parse(localStorage.getItem('cities')!)
      
      if (this.cities != null && this.cities != undefined && this.cities.length != 0) {
        for (let index = 0; index < this.cities.length; index++) {
          const city = this.cities[index];
          let cityWeather = await this.getWeather(city);
          // console.log(cityWeather);
          
          this.weatherInCities.push(cityWeather);
        }
      } else {
        this.cities = ["Москва", "Лондон"];
        localStorage.setItem('cities', JSON.stringify(this.cities));
        for (let index = 0; index < this.cities.length; index++) {
          const city = this.cities[index];
          let cityWeather = await this.getWeather(city);
          this.weatherInCities.push(cityWeather);
        }

      }
    }
  },
  mounted () {
    this.weatherInCities = [];
    this.checkHaveWeatherCities(); 
  }
})
</script>
<template>
  <div class="widget" ref="widget">
    <WidgetSettings
      @changeCardList="changeCardList"
      @removeWeatherElement="removeWeatherElement"
      :weatherInCities="weatherInCities"
      :settingsActive="settingsActive"
      @addNewLocation="addNewLocation"
    />
    <button @click="openSettings" class="widget_settings" :class="settingsActive? 'hide':''"><img src="https://skayperteam.github.io/img/widgetSettingIcon.svg" alt="настройки"></button>
    <button @click="closeSettings" class="widget_settings" :class="settingsActive? '':'hide'"><img src="https://skayperteam.github.io/img/widgetCloseSettingIcon.svg" alt="настройки"></button>

    <div class="widget_item" v-for="(item,index) in weatherInCities" :key="index">
      <div class="widget_item_header">
        <p class="widget_item_header_title">{{item.name+', '+item.sys.country}}</p>
      </div>
      <div class="widget_item_main">
        <img class="widget_item_main_weather-icon" :src="`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`" :alt="'картинка погоды '+item.weather[0].description">
        <p class="widget_item_main_temperature">{{(item.main.temp-273.15).toFixed(2)+"°С"}}</p>
      </div>
      <p class="widget_item_text">Ощущается как {{(item.main.feels_like-273.15).toFixed(2)+"°С"}}. {{item.weather[0].description}}</p>
      <div class="widget_item_other">
        <div class="widget_item_other_first">
          <div class="widget_item_other_first_wind">
            <img src="https://skayperteam.github.io/img/widgetWindIcon.svg" alt="Ветер">
            <p>{{item.wind.speed}}м/с</p>
          </div>
          <div class="widget_item_other_first_pressure">
            <img src="https://skayperteam.github.io/img/widgetPressureIcon.svg" alt="Давление">
            <p>{{item.main.pressure}}гПа</p>
          </div>
        </div>
        <div class="widget_item_other_second">
          <div class="widget_item_other_second_humidity">
            <!-- <img src="@/assets/widgetHumidityIcon.svg" alt="Влажность"> -->
            <p>Влажность: {{item.main.humidity}}%</p>
          </div>
          <div class="widget_item_other_second_visibility">
            <p>Видимость: {{(item.visibility / 1000).toFixed(1)}}км</p>
          </div>
        </div>
      </div>
      <hr>
    </div>
    
  </div>
</template>

<style lang="sass" scoped>
.widget
  background: #eaeaea
  position: absolute
  width: 350px
  padding: 10px 20px
  height: 500px
  overflow-y: scroll
  overflow-x: hidden
  &_settings
    position: absolute
    right: 0
    background: none
    outline: none
    transform: scale(1)
    transition: transform 2s
    cursor: pointer
    border: none
    z-index: 2
    img
      width: 30px
      height: 30px
  &_item
    &_header
      display: flex
      align-items: center
      justify-content: space-between
      &_title
        font-weight: 600
    &_main
      display: flex
      align-items: center
      &_weather-icon
        width: 130px
      &_temperature
        font-size: 25px
    &_text
      text-align: left
      margin-bottom: 15px
    &_other
      &_first
        margin-bottom: 15px
        display: flex
        &_wind
          display: flex
          img
            width: 30px
          p
        &_pressure
          display: flex
          img
            width: 30px
          p
      &_second
        &_humidity
          margin-bottom: 15px
          p
        &_visibility
          margin-bottom: 15px
          p
  hr
    opacity: .5
    margin-bottom: 15px
.hide
  transform: scale(0)
  transition: transform 2s
</style>
