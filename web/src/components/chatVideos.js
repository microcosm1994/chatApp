import React, {Component} from 'react'
import '../css/chatVideos.css'
import {setCandidate, setOffer} from "../store/action";
import connect from "react-redux/es/connect/connect";

let sendPc = null
let recvPc = null

class chatVideos extends Component {
    constructor(props) {
        super(props)
        this.state = {
            localStream: null
        }
    }

    componentDidMount() {
        // 把当前子组件传递给父组件
        this.props.onRef('chatVideo', this)
        // 获取媒体流
        this.getUserMedia()
        // 监听Answer信息
        if (this.props.socket) {
            this.onIce(this.props.socket)
            this.onOffer(this.props.socket)
            this.onAnswer(this.props.socket)
            this.onClose(this.props.socket)
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    // 获取流媒体
    getUserMedia() {
        let bvideo = this.refs.bVideo
        let constraints = {
            audio: true,
            video: true
        }
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            /* 使用这个stream stream */
            bvideo.src = window.URL.createObjectURL(stream)
            // 保存视频流
            this.setState({localStream: stream})
            // 创建视频流发送方
            this.createPeerConnection(stream)
        }).catch(function (err) {
            /* 处理error */
        })
    }

    // 创建视频流发送方
    createPeerConnection(stream) {
        sendPc = new RTCPeerConnection()
        recvPc = new RTCPeerConnection()
        stream.getTracks().forEach(item => {
            sendPc.addTrack(item, stream)
        })
        let sendChannel = sendPc.createDataChannel('msg', {})
        sendChannel.onopen = function (e) {
            sendChannel.send('sendChannel_recv')
        }
        sendChannel.onmessage = function (e) {
            console.log(e);
        }
        // 创建信令
        sendPc.onicecandidate = (e) => {
            if (e.candidate) {
                this.sendIce('send', e.candidate)
            }
        }
        // 监听从对方过来的媒体流
        recvPc.onaddstream = (e) => {
            if (e.stream) {
                let tVideo = this.refs.tVideo
                tVideo.srcObject = e.stream
            }
        }
        // 创建offer
        sendPc.createOffer().then(offer => {
            sendPc.setLocalDescription(offer).then(() => {
                this.sendOffer('send', offer)
            })
        })
    }

    // 创建offer
    createAns(res) {
        if (recvPc) {
            if (res.data.type === 'send') {
                recvPc.onicecandidate = (e) => {
                    if (e.candidate) {
                        this.sendIce('recv', e.candidate)
                    }
                }
            }
            recvPc.setRemoteDescription(res.data.data).then(() => {
                recvPc.createAnswer().then(answer => {
                    recvPc.setLocalDescription(answer)
                    this.sendAnswer(answer)
                })
            })
            recvPc.ondatachannel = function (e) {
                let sendChannel = e.channel
                sendChannel.onmessage = (e) => {
                    console.log(e.data);
                }
            }
        } else {
            setTimeout(() => {
                this.createAns(res)
            }, 300)
        }
    }

    // 等待ICE
    onIce(socket) {
        // 监听socket消息，获取Answer
        if (recvPc && sendPc) {
            socket.on('CHATVIDEO_ICE', res => {
                if (res.status === 200) {
                    if (res.data.type === 'send') {
                        recvPc.addIceCandidate(res.data.data)
                    }
                    if (res.data.type === 'recv') {
                        sendPc.addIceCandidate(res.data.data)
                    }
                }
            })
        } else {
            setTimeout(() => {
                this.onIce(socket)
            }, 300)
        }
    }

    // 等待ASK
    onOffer(socket) {
        // 监听socket消息，获取Answer
        socket.on('CHATVIDEO_OFFER', res => {
            if (res.status === 200) {
                this.createAns(res)
            }
        })
    }

    // 等待Answer
    onAnswer(socket) {
        // 监听socket消息，获取Answer
        socket.on('CHATVIDEO_ANSWER', res => {
            if (res.status === 200) {
                sendPc.setRemoteDescription(res.data.data)
            }
        })
    }

    // 发送ICE
    sendIce(type, data) {
        const {socket, targetInfo, user} = this.props
        if (data) {
            socket.emit('CHATVIDEO_ICE', {
                userid: user.uid, // 目标用户id
                targetid: targetInfo.id, // 目标用户id
                type: type // 发送方or接收方
            }, data)
        } else {
            setTimeout(() => {
                this.sendIce(type, data)
            }, 300)
        }
    }

    // 发送信令
    sendOffer(type, data) {
        const {socket, targetInfo, user} = this.props
        if (data) {
            socket.emit('CHATVIDEO_OFFER', {
                userid: user.uid, // 目标用户id
                targetid: targetInfo.id, // 目标用户id
                type: type // 发送方or接收方
            }, data)
        } else {
            setTimeout(() => {
                this.sendOffer(type, data)
            }, 300)
        }
    }

    // 发送应答
    sendAnswer(data) {
        const {socket, targetInfo, user} = this.props
        if (data) {
            socket.emit('CHATVIDEO_ANSWER', {
                userid: user.uid, // 目标用户id
                targetid: targetInfo.id, // 目标用户id
            }, data)
        } else {
            setTimeout(() => {
                this.sendAnswer(data)
            }, 300)
        }
    }

    // 关闭视频聊天
    close(type) {
        let {socket, user, targetInfo} = this.props
        if (type === 'send') {
            // 给对方发送关闭信息
            socket.emit('CHATVIDEO_CLOSE', {
                userid: user.uid, // 目标用户id
                targetid: targetInfo.id // 目标用户id
            })
        }
        if (sendPc && recvPc) {
            sendPc.close()
            recvPc.close()
        }
        sendPc = null
        recvPc = null
        // 删除全部信息
        this.setState({
            localStream: null
        })
        // 清除socket监听
        socket.removeListener('CHATVIDEO_ICE')
        socket.removeListener('CHATVIDEO_OFFER')
        socket.removeListener('CHATVIDEO_ANSWER')
        this.props.chatWindow.setState({
            isRender: {
                chatVideo: false
            }
        })
        this.props.chatWindow.chatVideo = null
    }

    onClose(socket) {
        socket.on('CHATVIDEO_CLOSE', res => {
            if (res.status === 200) {
                this.close('recv')
            }
        })
    }

    render() {
        return (
            <div className='chatVideos'>
                <div className='chatVideos-t'>
                    <div className='chatVideos-t-video'>
                        <video autoPlay ref='tVideo'></video>
                    </div>
                </div>
                <div className='chatVideos-b'>
                    <div className='chatVideos-b-info'>

                    </div>
                    <div className='chatVideos-b-video'>
                        <video autoPlay ref='bVideo'></video>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        user: state.user,
        targetInfo: state.targetInfo,
        socket: state.socket,
        ASK: state.ASK,
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        setCandidate(data) {
            dispatch(setCandidate(data))
        },
        setOffer(data) {
            dispatch(setOffer(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(chatVideos)
