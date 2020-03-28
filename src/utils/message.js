const Generatemessage = (username, message) => {
    return {
        username,
        messageText: message,
        createdAt: new Date().getTime()
    }
}

const generateLocation = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    Generatemessage,
    generateLocation
}