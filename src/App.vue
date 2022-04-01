<template>
  <div class="app">
    <h1 class="startPage">WORLD WEATHER</h1>
    <my-modal
      v-model:show="modalVisible"
    >
      <form-selection-city
        @cancel="modalVisible = false"
        @getWeatherCityCard="getWeatherCityCard"
        :apiKey="keyApi"
      ></form-selection-city>
    </my-modal>
    <p>Watch weather in your current location</p>
    <div class="currentWeatherCity" :class="{'currentWeatherCity__isLoading': isLoading}">
      <my-loader v-if="isLoading"></my-loader>
      <div v-else>
      <h1 style="margin: 10px"><strong>{{ currentWeatherCity.city }}, {{ currentWeatherCity.country }}</strong></h1>
      <h3 style="margin: 10px">Your current position</h3>
      <div class="currentWeatherCity__items">
        <my-item-card>Weather
          <template v-slot:item>{{ currentWeatherCity.weather }}</template>
        </my-item-card>
        <hr/>
        <my-item-card>temperature
          <template v-slot:item>{{ currentWeatherCity.temperature }} &#8451;</template>
        </my-item-card>
        <hr/>
        <my-item-card>humidity
          <template v-slot:item>{{ currentWeatherCity.humidity }} %</template>
        </my-item-card>
        <hr/>
      </div>
      <div class="labels">{{ currentWeatherCity.label }}</div>
      <div>
        <my-button @click="reloadDataWeather" class="currentWeatherCity__btn">RELOAD</my-button>
      </div>
        </div>
    </div>
    <div class="weatherCardsList">
      <weather-card-list
        :apiKey="keyApi"
        :cards="cards"
        :lengthCardArray="lengthCardArray"
        @remove="removeCard"
        @reloadLabel="setLabelCard"
        @changeWeatherCard="setWeatherCard"
      ></weather-card-list>
      <my-add-card-city-button
        class="addCardCity"
        @click="modalVisible = true"
      ></my-add-card-city-button>
    </div>
  </div>
</template>

<script>
import WeatherCardList from '@/components/WeatherCardList'
import MyItemCard from '@/components/UI/MyItemCard'
import MyButton from '@/components/UI/MyButton'
import MyAddCardCityButton from '@/components/UI/MyAddCardCityButton'
import FormSelectionCity from '@/components/FormSelectionCity'
import { getDataCurrentCity } from '@/hooks/getDataCurrentCity'
import MyLoader from '@/components/UI/MyLoader'

export default {
  components: {
    MyLoader,
    FormSelectionCity,
    MyAddCardCityButton,
    MyButton,
    MyItemCard,
    WeatherCardList
  },
  data () {
    return {
      keyApi: '7da2e7a5be127f6329a7d7a315afe115',
      modalVisible: false,
      cards: [],
      cardsUpdateSignal: false,
      lengthCardArray: null,
      labelReloadTimer: null
    }
  },
  setup (props) {
    const {
      currentWeatherCity,
      requestCityError,
      isLoading,
      reloadDataWeather,
      getLoadTimeDiff
    } = getDataCurrentCity()
    return {
      currentWeatherCity,
      requestCityError,
      isLoading,
      reloadDataWeather,
      getLoadTimeDiff
    }
  },
  watch: {
    cardsUpdateSignal (newSignal) {
      if (newSignal) {
        const cards = JSON.stringify(this.cards)
        localStorage.cards = cards
      }
      this.cardsUpdateSignal = false
    }
  },
  methods: {
    getWeatherCityCard (weatherCityCard) {
      this.cards.unshift(weatherCityCard)
      this.lengthCardArray = this.cards.length
      this.cardsUpdateSignal = true
    },
    removeCard (card) {
      this.cards = this.cards.filter(p => p.id !== card.id)
      this.cardsUpdateSignal = true
      this.lengthCardArray = this.cards.length
    },
    setLabelCard (event) {
      const changeCard = this.cards.find(card => card.id === event[1].id)
      changeCard.label = event[0]
      this.cards[this.cards.findIndex(card => card.id === event[1].id)] = changeCard
      this.cardsUpdateSignal = true
    },
    setWeatherCard (event) {
      let changeCard = this.cards.find(card => card.id === event[1].id)
      const idThisCard = changeCard.id
      const weatherCity = event[0]
      changeCard = {
        city: weatherCity.data.name,
        country: weatherCity.data.sys.country,
        weather: weatherCity.data.weather[0].main,
        temperature: Math.round(weatherCity.data.main.temp),
        humidity: weatherCity.data.main.humidity,
        id: idThisCard,
        label: event[2]
      }
      this.cards[this.cards.findIndex(card => card.id === event[1].id)] = changeCard
      this.cardsUpdateSignal = true
    }
  },
  mounted () {
    if (localStorage.cards !== undefined) {
      const cards = JSON.parse(localStorage.cards)
      this.cards = cards
    }
    this.lengthCardArray = this.cards.length
  }
}
</script>

<style lang="scss">
* {
  font-family: Lato;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  height: 100vh;
  width: 100vw;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: normal;

  ::-webkit-scrollbar {
    height: 7px;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.2) inset;
    background-color: #f9f9fd;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: linear-gradient(180deg, #918f93, #d7d6d9);
  }

  @media (max-width: 1023px) {
    display: block;
    height: 100%;
  }
}

.startPage {
  font-size: 70px;
  font-weight: 300;
  @media (max-width: 1023px) {
    text-align: center;
  }
}

p {
  @media (max-width: 1023px) {
    display: none;
  }
}

.currentWeatherCity {
  vertical-align: top;
  width: 40%;
  margin: 10px 10px 50px 10px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(10, 10, 10, 0.25);
  border-radius: 6px;
  @media (max-width: 1023px) {
    width: 100%;
    margin: 0;
  }
  &__isLoading {
    min-height: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (max-width: 1023px) {
      min-height: 300px;
      width: 100%;
      margin: 0;
    }
  }

  &__items {
    display: flex;
    flex-direction: column;
    margin: 10px;
  }

  &__btn {
    display: flex;
    flex-direction: column;
    align-items: end;
    margin: 10px;
  }
}

.labels {
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: end;
  margin: 0 10px;
  opacity: .5;
}

.weatherCardsList {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: end;
}

.addCardCity {
  position: absolute;
  right: 10px;

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 1023px) {
    position: fixed;
    right: 0;
    bottom: 0;
  }
}

</style>
