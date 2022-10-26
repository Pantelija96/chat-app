const socket = io()

socket.on('newConnection', (data) => {
    console.log('Server message: ', data);
})

const $messageForm = document.getElementById('message-form')
const $messageFormInput = document.getElementById('message')
const $messageFormButton = document.getElementById('submit')

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //disable
    document.getElementById("submitBtn").disabled = true;
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        //enable
        document.getElementById("submitBtn").disabled = false;
        if (error) {
            return console.log(error)
        }
        console.log('message delivered')
    })
})

socket.on('message', (data) => {
    console.log('New message from user: ', data.text)
    let html = document.getElementById("messages").innerHTML;
    html += "<p>" + data.text + " from user: " + data.username + "</p>"
    document.getElementById("messages").innerHTML = html;
})

socket.on('roomData', ({ room, users }) => {
    document.getElementById('roomNameData').innerHTML = room;

    console.log(users)

    let html = "";

    users.forEach(user => {
        html += "<p>" + user.username + "</p>"
    });

    document.getElementById('usersInRoom').innerHTML = html;
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
        }, () => {
            console.log('Location shared')
        })
    })
})

document.getElementById('join-room').addEventListener('click', (e) => {
    let username = document.getElementById("username").value;
    let room = document.getElementById('roomName').value;
    socket.emit('join', { username, room }, (error) => {
        if (error) {
            alert(error);
        }
    })
})
