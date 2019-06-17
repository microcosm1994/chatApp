import React, {Component} from 'react'
import ReactDom from 'react-dom'
import {Button, Icon, Avatar, message} from 'antd'
import {connect} from 'react-redux'
import {setTargetInfo, setChatWindow} from '../store/action'
import store from '../store/index'
import {$axios} from '../lib/interceptors'
import ChatVideos from './chatVideos'
import '../css/chatWindow.css'

class chatWindow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRender: {
                chatVideo: false
            },
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
        // 把子组件实例传给父组件
        this.props.onRef('chatWindow', this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.targetInfo.id) {
            this.get(nextProps)
        }
    }

    // 获取聊天数据
    get(props) {
        const {user, targetInfo} = props
        if (user.uid && targetInfo.id) {
            let form = {}
            form.userid = user.uid
            form.targetid = targetInfo.id
            $axios.post('/api/msgrecord/get', form).then(res => {
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
        // 销毁聊天窗口之前先修改目前（当前聊天好友）所有未读消息为已读
        const {socket, targetInfo} = this.props
        if (targetInfo.id) {
            $axios.post('/api/msgrecord/setRead', {targetid: targetInfo.id})
            // 如果视频聊天子组件已经渲染，就销毁
            if (this.chatVideo) {
                this.closeChatVideo()
            }
            this.refs.chatWindow.style.display = 'none'
            this.props.destroy(false)
        }
    }

    // 发送消息
    sendMessage() {
        const {socket, user, targetInfo} = this.props
        let value = this.refs.chatWindowReply.innerHTML
        if (value) {
            // 字符串转dom对象，方便后续操作
            let parser = new DOMParser()
            let doc = parser.parseFromString(value, 'text/html')
            // 获取当前dom中的所有文件
            let fileList = doc.getElementsByTagName('img')
            if (fileList.length > 0) {
                // 如果消息中夹杂着文件，需要逐条发送消息
                let container = doc.getElementsByClassName('reply-content')[0]
                while (fileList.length > 0) {
                    let tmpNode = document.createElement('div')
                    // 深拷贝当前要发送的dom对象
                    let d = fileList[0].cloneNode(true)
                    // dom对象转字符串
                    tmpNode.appendChild(d)
                    socket.emit('CHAT_SEND', {
                        userid: user.uid, // 目标用户id
                        targetid: targetInfo.id, // 目标用户id
                        sid: socket.id // socketid
                    }, tmpNode.innerHTML)
                    // 移除当前已经发送的dom对象
                    container.removeChild(fileList[0])
                    // 更新视图
                    this.updateView({
                        createtime: Date.now().toLocaleString(),
                        userid: user.uid,
                        targetid: targetInfo.id,
                        content: tmpNode.innerHTML
                    })
                }
                // 发送文字
                socket.emit('CHAT_SEND', {
                    userid: user.uid, // 目标用户id
                    targetid: targetInfo.id, // 目标用户id
                    sid: socket.id // socketid
                }, container.innerHTML)
                // 更新视图
                this.updateView({
                    createtime: Date.now().toLocaleString(),
                    userid: user.uid,
                    targetid: targetInfo.id,
                    content: container.innerHTML
                })
            } else {
                // 如果没有文件，则直接发送
                socket.emit('CHAT_SEND', {
                    userid: user.uid, // 目标用户id
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
            this.refs.chatWindowReply.innerHTML = ''
        }
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

    // 获取聊天窗口子组件
    onRef(name, ref) {
        switch (name) {
            case 'chatVideo':
                this.chatVideo = ref
                break
            default:
                break
        }
    }

    // 视频聊天
    openVideo() {
        // 先发送视频请求，等待对方同意后进行连接
        const {socket, user, targetInfo} = this.props
        socket.emit('CHATVIDEO_REQ', {
            userid: user.uid, // 用户id
            targetid: targetInfo.id, // 目标用户id
            sid: socket.id // socketid
        })
        // 渲染聊天窗口子组件，开始等待回复
        this.setState({
            isRender: {
                chatVideo: true
            }
        })
        // 开始监听对方回复
        this.onVideo()
    }

    // 监听视频聊天回应
    onVideo() {
        const {socket} = this.props
        socket.on('CHATVIDEO_RES', res => {
            // 同意后开始调用子组件方法开始进行信息交换
            if (res.status === 200) {
                switch (res.data.data) {
                    case 'ok':
                        // 对方同意视频，那就调用子组件发送ASK信息
                        this.startChatVideo()
                        break
                    case 'cancel':
                        message.info('对方拒绝了你的视频聊天请求')
                        // 对方不同意视频，那就销毁视频聊天子组件
                        this.closeChatVideo()
                        break
                }
            }
        })
    }

    startChatVideo() {
        if (this.chatVideo) {
            this.chatVideo.createPeerConnection()
        } else {
            setTimeout(() => {
                this.startChatVideo()
            }, 100)
        }
    }

    // 销毁视频聊天子组件
    closeChatVideo() {
        let {socket} = this.props
        // 关闭视频聊天
        this.chatVideo.close('send')
        socket.removeListener('CHATVIDEO_RES')
        this.setState({
            isRender: {
                chatVideo: false
            }
        })
    }

    // 拖放事件
    dropHandler(e) {
        e.preventDefault()
        let fileList = e.dataTransfer.files
        if (fileList.length > 0) {
            let formData = new FormData()
            formData.set('length', fileList.length)
            for (let i = 0; i < fileList.length; i++) {
                formData.append('attachment', fileList[i])
            }
            $axios.post('/api/file/save', formData).then(res => {
                if (res.status === 200) {
                    this.createImg(res.data.data)
                }
            })
        }
    }

    // 拖放事件,获取放置的文件
    dragoverHandler(e) {
        e.preventDefault()
    }

    // 生成img图片DOM
    createImg(data) {
        let img = ''
        data.forEach(item => {
            img += '<img data-path="'+ item.path +'" src="'+ item.cover + '" style="width:100px" alt=""/>'
        })
        let container = this.refs.chatWindowReply
        let html = <div className='reply-content' dangerouslySetInnerHTML={{__html: container.innerHTML + '' + img}}></div>
        ReactDom.render(html, container)
    }

    // 读取文件
    readFile(file) {
        let read = new FileReader()
        read.onload = (ev) => {
            if (read.readyState === 2) {
                if (file.type === 'image/jpeg') {
                    this.createImg(read.result)
                }
            }
        }
        read.readAsDataURL(file)
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
                        <ul>
                            <li>
                                <Icon type="meh"/>
                            </li>
                            <li>
                                <Icon type="folder"/>
                            </li>
                            <li>
                                <Icon type="scissor"/>
                            </li>
                            <li>
                                <Icon type="message"/>
                            </li>
                            <li>
                                <Icon type="phone"/>
                            </li>
                            <li onClick={this.openVideo.bind(this)}>
                                <Icon type="video-camera"/>
                            </li>
                        </ul>
                    </div>
                    <div className='chatWindow-body-reply' contentEditable='true' ref='chatWindowReply'
                         onDrop={this.dropHandler.bind(this)} onDragOver={this.dragoverHandler.bind(this)}></div>
                    <div className='chatWindow-body-btnBox'>
                        <Button size='small' type="primary" onClick={this.sendMessage.bind(this)}>发送</Button>
                    </div>
                </div>
                <div className='chatWindow-video'>
                    {/* this.state.isRender.chatVideo ? <ChatVideos1/> : null*/}
                    {
                        this.state.isRender.chatVideo ? <ChatVideos
                            onRef={this.onRef.bind(this)}
                            chatWindow={this}
                        /> : null
                    }
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
