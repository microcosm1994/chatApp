module.exports.state = {}
module.exports.usocket = {
    getState: () => {
        return this.state
    },
    setState: (key, value) => {
        if (key && value) {
            this.state[key] = value
        }
    },
    clearState: () => {
        this.state = null
        this.state = {}
    }
}
