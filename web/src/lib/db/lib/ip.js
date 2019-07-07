var IP = '';
var ip = /** @class */ (function () {
    function ip() {
        this.getlocalIP();
    }
    ip.prototype.getlocalIP = function () {
        var self = this;
        var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var peer = new PeerConnection({
            iceServers: []
        });
        peer.createDataChannel('');
        peer.createOffer().then(function (offer) {
            peer.setLocalDescription(offer);
        });
        peer.onicecandidate = function (e) {
            if (e.candidate) {
                var reg_1 = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                e.candidate.candidate.split('\n').forEach(function (str) {
                    str = reg_1.exec(str);
                    if (str && str.length > 1) {
                        IP = str[1];
                    }
                });
            }
        };
    };
    ip.prototype.getIP = function (callback) {
        var _this = this;
        var ip = IP;
        if (ip) {
            callback(ip);
        }
        else {
            setTimeout(function () {
                _this.getIP(callback);
            }, 200);
        }
    };
    return ip;
}());
export default new ip();
