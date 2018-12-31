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

Vue.prototype.filterCurrent=function(val,playload){
  switch (true){
    case !playload.url : 
      return `${val}(暂无音源)`;
    case !(playload.id[0]&&playload.id[1]) : 
      if(playload.mid[0]===playload.mid[1]){
        return `${val}(正在播放)`
      }else{
        return val
      }
    case !!playload.id[0] :
      if(playload.id[0]===playload.id[1]){
        return `${val}(正在播放)`
      }else{
        return val
      }
    default : return val
  }
}



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
