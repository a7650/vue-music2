import jsonp from 'common/js/jsonp'
import { commonParams, options, PRODUCTION } from './config'
import axios from 'axios'




export function getDiscList() {
  const url = PRODUCTION ? 'http://106.12.198.147/music/api/getDiscList' : '/getDiscList';
  const data = Object.assign({}, commonParams, {
    picmid: 1,
    rnd: 0.3907097673865849,
    loginUin: 0,
    hostUin: 0,
    notice: 0,
    platform: "yqq",
    needNewCode: 0,
    categoryId: 165,
    sortId: 2,
    sin: 0,
    ein: 29,
    format: "json"
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    let list = res.data.data.list;
    return Promise.resolve(list);
  })
}

export function getRadioList() {
  const url = "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
  const data = Object.assign({}, commonParams, {
    uin: 0,
    format: "json",
    platform: "h5",
    needNewCode: 1,
    _: 1543415239583
  });
  return jsonp(url, data, options).then(res => {
    return res.data;
  });
}


export function getDiscSongList(mid) {
  const url = PRODUCTION ? 'http://106.12.198.147/music/api/getDiscSongList' : '/getDiscSongList';
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: mid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then(data => {
    return Promise.resolve(data.data.cdlist[0]);
  })
}