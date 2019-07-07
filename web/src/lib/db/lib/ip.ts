let IP = ''

class ip {
    constructor () {
        this.getlocalIP()
    }
    getlocalIP () {
        let self = this
        let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
        let peer = new PeerConnection({
            iceServers: []
        })
        peer.createDataChannel('')
        peer.createOffer().then((offer) => {
            peer.setLocalDescription(offer)
        })
        peer.onicecandidate = function (e) {
            if (e.candidate) {
                let reg = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
                e.candidate.candidate.split('\n').forEach((str) => {
                    str = reg.exec(str)
                    if (str && str.length > 1) {
                        IP = str[1]
                    }
                })
            }
        }
    }
    getIP (callback) {
        let ip = IP
        if (ip) {
            callback(ip)
        } else {
            setTimeout(() => {
                this.getIP(callback)
            },200)
        }
    }
}
export default new ip()
