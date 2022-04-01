<template>
  <div>
    <button
      class="btn"
      :class="{'btn__disable': isDisabled }"
      :disabled="isDisabled"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script>
export default {
  name: 'MyButton',
  props: ['isDisabled']
}
</script>

<style lang="scss" scoped>
.btn {
  width: 64px;
  height: 24px;
  white-space: pre-wrap;
  border: none;
  outline: none;
  background-color: white;
  color: #9b51e0;
  cursor: pointer;

  &:hover {
    border: 1px solid #9B51E0;
    border-radius: 5px;
    background-color: rgb(211, 211, 211, 0.3);
  }

  &__disable {
    opacity: 0.5;
    cursor: not-allowed;
    color: rgb(154, 154, 154);

    &:hover {
      background: none;
      cursor: not-allowed;
    }
  }
}

</style>
