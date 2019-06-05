let state = {}
module.exports.usocket = {
    getState: () => {
        return state
    },
    setState: (key, value) => {
        if (key && value) {
            state[key] = value
        }
    },
    clearState: () => {
        state = null
        state = {}
    }
}
