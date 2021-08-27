$(document).ready(function () {
    //put your code below this message


    const socket = io()
    let name

    do {
        name = prompt('Enter Your Name To Enter in the Chatroom')
    } while (!name)

    // ------------------------list updation section-------------------------------------


    var list = document.querySelector('#mylist')
    var exc
    socket.emit('user-joined', name)

    socket.on('assignId', (info) => {
        // console.log('message recieved')
        // console.log(info)
        exc = info
        newuser(info)

    })
    function newuser(inf) {
        // console.log(info)
        var di = document.createElement('div')
        di.innerHTML = `<li class="active" id="${inf.id}">
            <div class="d-flex bd-highlight">
                <div class="img_cont">
                    <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                        class="rounded-circle user_img">
                    <span class="online_icon"></span>
                </div>
                <div class="user_info">
                    <span>${inf.name}</span>
                    <p>${inf.name} is online</p>
                </div>
            </div>
        </li>`
        list.appendChild(di)
        socket.emit('updateList', inf)
    }

    function topnav(len) {
        var gh = document.getElementById('mem_count')
        gh.innerText = `${len} Online Members`
    }
    function appendname(mem, status) {
        var di = document.createElement('div')
        if (status == 'online') {
            // console.log('inside appendname funcion')
            // console.log(mem)
            di.innerHTML = `<li id="${mem.id}">
            <div class="d-flex bd-highlight">
                <div class="img_cont">
                    <img src="https://i.pinimg.com/originals/ac/b9/90/acb990190ca1ddbb9b20db303375bb58.jpg"
                        class="rounded-circle user_img">
                    <span class="online_icon"></span>
                </div>
                <div class="user_info">
                    <span>${mem.name}</span>
                    <p>${mem.name} is online</p>
                </div>
            </div>
        </li>`
        }
        if (status == 'offline') {

            var l = document.querySelector(`#${mem.id}`)
            l.innerHTML = `<div class="d-flex bd-highlight">
            <div class="img_cont">
                <img src="download.png" class="rounded-circle user_img">
                <span class="online_icon offline"></span>
            </div>
            <div class="user_info">
                <span>${mem.name}</span>
                <p>${mem.name} has left the chat</p>
            </div>
        </div>`
        }
        list.appendChild(di)
    }

    socket.on('updated', (dict) => {
        for (const item in dict) {
            if (item != exc.id) {
                appendname({ id: item, name: dict[item] }, 'online')
            }
        }
        // console.log(exc)
        socket.emit('update-members', exc)
    })

    socket.on('members-updated', (mem) => {
        appendname(mem.person, 'online')
        // console.log(mem)
        // console.log(`event listened wuth the info ${mem}`)
        topnav(mem.sz)
    })
    socket.emit('update-top',)

    socket.on('top-updated', (sz) => {
        console.log('event listened')
        topnav(sz)
    })

    //--------------------------------------------------------------------------------

    //-------------------------- message section updation------------------------------

    var b = document.querySelector('#send')
    var msg = document.querySelector('#inp')

    b.addEventListener("click", () => {
        sendMessage(msg.value)
        msg.value = ''
    })

    function sendMessage(val) {
        let mes = {
            message: val,
            user: name
        }
        appendMessage(mes, 'right')
        socket.emit('sendM', mes)
    }


    // function to dynamically put chat in message container 

    function appendMessage(mes, pos) {
        var currentdate = new Date();
        var h = currentdate.getHours();
        var min = currentdate.getMinutes();
        var dat = "Last Sync: " + currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear();
        var y = mes.message
        var nme = mes.user;
        var div = document.createElement('div')
        if (pos == 'left') {
            div.innerHTML = `<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg"></div><div class="msg_cotainer"><strong><u>${mes.user}</u></strong>: ` + y + '<span class="msg_time">' + h + ':' + min + ' ,' + dat + '</span></div></div>'
        }
        if (pos == 'right') {
            if (y != '') {
                div.innerHTML = '<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send"> <strong><u>you</u></strong> : ' + y + '<span class="msg_time_send">' + h + ':' + min + ', ' + dat + '</span></div><div class="img_cont_msg"><img src="https://img.icons8.com/color/36/000000/administrator-male.png" class="rounded-circle user_img_msg avatar"></div></div>'
            }
        }
        var cont = document.querySelector('#message_container')
        cont.appendChild(div)
    }

    // recieving the message

    socket.on('recieve', (message) => {
        appendMessage(message, 'left')
    })

    //------------------------------------------------------------------------------------------------------------------------------

    // --------------------------------------disconnection section--------------------------------------------

    socket.on('user-left', (per) => {
        // console.log('event fired')
        // console.log(per)
        appendname(per, 'offline')
        topnav(per.sz - 1)
    })
    //--------------------------------------------------------------------------------------------------------------
    //put code above this comment
})
