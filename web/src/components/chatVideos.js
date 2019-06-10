import React, {Component} from 'react'
import '../css/chatVideos.css'
import {setCandidate, setOffer} from "../store/action";
import connect from "react-redux/es/connect/connect";

class chatVideos extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sendpeer: null,
            recvpeer: null,
            localStream: null,
            askCandidate: null,
            askOffer: null,
            answerCandidate: null,
            answerOffer: null,
        }
    }

    componentDidMount() {
        // 把当前子组件传递给父组件
        this.props.onRef('chatVideo', this)
        // 获取媒体流
        this.getUserMedia()
        // 监听ASK信息
        if (this.props.ASK) {
            this.onASK(this.props.ASK)
        }
        // 监听Answer信息
        if (this.props.socket) {
            this.onAnswer(this.props.socket)
        }
    }

    componentWillReceiveProps(nextProps) {}

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
            this.ceeatePeerConnection(stream)
        })
            .catch(function (err) {
                /* 处理error */
            });
    }

    // 创建视频流发送方
    ceeatePeerConnection(stream) {
        let PeerConnection = window.RTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection;
        let sendPc = new RTCPeerConnection()
        let recvPc = new RTCPeerConnection()
        sendPc.addStream(stream)
        // 创建信令
        sendPc.onicecandidate = (e) => {
            if (e.candidate) {
                // 保存信令
                this.setState({
                    askCandidate: e.candidate
                })
            }
        }
        // 监听从对方过来的媒体流
        recvPc.onaddstream = (e) => {
            console.log(e.stream);
            let tVideo = this.refs.tVideo
            // tVideo.srcObject = e.stream
            tVideo.src = window.URL.createObjectURL(e.stream)
        }
        sendPc.createOffer().then(offer => {
            // 保存offer
            this.setState({
                askOffer: offer
            })
            sendPc.setLocalDescription(offer)
        })
        // 保存发送者实例
        this.setState({
            sendpeer: sendPc,
            recvpeer: recvPc
        })
    }

    // 等待ASK
    onASK(ASK) {
        let {sendpeer, recvpeer} = this.state
        if (sendpeer && recvpeer) {
            this.recvAsk()
            recvpeer.setRemoteDescription(ASK.offer)
            recvpeer.addIceCandidate(ASK.candidate)
            recvpeer.onicecandidate = (e) => {
                if (e.candidate) {
                    // 保存answer
                    this.setState({
                        answerCandidate: e.candidate
                    })
                }
            }
            recvpeer.createAnswer().then(res => {
                recvpeer.setLocalDescription(res)
                // 保存answer
                this.setState({
                    answerOffer: res
                })
            })
            this.sendAnswer()
        } else {
            setTimeout(() => {
                this.onASK(ASK)
            }, 300)
        }
    }

    // 等待ASK
    onRecvASK(socket) {
        // 监听socket消息，获取Answer
        socket.on('CHATVIDEO_RECV_ASK_RES', res => {
            let {recvpeer} = this.state
            if (res.status === 200) {
                recvpeer.setRemoteDescription(res.data.data.offer)
                recvpeer.addIceCandidate(res.data.data.candidate)
                recvpeer.onicecandidate = (e) => {
                    if (e.candidate) {
                        // 保存answer
                        this.setState({
                            answerCandidate: e.candidate
                        })
                    }
                }
                recvpeer.createAnswer().then(res => {
                    recvpeer.setLocalDescription(res)
                    // 保存answer
                    this.setState({
                        answerOffer: res
                    })
                })
                this.recvAnswer()
            }
        })
    }

    // 等待Answer
    onAnswer(socket) {
        // 监听socket消息，获取Answer
        socket.on('CHATVIDEO_ANSWER_RES', res => {
            let {sendpeer} = this.state
            if (res.status === 200) {
                sendpeer.setRemoteDescription(res.data.data.answer)
                sendpeer.addIceCandidate(res.data.data.candidate)
            }
        })
    }

    // 等待Answer
    onRecvAnswer(socket) {
        // 监听socket消息，获取Answer
        socket.on('CHATVIDEO_RECV_ANSWER_RES', res => {
            let {sendpeer} = this.state
            if (res.status === 200) {
                sendpeer.setRemoteDescription(res.data.data.answer)
                sendpeer.addIceCandidate(res.data.data.candidate)
            }
        })
    }

    // 发送信令
    sendAsk() {
        const {socket, targetInfo, user} = this.props
        let ask = {
            candidate: this.state.askCandidate,
            offer: this.state.askOffer,
        }
        if (ask.candidate && ask.offer) {
            socket.emit('CHATVIDEO_ASK', {
                userid: user.uid, // 目标用户id
                targetid: targetInfo.id, // 目标用户id
                sid: socket.id // socketid
            }, ask)
            this.onRecvASK(socket)
        } else {
            setTimeout(() => {
                this.sendAsk()
            }, 300)
        }
    }

    // 发送信令
    recvAsk() {
        const {socket, targetInfo, user} = this.props
        let ask = {
            candidate: this.state.askCandidate,
            offer: this.state.askOffer,
        }
        if (ask.candidate && ask.offer) {
            socket.emit('CHATVIDEO_RECV_ASK', {
                userid: user.uid, // 目标用户id
                targetid: targetInfo.id, // 目标用户id
                sid: socket.id // socketid
            }, ask)
        } else {
            setTimeout(() => {
                this.sendAsk()
            }, 300)
        }
    }

    // 发送应答
    sendAnswer() {
        const {socket, targetInfo, user} = this.props
        let answer = {
            answer: this.state.answerOffer,
            candidate: this.state.answerCandidate
        }
        if (answer.candidate && answer.answer) {
            this.onRecvAnswer(socket)
            socket.emit('CHATVIDEO_ANSWER', {
                userid: user.uid, // 目标用户id
                targetid: targetInfo.id, // 目标用户id
                sid: socket.id // socketid
            }, answer)
        } else {
            setTimeout(() => {
                this.sendAnswer()
            }, 300)
        }
    }

    // 发送应答
    recvAnswer() {
        const {socket, targetInfo, user} = this.props
        let answer = {
            answer: this.state.answerOffer,
            candidate: this.state.answerCandidate
        }
        if (answer.candidate && answer.answer) {
            socket.emit('CHATVIDEO_RECV_ANSWER', {
                userid: user.uid, // 目标用户id
                targetid: targetInfo.id, // 目标用户id
                sid: socket.id // socketid
            }, answer)
        } else {
            setTimeout(() => {
                this.recvAnswer()
            }, 300)
        }
    }

    render() {
        return (
            <div className='chatVideos'>
                <div className='chatVideos-t'>
                    <div className='chatVideos-t-video'>
                        <video autoPlay controls ref='tVideo'></video>
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
