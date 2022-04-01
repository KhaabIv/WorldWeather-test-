<template>
  <form @submit.prevent>
    <div class="text">
      <h3>Choose a city</h3>
      <p>To find city start typing and pick one from the suggestions</p>
    </div>
    <div class="input" :class="{ error: v$.form.city.$errors.length }">
      <input
        type="text"
        class="input__text"
        placeholder="Search city"
        v-model="v$.form.city.$model"
        @keydown.enter.prevent="getWeatherCity"
      />
      <hr :class="{ error__hr: v$.form.city.$errors.length }"/>
      <div class="error" v-if="v$.form.city.$errors.length">Choose a city</div>
      <div class="error" v-if="(requestCityError !== '' && !v$.form.city.$errors.length)">{{ requestCityError }}</div>
    </div>
    <div class="btnsGroup">
      <div class="btnsGroup__actions">
        <my-button
          @click="clearInput"
          :isDisabled="isDisabled"
        >CLEAR
        </my-button>
      </div>
      <div class="btnsGroup__change">
        <my-button
          @click="backOut">CANCEL
        </my-button>
        <my-button
          :isDisabled="isDisabled"
          @click="getWeatherCity"
        >ADD
        </my-button>
      </div>
    </div>
  </form>
</template>

<script>
import MyButton from '@/components/UI/MyButton'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import moment from 'moment'

export default {
  components: { MyButton },
  data () {
    return {
      form: {
        city: ''
      },
      requestCityError: ''
    }
  },
  props: ['apiKey'],
  setup () {
    return { v$: useVuelidate() }
  },
  validations () {
    return {
      form: {
        city: {
          required
        }
      }
    }
  },
  computed: {
    isDisabled () {
      if (this.form.city === '') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    getLoadTimeDiffCard () {
      const end = moment(Date.now())
      const duration = moment.duration(end.diff(this.lastLoadTime))
      const minutes = duration.asMinutes()
      const hours = duration.asHours()
      let label
      if (minutes < 60) {
        if (minutes < 1) {
          label = 1 + ' minute ago'
        } else {
          label = Math.round(minutes) + ' minutes ago'
        }
      } else if (minutes > 60 && minutes < 1440) {
        label = Math.round(hours) + ' hours ago'
      }
      return label
    },
    clearInput () {
      this.form.city = ''
      this.requestCityError = ''
    },
    backOut () {
      this.$emit('cancel')
      this.clearInput()
    },
    async getWeatherCity () {
      const cityName = this.form.city
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${this.apiKey}&units=metric`
      try {
        const weatherCity = await axios.get(url)
        const weatherCityCard = {
          city: weatherCity.data.name,
          country: weatherCity.data.sys.country,
          weather: weatherCity.data.weather[0].main,
          temperature: Math.round(weatherCity.data.main.temp),
          humidity: weatherCity.data.main.humidity,
          id: Date.now(),
          label: this.getLoadTimeDiffCard()
        }
        this.$emit('getWeatherCityCard', weatherCityCard)
        this.backOut()
      } catch (e) {
        this.requestCityError = 'Error! You may have entered the city incorrectly'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 500px;
  min-height: 300px;
  @media (max-width: 1023px) {
    right: 0;
    left: 0;
    min-width: 100%;
    width: 100%;
    min-height: 100px;
    height: 20%;
  }
}

h3 {
  font-size: 32px;
  font-weight: bold;
}

.text {
  margin: 10px;
}

.input {
  height: 50px;

  &__text {
    width: 100%;
    font-size: 24px;
    border: none;
    background: none;
    outline: none;

    &::placeholder {
      opacity: 0.5;
    }
  }
}

.btnsGroup {
  display: flex;
  justify-content: space-between;

  &__change {
    display: flex;
  }
}

.error {
  color: #FF0101;

  &__hr {
    height: 0;
    border-top: 1px solid #FF0101;
    border-bottom: none;
  }
}

</style>
