import {
  widget as widgetInterface, //Основной интерфейс описывающий обязательные переменные виджетов
  getCurrentWeatherDataResp, 
  geocodingCityResp
} from "./widgetInterface";

import HttpClient from "@/Services/HttpClient"
class weatherWidget implements widgetInterface {
    token: string = "6215be9eaeb1ed4141d9918c565a143b";
    containerId: string = "#weather-widget";
    url: string = "https://api.openweathermap.org";
    // @ts-ignore
    coord: {
        lat: number;
        lon: number;
    };
    // @ts-ignore
    CurrentWeatherData: {
        coord: {
            lon: number
            lat: number
        },
        weather: [
          {
            id: number
            main: string
            description: string
            icon: string
          }
        ],
        base: string
        main: {
          temp: number
          feels_like: number
          temp_min: number
          temp_max: number
          pressure: number
          humidity: number
        },
        visibility: number
        wind: {
          speed: number
          deg: number
        },
        clouds: {
          all: number
        },
        dt: number
        sys: {
          type: number
          id: number
          message: number
          country: string
          sunrise: number
          sunset: number
        },
        timezone: number
        id: number
        name: string
        cod: number  
    }

    async getCurrentWeatherData(city: string) {
        await this.geocodingCity(city);
        
        let {lat, lon}: {lat: number | undefined, lon: number | undefined} = this.coord;
        let data = HttpClient.get(`/data/2.5/weather?lang=ru&lat=${lat}&lon=${lon}&appid=${this.token}`)
        const response = await data.then((res: getCurrentWeatherDataResp) => {
            return this.CurrentWeatherData = res.data;
        })
        return this.CurrentWeatherData
        
    }
    get getWeather() {              
        return this.CurrentWeatherData;
    }
    async geocodingCity(city: string) {
        const data = HttpClient.get(`/data/2.5/weather?q=${city}&appid=${this.token}`)
        const response = await data.then((res: geocodingCityResp) => {            
            return this.coord = res.data.coord;
        })
    }

}


export default weatherWidget;