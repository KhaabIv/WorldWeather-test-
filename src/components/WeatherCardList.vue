<template>
  <div class="weatherCardList" :class="{ 'weatherCardList__cards': lengthCardArray < 3 }">
    <weather-card
      v-for="card in cards"
      :apiKey="apiKey"
      :key="card.id"
      :card="card"
      @remove="$emit('remove', card)"
      @reloadLabel="$emit('reloadLabel', $event)"
      @changeWeatherCard="$emit('changeWeatherCard', $event)"
    ></weather-card>
  </div>
</template>

<script>
import WeatherCard from '@/components/WeatherCard'

export default {
  components: { WeatherCard },
  data () {
    return {
      manyCards: false
    }
  },
  props: {
    cards: {
      type: Array,
      required: true
    },
    apiKey: {
      type: String,
      required: true
    },
    lengthCardArray: {
      type: Number,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
.weatherCardList {
  display: flex;
  justify-content: start;
  width: 100%;
  overflow-y: hidden;
  overflow-x: auto;

  &__cards {
    justify-content: center;
  }

  @media (max-width: 1023px) {
    flex-direction: column;
  }
}

</style>
