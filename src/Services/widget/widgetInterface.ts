interface widget {
    token: string;
    url: string;
    containerId: string;
}


// Описания типов данных в функциях weatherWidget.ts
interface geocodingCityResp{
    data: {
        coord: {
            lat: number;
            lon: number;
        }
    }
}

interface getCurrentWeatherDataResp{
    data: {
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
        timezone: number,
        id: number,
        name: string,
        cod: number  
    }
}

// export default widget;
export {widget, getCurrentWeatherDataResp, geocodingCityResp}