import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import moment from 'moment'

export function getDataCurrentCity () {
  const currentWeatherCity = ref({
    city: '',
    country: '',
    weather: null,
    temperature: null,
    humidity: null,
    id: null,
    label: ''
  })
  const requestCityError = ref('')
  const coordinatesCurrentCity = ref({})
  const lastLoadTime = ref(moment(Date.now()))
  const url = ref('')
  const weatherUrl = ref('')
  const isLoading = ref(true)
  const labelReloadTimer = ref(null)
  const keyApi = '7da2e7a5be127f6329a7d7a315afe115'
  const currentLocation = () => {
    return new Promise((resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
      }

      function success (pos) {
        const crd = pos.coords
        coordinatesCurrentCity.value = {
          latitude: crd.latitude,
          longitude: crd.longitude
        }
        url.value = `https://api.openweathermap.org/geo/1.0/reverse?lat=${coordinatesCurrentCity.value.latitude}&lon=${coordinatesCurrentCity.value.longitude}&limit=5&appid=${keyApi}`
        weatherUrl.value = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinatesCurrentCity.value.latitude}&lon=${coordinatesCurrentCity.value.longitude}&appid=${keyApi}&units=metric`
        resolve()
      }

      function error (err) {
        console.warn(`ERROR(${err.code}): ${err.message}`)
      }

      navigator.geolocation.getCurrentPosition(success.bind(this), error, options)
    })
  }
  const fetchWeight = async () => {
    isLoading.value = true
    try {
      const city = await axios.get(url.value)
      const weatherCity = await axios.get(weatherUrl.value)
      currentWeatherCity.value = {
        city: city.data[0].name,
        country: city.data[0].country,
        weather: weatherCity.data.weather[0].main,
        temperature: Math.round(weatherCity.data.main.temp),
        humidity: weatherCity.data.main.humidity,
        id: Date.now()
      }
    } catch (e) {
      requestCityError.value = 'Error! Check network status'
    } finally {
      isLoading.value = false
    }
  }
  const getLoadTimeDiff = () => {
    const end = moment(Date.now())
    const duration = moment.duration(end.diff(lastLoadTime.value))
    const minutes = duration.asMinutes()
    const hours = duration.asHours()
    if (minutes < 60) {
      if (minutes < 1) {
        currentWeatherCity.value.label = 1 + ' minute ago'
      } else {
        currentWeatherCity.value.label = Math.round(minutes) + ' minutes ago'
      }
    } else if (minutes > 60 && minutes < 1440) {
      currentWeatherCity.value.label = Math.round(hours) + ' hours ago'
    }
  }
  const reloadDataWeather = () => {
    try {
      currentLocation().then(() => {
        fetchWeight().then(r => getLoadTimeDiff())
        lastLoadTime.value = moment(Date.now())
        labelReloadTimer.value = setInterval(() => {
          getLoadTimeDiff()
        }, 60000)
      })
    } catch (e) {
    }
  }
  onMounted(reloadDataWeather)
  onUnmounted(() => {
    clearInterval(labelReloadTimer.value)
  })
  return {
    currentWeatherCity,
    requestCityError,
    isLoading,
    reloadDataWeather,
    getLoadTimeDiff
  }
}
