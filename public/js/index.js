const socket = io()
socket.on('wellcome', (data) => {
    console.log(data)
})
