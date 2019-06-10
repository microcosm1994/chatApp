import React, {Component} from 'react'
import '../css/chatVideos.css'

class chatVideos extends Component{
    constructor (props) {
        super(props)
        this.state = {
            sendpeer: null,
            recvpeer: null,
            localStream: null
        }
    }
    componentDidMount () {
        this.getUserMedia()
    }
    // 获取流媒体
    getUserMedia () {
        let constraints = {
            audio: true,
            video: true
        }
        let bvideo = this.refs.bVideo
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                /* 使用这个stream stream */
                bvideo.src = window.URL.createObjectURL(stream)
                this.setState({
                    localStream: stream
                })
                this.getPeerConnection()
            })
            .catch(function(err) {
                /* 处理error */
            });
    }
    getPeerConnection () {
        let pc = new RTCPeerConnection()
        let pc1 = new RTCPeerConnection()
        pc.addStream(this.state.localStream)
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                pc1.addIceCandidate(event.candidate)
            }
        }
        pc1.onaddstream = (event) => {
            let tvideo = this.refs.tVideo
            tvideo.src = window.URL.createObjectURL(event.stream)
        }
        pc1.onicecandidate = (event) => {
            if (event.candidate) {
                // pc.addIceCandidate(event.candidate)
            }
        }
        this.setState({
            sendpeer: pc,
            recvpeer: pc1
        })
        this.connect(pc)
    }
    connect (sendpeer) {
        try {
            sendpeer.createOffer().then(res => {
                this.onCreateOffer(res);
            })
        } catch (e) {
            console.log('createOffer: ', e);
        }
    }
    onCreateOffer (offer) {
        let {sendpeer, recvpeer} = this.state
        console.log(recvpeer);
        try {
            sendpeer.setLocalDescription(offer)
        } catch (e) {
            console.log('Offer-setLocalDescription: ', e);
        }
        try {
            recvpeer.setRemoteDescription(offer)
        } catch (e) {
            console.log('Offer-setRemoteDescription: ', e);
        }
        try {
            recvpeer.createAnswer().then(res => {
                this.onCreateAnswer(res);
            })
        } catch (e) {
            console.log('createAnswer: ', e);
        }
    }
    onCreateAnswer (answer) {
        let {sendpeer, recvpeer} = this.state
        try {
            recvpeer.setLocalDescription(answer)
        } catch (e) {
            console.log('answer-setLocalDescription: ', e);
        }
        try {
            sendpeer.setRemoteDescription(answer).then(res => {
                console.log(res);
            })
        } catch (e) {
            console.log('answer-setRemoteDescription: ', e);
        }
    }
    render () {
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
export default chatVideos
