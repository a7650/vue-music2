import {playMode} from 'common/config'
import {getSearchHistory,getMyAlbum,getCollectAlbum} from 'common/js/cache'
import {getFavoriteMid} from 'common/js/favorite'

const state = {
    singer:{},
    playing:false,
    fullScreen:false,
    playList:[],
    sequenceList:[],
    playMode:playMode.sequence,
    currentIndex:-1,
    player:{},
    rankBar:false,
    searchHistory:getSearchHistory(),
    myAlbum:getMyAlbum(),
    favoriteMid:getFavoriteMid()||[],
    collectAlbum:getCollectAlbum()
}

export default state