
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const playMode = state => state.playMode

export const currentIndex = state => state.currentIndex

export const currentSong = state => {return state.playList[state.currentIndex] || {}}

export const getPlayer = state =>  state.player

export const rankBar = state =>  state.rankBar

export const searchHistory = state => state.searchHistory

export const myAlbum = state => state.myAlbum

export const favoriteMid = state => state.favoriteMid

export const collectAlbum = state => state.collectAlbum