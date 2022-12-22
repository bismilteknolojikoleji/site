const rand = function() {
    return Math.random().toString(35).substr(2)
}

const token = function() {
    return rand() + rand()
}

module.exports.token = token()