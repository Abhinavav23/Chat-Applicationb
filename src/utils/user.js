const users = []

const addUser = ({ id, username, chatroom}) => {

    //clean the data
    username = username.trim().toLowerCase()
    chatroom = chatroom.trim().toLowerCase()

    //validate the data
    if(!username|| !chatroom){
        return {
            error: 'username and chatroom required!'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.username == username && user.chatroom == chatroom
    })

    //validate user
    if(existingUser){
        return {
            error: 'user already exists!!'
        }
    }

    //save user
    const user = { id, username, chatroom }
    users.push(user)
    return { user }

}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id )
    if(index !== -1){
        return users.splice(index, 1)[0]
    }

}

const getUSer = (id) => {
    const index = users.findIndex( user => user.id === id )

    if(index === -1){
        return {
            error: 'user not present!'
        }
    }   
    return users[index]
}

const getUsersInRoom = (chatroom) => {
    chatroom = chatroom.toLowerCase()
    const userInRoom = users.filter(user => user.chatroom === chatroom)
    return userInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUSer,
    getUsersInRoom
}
