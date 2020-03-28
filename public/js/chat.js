const socket = io()

//elements
const $messageForm = document.getElementById('message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.getElementById('location')
const $messages = document.getElementById('message')

//templates
const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate = document.getElementById('location-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML

//options
const { username, chatroom } = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoScroll = () => {
    //new message element
    const $newMessage = $messages.lastElementChild

    //new message height and style
    const newmessageStyle = getComputedStyle($newMessage)
    const newmessageMargin = parseInt(newmessageStyle.marginBottom)
    const newmessageHeight = $newMessage.offsetHeight + newmessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //visible height container
    const containerHeight = $messages.scrollHeight

    //How far ihave scrolled?
    const scrolloffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newmessageHeight <= scrolloffset ){
        console.log('scrolling')
        $messages.scrollTop = $messages.scrollHeight
    }
}
socket.on('welcome', (message) => {
    const htmlmsg = Mustache.render(messageTemplate, {
        user: message.username,
        message: message.messageText,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', htmlmsg)
})

socket.on('LocationMessage', (link) => {
    const htmlloc = Mustache.render(locationTemplate, {
        user: link.username,
        location: link.url,
        createdAt: moment(link.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', htmlloc)
})

socket.on('roomData', ({room, usersInroom}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users: usersInroom
    })
    document.querySelector('#sidebar').innerHTML= html
})

$messageForm.addEventListener('submit', (e) => {
    $messageFormButton.setAttribute('disabled', 'disabled')
    e.preventDefault()
    //const input = document.querySelector('input').value
    const input = e.target.elements.message.value
    socket.emit('greeting', input, (message) => {
        $messageFormButton.removeAttribute('disabled', 'disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
    })
    autoScroll()
})
// socket.on('countUpdated', (count) => {
//     console.log(`the count value is ${count}`)
// })

// document.querySelector('#inc').addEventListener('click', () => {
//     console.log('clicked')
//     socket.emit('increment')
// })

$locationButton.addEventListener('click', () => {
    $locationButton.setAttribute('disabled', 'disabled')
    if(!navigator.geolocation){
        alert('your browser doesn\'t support geolocation')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () =>{
            $locationButton.removeAttribute('disabled', 'disabled')
            console.log('location shared')
        })
    })
    autoScroll()
})

socket.emit('join', { username, chatroom }, (error) =>{
    if(error){
        alert(error)
        location.href = '/'
    }
} )