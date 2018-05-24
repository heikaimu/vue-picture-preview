import Vue from 'vue'
import App from './App.vue'
import VuePicturePreview from './lib/picture-preview.vue';
export default VuePicturePreview;

new Vue({
  el: '#app',
  render: h => h(App)
})
