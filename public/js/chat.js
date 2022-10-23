const socket = io()

socket.on('newConnection', (data) => {
    console.log('Server message: ', data);
})

document.querySelector('#sendMessage').addEventListener('submit', (e) => {
    e.preventDefault()

    const message = document.querySelector('#message').value

    socket.emit('sendMessage', message)
})

socket.on('message', (data) => {
    console.log('New message from user: ', data)
})


document.querySelector('#send-location').addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Old version geolocation is not supported')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})