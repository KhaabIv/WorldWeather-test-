<template>
  <div class="weatherCard">
    <h1 style="height: 75px"><strong>{{ card.city }}</strong></h1>
    <h3>{{ card.country }}</h3>
    <div class="error" v-if="requestCityError !== ''">{{ requestCityError }}</div>
    <my-item-card>Weather
      <template v-slot:item>{{ card.weather }}</template>
    </my-item-card>
    <hr/>
    <my-item-card>Temperature
      <template v-slot:item>{{ card.temperature }} &#8451;</template>
    </my-item-card>
    <hr/>
    <my-item-card>Humidity
      <template v-slot:item>{{ card.humidity }} %</template>
    </my-item-card>
    <hr/>
    <div class="weatherCard__leabel">{{ card.label }}</div>
    <div class="btns">
      <my-button
        @click="$emit('remove', card)">REMOVE
      </my-button>
      <my-button
        @click="reloadWeather">RELOAD
      </my-button>
    </div>
  </div>
</template>

<script>
import MyItemCard from '@/components/UI/MyItemCard'
import MyButton from '@/components/UI/MyButton'
import moment from 'moment'
import axios from 'axios'

export default {
  components: {
    MyButton,
    MyItemCard
  },
  props: {
    card: {
      type: Object,
      required: true
    },
    apiKey: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      lastLoadTime: moment(Date.now()),
      label: null,
      labelReloadTimer: null,
      requestCityError: ''
    }
  },
  methods: {
    getLoadTimeDiffCard () {
      const end = moment(Date.now())
      const duration = moment.duration(end.diff(this.lastLoadTime))
      const minutes = duration.asMinutes()
      const hours = duration.asHours()
      if (minutes < 60) {
        if (minutes < 1) {
          this.label = 1 + ' minute ago'
        } else {
          this.label = Math.round(minutes) + ' minutes ago'
        }
      } else if (minutes > 60 && minutes < 1440) {
        this.label = Math.round(hours) + ' hours ago'
      }
    },
    async reloadWeather () {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.card.city}&appid=${this.apiKey}&units=metric`
      try {
        const weatherCity = await axios.get(url)
        this.lastLoadTime = moment(Date.now())
        this.getLoadTimeDiffCard()
        this.$emit('changeWeatherCard', [weatherCity, this.card, this.label])
        this.requestCityError = ''
      } catch (e) {
        this.requestCityError = 'Error! Check network status'
      }
    }
  },
  mounted () {
    this.labelReloadTimer = setInterval(() => {
      this.getLoadTimeDiffCard()
      this.$emit('reloadLabel', [this.label, this.card])
    }, 60000)
  },
  unmounted () {
    clearInterval(this.labelReloadTimer)
  }
}
</script>

<style lang="scss" scoped>
h3 {
  margin: 10px 0;
}

.weatherCard {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 40%;
  min-width: 200px;
  height: fit-content;
  margin: 5px 10px;
  padding: 10px 24px;
  box-shadow: 0 2px 10px rgba(10, 10, 10, 0.25);
  border-radius: 6px;
  @media (max-width: 1023px) {
    margin: 10px 0 0;
    max-width: 100%;
  }

  &__leabel {
    display: flex;
    flex-direction: column;
    align-items: end;
    opacity: .5;
  }
}

.btns {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.error {
  color: #FF0101;
}
</style>
