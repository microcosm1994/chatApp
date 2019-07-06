export default {
    IP: '',
    getlocalIP: async function () {
        let ip:string
        let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
        let peer = new PeerConnection({
            iceServers: []
        })
        await peer.createOffer().then((offer) => {
            let reg = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
            offer.sdp.split('\n').forEach((str) => {
                str = reg.exec(str)
                if (str && str.length > 1) {
                    ip =  str[1]
                }
            })
        })
        return ip
    }
}
