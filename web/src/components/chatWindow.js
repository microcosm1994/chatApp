import React, {Component} from 'react'
import {Button, Icon } from 'antd'
import {connect} from 'react-redux'
import {setTargetInfo, setChatWindow} from '../store/action'
import '../css/chatWindow.css'

class chatWindow extends Component{
    constructor (props) {
        super(props)
        this.state = {}
    }
    componentDidMount () {
        const {setChatWindow} = this.props
        setChatWindow(this.refs.chatWindow)
    }
    componentDidUpdate (prevProps, prevState) {
        if (this.props.socket) {
            this.recvMessage()
        }
    }
    drag (e) {
        let self = this
        let flag = true
        let clientX = e.clientX - this.refs.chatWindow.offsetLeft
        let clientY = e.clientY - this.refs.chatWindow.offsetTop
        document.onmousemove = (event) => {
            if (!flag) return false
            let domX = event.clientX
            let domY = event.clientY
            let flowTop = domY - clientY
            let flowLeft = domX - clientX
            let windowWidth = document.documentElement.clientWidth
            let windowHeight = document.documentElement.clientHeight
            // 左侧边界
            if (flowLeft < -600) {
                flowLeft = -600
            }
            // 右侧边界
            if ((windowWidth - flowLeft) < 100) {
                flowLeft = windowWidth - 100
            }
            // 上方边界
            if (flowTop < 0) {
                flowTop = 0
            }
            // 下方边界
            if ((windowHeight - flowTop) < 50) {
                flowTop = windowHeight - 50
            }
            self.refs.chatWindow.style.top = flowTop + 'px'
            self.refs.chatWindow.style.left = flowLeft + 'px'
            event.target.onmouseup = (e) => {
                flag = false
            }
        }
        document.onmouseup = (e) => {
            flag = false
        }
    }
    // 关闭聊天窗口
    close () {
        this.refs.chatWindow.style.display = 'none'
    }
    // 发送消息
    sendMessage () {
        const {socket, user, targetInfo} = this.props
        let value = this.refs.chatWindowReply.innerHTML
        if (value) {
            socket.emit('CHAT_SEND', {
                user,
                targetInfo,
                sid: socket.id
            }, value)
        }
    }
    // 接收消息
    recvMessage () {
        const {socket, user, targetInfo} = this.props
        socket.on('CHAT_RES', res => {
            console.log(res);
        })
    }
    render () {
        return(
            <div className='chatWindow' ref='chatWindow'>
                <div className='chatWindow-header' onMouseDown={this.drag.bind(this)}>
                    <div className='chatWindow-header-name'>
                        {this.props.targetInfo.nickname}
                    </div>
                    <div className='chatWindow-header-close' onClick={this.close.bind(this)}>
                        <Icon type="close" />
                    </div>
                </div>
                <div className='chatWindow-body'>
                    <div className='chatWindow-body-chat'>

                    </div>
                    <div className='chatWindow-body-toolbar'>

                    </div>
                    <div className='chatWindow-body-reply' contentEditable='true' ref='chatWindowReply'></div>
                    <div className='chatWindow-body-btnBox'>
                        <Button size='small' type="primary" onClick={this.sendMessage.bind(this)}>发送</Button>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps (state, ownProps) {
    return {
        user: state.user,
        socket: state.socket,
        targetInfo: state.targetInfo,
        chatWindow: state.chatWindow
    }
}
function mapDispatchToProps (dispatch, ownProps) {
    return {
        setTargetInfo (data) {
            dispatch(setTargetInfo(data))
        },
        setChatWindow (data) {
            dispatch(setChatWindow(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(chatWindow)
