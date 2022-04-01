<template>
  <div>
    <div class="modal" v-if="show" @click="hideModal">
      <div @click.stop class="modal__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hideModal () {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  overflow: hidden;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
  z-index: 23;

  &__content {
    margin: auto;
    background: white;
    border-radius: 6px;
    min-width: 500px;
    min-height: 300px;
    padding: 10px 15px;
    @media (max-width: 1023px) {
      right: 0;
      left: 0;
      min-width: 100%;
      width: 100%;
      min-height: 115px;
      height: 20%;
    }
  }
}
</style>
