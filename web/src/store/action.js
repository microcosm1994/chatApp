// action也是函数
// user
export function setUser (data) {
    return (dispatch, getState) => {
        dispatch({ type: 'SET_USER', data: data })
    }
}
// 目标用户信息
export function setTargetInfo (data) {
    return (dispatch, getState) => {
        dispatch({ type: 'SET_TARGET_INFO', data: data })
    }
}
// Socket
export function setSocket (data) {
    return (dispatch, getState) => {
        dispatch({ type: 'SET_SOCKET', data: data })
    }
}
// 聊天窗口的dom对象
export function setChatWindow (data) {
    return (dispatch, getState) => {
        dispatch({ type: 'SET_CHAT_WINDOW', data: data })
    }
}
export function setInfoList (data) {
    return (dispatch, getState) => {
        // 使用fetch实现异步请求
        window.fetch('/api/getInfoList', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            let { code } = data
            if (code === 0) {
                dispatch({ type: 'SET_INFO_LIST', data: data })
            }
        })
    }
}
