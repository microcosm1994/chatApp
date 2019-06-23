import React, {Component} from 'react'
import '../css/chatVideos.css'
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
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function(constraints) {
                // 首先，如果有getUserMedia的话，就获得它
                let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }

                // 否则，为老的navigator.getUserMedia方法包裹一个Promise
                return new Promise(function(resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            }
        }
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            /* 使用这个stream stream */
            bvideo.srcObject = stream
            // 保存视频流
            this.setState({localStream: stream})
        }).catch(function (err) {
            console.log(err);
            /* 处理error */
        })
    }

    // 创建视频连接实例
    createPeerConnection() {
        let stream = this.state.localStream
        if (stream) {
            let PeerConnection = window.RTCPeerConnection ||
                window.mozRTCPeerConnection ||
                window.webkitRTCPeerConnection
            sendPc = new PeerConnection()
            recvPc = new PeerConnection()
            stream.getTracks().forEach(item => {
                sendPc.addTrack(item, stream)
            })
            // 创建数据通道
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
        } else {
            setTimeout(() => {
                this.createPeerConnection()
            }, 100)
        }
    }

    // 创建offer
    createAns(res) {
        if (recvPc) {
            recvPc.setRemoteDescription(res.data.data).then(() => {
                if (res.data.type === 'send') {
                    recvPc.onicecandidate = (e) => {
                        if (e.candidate) {
                            this.sendIce('recv', e.candidate)
                        }
                    }
                }
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
            }, 100)
        }
    }

    // 等待ICE
    onIce(socket) {
        // 监听socket消息，获取Answer
        console.log(recvPc);
        console.log(sendPc);
        if (recvPc && sendPc) {
            socket.on('CHATVIDEO_ICE', res => {
                if (res.status === 200) {
                    if (res.data.type === 'send') {
                        recvPc.addIceCandidate(res.data.data)
                        console.log('send');
                    }
                    if (res.data.type === 'recv') {
                        sendPc.addIceCandidate(res.data.data)
                        console.log('recv');
                    }
                }
            })
        } else {
            setTimeout(() => {
                this.onIce(socket)
            }, 100)
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
        if (sendPc) {
            // 监听socket消息，获取Answer
            socket.on('CHATVIDEO_ANSWER', res => {
                if (res.status === 200) {
                    sendPc.setRemoteDescription(res.data.data)
                }
            })
        } else {
            setTimeout(() => {
                this.onAnswer(socket)
            }, 100)
        }
    }

    // 发送ICE
    sendIce(type, data) {
        const {socket, targetInfo, user} = this.props
        socket.emit('CHATVIDEO_ICE', {
            userid: user.uid, // 目标用户id
            targetid: targetInfo.id, // 目标用户id
            type: type // 发送方or接收方
        }, data)
    }

    // 发送信令
    sendOffer(type, data) {
        const {socket, targetInfo, user} = this.props
        socket.emit('CHATVIDEO_OFFER', {
            userid: user.uid, // 目标用户id
            targetid: targetInfo.id, // 目标用户id
            type: type // 发送方or接收方
        }, data)
    }

    // 发送应答
    sendAnswer(data) {
        const {socket, targetInfo, user} = this.props
        socket.emit('CHATVIDEO_ANSWER', {
            userid: user.uid, // 目标用户id
            targetid: targetInfo.id, // 目标用户id
        }, data)
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
        socket: state.socket
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(chatVideos)
