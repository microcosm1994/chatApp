// 工具函数，用于组织多个reducer，并返回reducer集合
import { combineReducers } from 'redux'
// 默认值
import defaultState from './state.js'

// 一个reducer就是一个函数
function user (state = defaultState.user, action) {
    switch (action.type) {
        case 'SET_USER':
            return action.data
        default:
            return state
    }
}
function targetInfo (state = defaultState.targetInfo, action) {
    switch (action.type) {
        case 'SET_TARGET_INFO':
            return action.data
        default:
            return state
    }
}
function socket (state = defaultState.socket, action) {
    switch (action.type) {
        case 'SET_SOCKET':
            return action.data
        default:
            return state
    }
}
function chatWindow (state = defaultState.chatWindow, action) {
    switch (action.type) {
        case 'SET_CHAT_WINDOW':
            return action.data
        default:
            return state
    }
}
function ASK (state = defaultState.ASK, action) {
    switch (action.type) {
        case 'SET_ASK':
            return action.data
        default:
            return state
    }
}
function candidate (state = defaultState.candidate, action) {
    switch (action.type) {
        case 'SET_CANDIDATE':
            return action.data
        default:
            return state
    }
}
function offer (state = defaultState.offer, action) {
    switch (action.type) {
        case 'SET_OFFER':
            return action.data
        default:
            return state
    }
}
function answer (state = defaultState.answer, action) {
    switch (action.type) {
        case 'SET_ANSWER':
            return action.data
        default:
            return state
    }
}

function infoList (state = defaultState.infoList, action) {
    switch (action.type) {
        case 'SET_INFO_LIST':
            return action.data
        default:
            return state
    }
}

// 导出所有reducer
export default combineReducers({
    user,
    targetInfo,
    socket,
    chatWindow,
    ASK,
    candidate,
    offer,
    answer,
    infoList
})
