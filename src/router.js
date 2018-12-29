import Vue from 'vue'
import Router from 'vue-router'
import rank from 'components/rank/rank'
import singer from 'components/singer/singer'
import recommend from 'components/recommend/recommend'
import mine from 'components/mine/mine'
import singerDetail from 'components/singer-detail/singer-detail'
import discDetail from 'components/disc-detail/disc-detail'
import rankDetail from 'components/rank-detail/rank-detail'
import myAlbum from 'components/myAlbum/myAlbum'
import playHistory from 'components/playHistory/playHistory' 
import myAlbumDetail from 'components/myAlbum/myalbum-detail'
Vue.use(Router)

export default new Router({

  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: rank,
      children: [
        {
          name: "rankDetail",
          path: ":topid",
          component: rankDetail
        }
      ]
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {
          name: 'singerDetail',
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/mine',
      component: mine,
      redirect:'/mine/myAlbum',
      children: [
        {
          path: '/mine/myAlbum',
          component: myAlbum,
          children:[
            {
              name:'myAlbumDetail',
              path: ':id',
              component:myAlbumDetail
            },
            {
              name: 'collectAlbumDetail',
              path: ':id',
              component: discDetail
            },
          ]
        },
        {
          path:'/mine/playHistory',
          component:playHistory
        }
      ]
    },
    {
      path: '/recommend',
      component: recommend,
      children: [
        {
          name: 'discDetail',
          path: ':id',
          component: discDetail
        },
        {
          name: 'zhidaDetail',
          path: ':id',
          component: singerDetail
        }
      ]
    }

  ]
})
