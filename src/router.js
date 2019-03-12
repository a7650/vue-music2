import Vue from 'vue'
import Router from 'vue-router'


const rank = () => import('components/rank/rank')
const singer = () => import('components/singer/singer')
const recommend = () => import('components/recommend/recommend')
const mine = () => import('components/mine/mine')
const singerDetail = () => import('components/singer-detail/singer-detail')
const discDetail = () => import('components/disc-detail/disc-detail')
const rankDetail = () => import('components/rank-detail/rank-detail')
const myAlbum = () => import('components/myAlbum/myAlbum')
const playHistory = () => import('components/playHistory/playHistory')
const myAlbumDetail = () => import('components/myAlbum/myalbum-detail')

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
      redirect: '/mine/myAlbum',
      children: [
        {
          path: '/mine/myAlbum',
          component: myAlbum,
          children: [
            {
              name: 'myAlbumDetail',
              path: ':id',
              component: myAlbumDetail
            },
            {
              name: 'collectAlbumDetail',
              path: ':id',
              component: discDetail
            },
          ]
        },
        {
          path: '/mine/playHistory',
          component: playHistory
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
