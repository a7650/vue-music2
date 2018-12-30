
var express = require('express')
var compression = require('compression')
var axios = require('axios')

var app = express()

var apiRoutes = express.Router()

apiRoutes.get('/getSingerList',function(req,res){
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  axios.get(url,{
    headers:{
      referer: 'https://y.qq.com/portal/singer_list.html'
    },
    params:req.query
  }).then(response => {
    res.json(response.data)
  }).catch(e => {
    console.log(e)
  })
})

apiRoutes.get('/getDiscList', function (req, res) {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    axios.get(url, {
      headers: {
        referer: 'https://y.qq.com/portal/playlist.html',
      },
      params: req.query
    }).then((response) => {
      res.json(response.data)
    }).catch((e) => {
      console.log(e)
    })
  })


  apiRoutes.get('/getSongList',function(req,res){
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    axios.get(url,{
      headers:{
        referer: 'https://y.qq.com/n/yqq/singer/'
      },
      params:req.query
    }).then(response => {
      res.json(response.data)
    }).catch(e => {
      console.log(e)
    })
  })

  apiRoutes.get('/getLyric',function(req,res){
    const url = 'https://szc.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
    axios.get(url,{
      headers:{
        referer:'https://y.qq.com/portal/player.html'
      },
      params:req.query
    }).then(response => {
      let data = response.data
      if (typeof data === 'string') {
        const reg = /^\w+\(({.+})\)$/
        const matches = data.match(reg)
        if (matches) {
          data = JSON.parse(matches[1])
        }
      }
      res.json(data)
    }).catch(e => {
      console.log(e)
    })
  })

  apiRoutes.get('/getDiscSongList',function(req,res){
    const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
    axios.get(url,{
      headers:{
        referer:'https://y.qq.com/n/yqq/playsquare'
      },
      params:req.query
    }).then(response => {
      res.json(response.data)
    }).catch(e => {
      console.log(e);
    })
  })

  apiRoutes.get('/getSearch',function(req,res){
    const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
    axios.get(url,{
      headers:{
        origin:'https://y.qq.com',
        referer:'https://y.qq.com/m/index.html',
      },
      params:req.query
    }).then(response => {
      res.json(response.data)
    }).catch(e => {
      console.log(e)
    })
  })

  apiRoutes.get('/getDiscItem',function(req,res){
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    axios.get(url,{
      params:req.query
    }).then(response => {
      res.json(response.data)
    }).catch(e => {
      console.log(e)
    })
  })

  apiRoutes.get('/getDiscList',function(req,res){
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    axios.get(url,{
      params:req.query
    }).then(response => {
      res.json(response.data)
    }).catch(e => {
      console.log(e)
    })
  })

  app.use('/api', apiRoutes)

  app.use(compression())
  
  app.use(express.static('./dist'))

  module.exports = app.listen(9000,function(err){
    if(err){
      console.log(err)
      return
    }
    console.log("Listen at 9000 port");
  })