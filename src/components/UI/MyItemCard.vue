<template>
  <div class="item">
    <div>
      <slot></slot>
    </div>
    <div>
      <slot name="item"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyItemCard'
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  margin: 10px 0;
  justify-content: space-between;
}
</style>
