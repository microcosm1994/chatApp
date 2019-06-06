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
    removeState: (key) => {
        if (state[key]) {
            delete state[key]
        }
    },
    clearState: () => {
        state = null
        state = {}
    }
}
