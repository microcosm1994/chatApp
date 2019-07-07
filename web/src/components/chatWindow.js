import React, {Component} from 'react'
import {Button, Icon, Avatar, message, Popover} from 'antd'
import {connect} from 'react-redux'
import {setTargetInfo, setChatWindow} from '../store/action'
import store from '../store/index'
import {$axios} from '../lib/interceptors'
import ChatVideos from './chatVideos'
import Emoji from './emoji'
import '../css/chatWindow.css'
import '../css/emoji.css'

class chatWindow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRender: {
                chatVideo: false
            },
            msgContent: [],
            msgPage: {
                offset: 0,
                limit: 5
            },
            visible: false,
            range: null
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
            this.get(nextProps, this.state.msgPage.offset, this.state.msgPage.limit)
        }
    }

    // 获取聊天数据
    get(props, offset, limit) {
        const {user, targetInfo} = props
        console.log(user);
        if (user.uid && targetInfo.id) {
            let form = {}
            form.userid = user.uid
            form.targetid = targetInfo.id
            form.offset = offset
            form.limit = limit
            $axios.post('/api/msgrecord/get', form).then(res => {
                if (res.status === 200) {
                    this.setState({
                        msgPage: {
                            offset: offset,
                            limit: limit
                        }
                    })
                    this.updateView(res.data)
                }
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
        // 获取消息数据的id
        let msgId = 1
        if (this.state.msgContent.length) {
            msgId = this.state.msgContent[this.state.msgContent.length - 1].id + 1
        }
        if (value) {
            // 字符串转dom对象，方便后续操作
            let parser = new DOMParser()
            let doc = parser.parseFromString(value, 'text/html')
            // 获取当前dom中的所有文件
            let fileList = doc.getElementsByClassName('chat-file')
            if (fileList.length > 0) {
                // 如果消息中夹杂着文件，需要逐条发送消息
                let container = doc.getElementsByClassName('reply-content')[0]
                let nodeList = container.childNodes
                for (let i = 0; i < nodeList.length; i++) {
                    msgId += i
                    switch (nodeList[i].nodeName) {
                        case 'A':
                            // 创建一个元素
                            let fileNode = document.createElement('div')
                            // 深拷贝当前要发送的dom对象
                            let fileDeepNode = nodeList[i].cloneNode(true)
                            // dom对象转字符串
                            fileNode.appendChild(fileDeepNode)
                            // 发送文件
                            socket.emit('CHAT_SEND', {
                                userid: user.uid, // 目标用户id
                                targetid: targetInfo.id, // 目标用户id
                                type: 'file', // 目标用户id
                                sid: socket.id // socketid
                            }, fileNode.innerHTML)
                            // 更新视图
                            this.updateView({
                                createtime: Date.now().toLocaleString(),
                                userid: user.uid,
                                targetid: targetInfo.id,
                                content: fileNode.innerHTML,
                                type: 'file',
                                id: msgId
                            })
                            break
                        case '#text':
                            socket.emit('CHAT_SEND', {
                                userid: user.uid, // 目标用户id
                                targetid: targetInfo.id, // 目标用户id
                                type: 'message', // 目标用户id
                                sid: socket.id // socketid
                            }, nodeList[i].nodeValue)
                            // 更新视图
                            this.updateView({
                                createtime: Date.now().toLocaleString(),
                                userid: user.uid,
                                targetid: targetInfo.id,
                                content: nodeList[i].nodeValue,
                                type: 'message',
                                id: msgId
                            })
                            break
                        case 'DIV':
                            let divNode = document.createElement('div')
                            let divDeepNode = nodeList[i].cloneNode(true)
                            divNode.appendChild(divDeepNode)
                            socket.emit('CHAT_SEND', {
                                userid: user.uid, // 目标用户id
                                targetid: targetInfo.id, // 目标用户id
                                type: 'message', // 目标用户id
                                sid: socket.id // socketid
                            }, divNode.innerHTML)
                            // 更新视图
                            this.updateView({
                                createtime: Date.now().toLocaleString(),
                                userid: user.uid,
                                targetid: targetInfo.id,
                                content: divNode.innerHTML,
                                type: 'message',
                                id: msgId
                            })
                            break
                    }
                }
            } else {
                // 如果没有文件，则直接发送
                socket.emit('CHAT_SEND', {
                    userid: user.uid, // 目标用户id
                    targetid: targetInfo.id, // 目标用户id
                    type: 'message', // 目标用户id
                    sid: socket.id // socketid
                }, value)
                // 更新视图
                this.updateView({
                    createtime: Date.now().toLocaleString(),
                    userid: user.uid,
                    targetid: targetInfo.id,
                    type: 'message',
                    content: value,
                    id: msgId
                })
            }
            this.refs.chatWindowReply.innerHTML = ''
        }
    }

    // 更新页面视图
    updateView(data) {
        let type = Object.prototype.toString.call(data)
        let lastId = null
        switch (type) {
            case '[object Array]':
                if (!data.length) break
                this.state.msgContent = [...data, ...this.state.msgContent]
                lastId = data[data.length - 1].id
                break
            default:
                this.state.msgContent.push(data)
                lastId = data.id
                break
        }
        // 更新视图
        this.setState({
            msgContent: this.state.msgContent
        })
        // 使用id找到最后一条消息的位置，让滚动条定位到这个位置
        let lastMsgDom = document.getElementById(lastId)
        let top = this.refs.msgContent.scrollHeight
        if (lastMsgDom) {
            top = lastMsgDom.offsetTop
        }
        // 聊天界面滚动条一直保持在底部
        this.refs.msgContent.scrollTop = top
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

    // 开始视频聊天
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
                // console.log(fileList[i].name.indexOf(' '))
                // console.log(/\s/.test(fileList[i].name))
                // 检测文件名有没有空格
                if (fileList[i].name.indexOf(' ') > -1) {
                    message.error(fileList[i].name + '文件名称不能包含空格。')
                    return false
                }
                if (fileList[i].size / 1024 < 5000) {
                    formData.append('attachment', fileList[i])
                } else {
                    message.error(fileList[i].name + '超过5M，无法发送文件。')
                }
            }
            if (formData.getAll('attachment').length > 0) {
                $axios.post('/api/file/save', formData).then(res => {
                    if (res.status === 200) {
                        this.createImg(res.data.data)
                    }
                })
            }
        }
    }

    // 拖放事件,获取放置的文件
    dragoverHandler(e) {
        e.preventDefault()
    }

    // 生成img图片DOM
    createImg(data) {
        let fileHtml = ''
        data.forEach(item => {
            if (item.type === 'image/jpeg') {
                fileHtml += '<a href="' + item.path + '" download="'+ item.name +'" target="_blank"  contentEditable="false"><span class="chat-file"><img class="chat-img" src="'+ item.cover + '" alt=""/></span></a>'
            } else {
                fileHtml += '<a href="' + item.path + '" download="'+ item.name +'" target="_blank" contentEditable="false"><span class="chat-file"><span class="chat-file-name">' + item.name + '</span><img class="chat-file-img" src="'+ item.cover + '" alt=""/></span></a>'
            }
        })
        let container = this.refs.chatWindowReply
        if (container.children.length > 0) {
            if (container.children[0].className === 'reply-content') {
                container.innerHTML = container.children[0].innerHTML
            }
        }
        let html = `<span class="reply-content">${container.innerHTML}${fileHtml}</span>`
        container.innerHTML = html
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

    // 监听键盘事件
    keyDown (e) {
        switch (e.keyCode) {
            case 13:
                e.preventDefault()
                this.sendMessage()
                break
            default:
                break
        }
    }

    // 监听页面滚动，获取历史聊天记录
    chatRecord (e) {
        if (!e.target.scrollTop) {
            this.get(this.props, this.state.msgPage.offset + this.state.msgPage.limit, this.state.msgPage.limit)
        }
    }

    // 表情
    handleVisibleChange = visible => {
        this.setState({ visible });
    }

    hide () {
        this.setState({visible: false})
    }

    // 获取光标位置
    getPosition () {
        let selection = window.getSelection()
        let range = selection.getRangeAt(0)
        this.setState({
            range: range
        })
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
                        <div className='chatWindow-body-chat' ref='msgContent' onScroll={this.chatRecord.bind(this)}>
                            <MsgContent uid={uid} data={this.state.msgContent}/>
                        </div>
                    </div>
                    <div className='chatWindow-body-toolbar'>
                        <ul>
                            <li>
                                <Popover
                                    content={this.state.visible ? <Emoji input={this.refs.chatWindowReply} range={this.state.range}></Emoji> : null}
                                    trigger="click"
                                    visible={this.state.visible}
                                    onVisibleChange={this.handleVisibleChange}
                                >
                                    <Icon type="meh"/>
                                </Popover>
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
                         onDrop={this.dropHandler.bind(this)} onDragOver={this.dragoverHandler.bind(this)} onKeyDown={this.keyDown.bind(this)} onBlur={this.getPosition.bind(this)}></div>
                    <div className='chatWindow-body-btnBox'>
                        <Button size='small' type="primary" onClick={this.sendMessage.bind(this)}>发送</Button>
                    </div>
                </div>
                <div className='chatWindow-video'>
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
        return (<div id={item.id} className='msgContent' key={index}>
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
                    <div className={item.type === 'message' ? 'msgContent-container-content-box' : 'msgContent-container-file-box'}
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
