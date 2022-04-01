<template>
  <div class="CLoadingIcon__spinner"></div>
</template>
<script>

export default {
  name: 'MyLoader'
}
</script>
<style lang="scss">
.CLoadingIcon__spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 30px;
  border: 2px solid gray;
  border-top-color: transparent;
  animation: spin ease-in-out 1s infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
