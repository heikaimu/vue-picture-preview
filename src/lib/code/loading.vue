<template>
  <div class="loading"></div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.loading {
  width: 32px;
  height: 32px;
  background: url("../icons/loading.png");
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -16px;
  margin-top: -16px;
  -webkit-animation: scale 2s infinite linear;
  -webkit-transition-property: -webkit-transform;
  -webkit-transition-duration: 0.3s;
  -moz-transition-property: -moz-transform;
  -moz-transition-duration: 0.3s;
  animation: rotate 1s linear infinite;
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes rotate {
  from {
    -moz-transform: rotate(0deg);
  }
  to {
    -moz-transform: rotate(359deg);
  }
}
@-o-keyframes rotate {
  from {
    -o-transform: rotate(0deg);
  }
  to {
    -o-transform: rotate(359deg);
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
