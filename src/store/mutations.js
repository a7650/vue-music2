import * as types from './mutation-types'
import {saveSearchHistory,clearSearchHistory,getMyAlbum,getCollectAlbum} from 'common/js/cache'
import {getFavoriteMid,addFavorite,deleteFavorite} from 'common/js/favorite'

const mutations = {
    [types.SET_SINGER](state,singer){
        state.singer = singer;
    },

    [types.SET_PLAYING](state,flag){
        state.playing = flag;
    },

    [types.SET_FULLSCREEN](state,flag){
        state.fullScreen = flag;
    },

    [types.SET_PLAYLIST](state,list){
        state.playList = list;
    },

    [types.SET_SEQUENCELIST](state,list){
        state.sequenceList = list;
    },

    [types.SET_PLAYMODE](state,mode){
        state.playMode = mode;
    },

    [types.SET_CURRENTINDEX](state,index){
        state.currentIndex = index;
    },

    [types.DELETE_PLAYLIST](state,index){
        state.playList.splice(index,1);
        if(state.currentIndex>index){
            state.currentIndex--;
        }
        state.sequenceList = state.playList;
    },

    [types.DELETE_SEQUENCELIST](state,index){
        state.sequenceList.splice(index,1);
    },

    [types.SET_PLAYER](state,obj){
        state.player = obj;
    },

    [types.SET_RANKBAR](state,flag){
        state.rankBar = flag;
    },

    [types.ADD_SONG](state,song){
        let n = -1;
        state.playList.forEach((item,index)=>{
            if(item.id===song.id){
                n=index;
            }
        })
        if(n>-1){
            state.currentIndex = n;
        }else{
            if(state.currentIndex===state.playList.length-1){
                state.playList.push(song)
            }
            else{
                state.playList.splice(state.currentIndex+1,0,song)
            }
            state.currentIndex++;
        }
    },

    [types.SAVE_SEARCHHISTORY](state,val){
        state.searchHistory = saveSearchHistory(val);
    },

    [types.CLEAR_SEARCHHISTORY](state,payload){
        state.searchHistory = clearSearchHistory(payload);
    },

    [types.NEXT_PLAY](state,song){
        let newSong = Object.assign({},song);
        newSong.id2 = song.id;
        newSong.id = Symbol();
        newSong.getLyric = song.getLyric;
        state.playList.splice(state.currentIndex+1,0,newSong);
        if(state.playList.length===1){
            state.currentIndex = 0;
            state.playing = true;
            state.sequenceList = state.playList;
        }
    },

    [types.ADD_FAVORITE](state,song){
        addFavorite(song);
        state.favoriteMid =  getFavoriteMid();
    },

    [types.DELETE_FAVORITE](state,song){
        deleteFavorite(song);
        state.favoriteMid = getFavoriteMid();
    },

    [types.REFRESH_FAVORITE](state){
        state.favoriteMid = getFavoriteMid();
    },

    [types.REFRESH_MYALBUM](state){
        state.myAlbum = getMyAlbum();
    },

    [types.REFRESH_COLLECTALBUM](state){
        state.collectAlbum = getCollectAlbum();
    }


}


export default mutations