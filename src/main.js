import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import fastclick from 'fastclick'
import axios from 'axios'
import lazyload from 'vue-lazyload'
import 'common/stylus/index.less'

fastclick.attach(document.body)
Vue.prototype.axios=axios
Vue.config.productionTip = false

Vue.use(lazyload,{
  loading:require('common/image/lazyload.png'),
  attempt:3
})

Vue.filter("filterCurrent",(val,id1,id2,url) => {
  if(!url){
    return `${val}(暂无音源)`
  }
  if(id1 === id2){
      return `${val}(正在播放)`
  }
  else{
      return val;
  }
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
