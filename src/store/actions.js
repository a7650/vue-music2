import * as types from './mutation-types'

export const selectSong = ({ commit, state }, { list, index }) => {
   commit(types.SET_SEQUENCELIST, list)
   commit(types.SET_CURRENTINDEX, index)
   commit(types.SET_PLAYLIST, list)
   commit(types.SET_FULLSCREEN, true)
   commit(types.SET_PLAYING, true)
}

export const deleteSong = ({ commit }, index) => {
   commit(types.DELETE_PLAYLIST, index)
}

export const selectSearchSong = ({ commit, state }, song) => {
   var r = commit(types.ADD_SONG, song)
}