import React, {Component} from 'react'
import {Button, Icon, Avatar} from 'antd'
import {connect} from 'react-redux'
import {setTargetInfo, setChatWindow} from '../store/action'
import store from '../store/index'
import {$axios} from '../lib/interceptors'
import '../css/chatWindow.css'

class chatWindow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            msgContent: []
        }
        // 监听state状态改变
        store.subscribe(() => {
            // state状态改变了，新状态如下
            const state = store.getState()
            if (state.targetInfo.id) {
                // this.get()
            }
        })
    }

    componentDidMount() {
        const {setChatWindow} = this.props
        setChatWindow(this.refs.chatWindow)
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (nextProps.targetInfo.id) {
            this.get(nextProps)
        }
        if (nextProps.socket) {
            this.recvMessage(nextProps)
        }
    }

    componentWillUnmount() {
        console.log('close');
    }

    // 获取聊天数据
    get(props) {
        const {user, targetInfo} = props
        if (user.uid && targetInfo.id) {
            let form = {}
            form.userid = user.uid
            form.targetid = targetInfo.id
            $axios.post('/api/msgrecord/get', form).then(res => {
                console.log(res.data);
                this.updateView(res.data)
            })
        }
    }

    drag(e) {
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
    close() {
        this.refs.chatWindow.style.display = 'none'
    }

    // 发送消息
    sendMessage() {
        const {socket, user, targetInfo} = this.props
        let value = this.refs.chatWindowReply.innerHTML
        if (value) {
            socket.emit('CHAT_SEND', {
                userid: user.uid, // 当前用户id
                targetid: targetInfo.id, // 目标用户id
                sid: socket.id // socketid
            }, value)
            // 更新视图
            this.updateView({
                createtime: Date.now().toLocaleString(),
                userid: user.uid,
                targetid: targetInfo.id,
                content: value
            })
        }
    }

    // 接收消息
    recvMessage(props) {
        const {socket} = props
        socket.on('CHAT_RES', res => {
            if (res.status === 200) {
                this.updateView(res.data)
            }
        })
    }

    // 更新页面视图
    updateView(data) {
        let type = Object.prototype.toString.call(data)
        switch (type) {
            case '[object Array]':
                this.state.msgContent = data
                break
            default:
                this.state.msgContent.push(data)
                break
        }
        // 更新视图
        this.setState({
            msgContent: this.state.msgContent
        })
        // 聊天界面滚动条一直保持在底部
        this.refs.msgContent.scrollTop = this.refs.msgContent.scrollHeight
    }

    render() {
        const {uid} = this.props.user
        return (
            <div className='chatWindow' ref='chatWindow'>
                <div className='chatWindow-header' onMouseDown={this.drag.bind(this)}>
                    <div className='chatWindow-header-name'>
                        {this.props.targetInfo.nickname}
                    </div>
                    <div className='chatWindow-header-close' onClick={this.close.bind(this)}>
                        <Icon type="close"/>
                    </div>
                </div>
                <div className='chatWindow-body'>
                    <div className='chatWindow-body-chat-box'>
                        <div className='chatWindow-body-chat' ref='msgContent'>
                            <MsgContent uid={uid} data={this.state.msgContent}/>
                        </div>
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

// 聊天消息组件
function MsgContent(props) {
    let html = props.data.map((item, index) => {
        let direction = {
            float: 'left'
        }
        let contentName = 'direction-left'
        if (props.uid === item.userid) {
            direction.float = 'right'
            contentName = 'direction-right'
        }
        return (<div className='msgContent' key={index}>
            <div className='msgContent-time'>
                <span className='msgContent-time-span'>
                    {item.createtime}
                </span>
            </div>
            <div className={'msgContent-container ' + contentName} style={direction}>
                <div className='msgContent-container-avator'>
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                </div>
                <div className='msgContent-container-content'>
                    <div className='msgContent-container-content-box'
                         dangerouslySetInnerHTML={{__html: item.content}}></div>
                </div>
            </div>
        </div>)
    })
    return (<div>{html}</div>)
}

function mapStateToProps(state, ownProps) {
    return {
        user: state.user,
        socket: state.socket,
        targetInfo: state.targetInfo,
        chatWindow: state.chatWindow
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        setTargetInfo(data) {
            dispatch(setTargetInfo(data))
        },
        setChatWindow(data) {
            dispatch(setChatWindow(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(chatWindow)
