input = document.querySelector('input')
messeges = document.querySelector('#messages')

database = firebase.database()

reference = database.ref()

function sendMessage(){
  reference.push("Xander: " + input.value)
  input.value = ""
}

function receiveMessage(message){
  m = message.val()

  messages.innerHTML = "<p>" + m + "</p>" + messages.innerHTML
}

function keyPressed(event){
  if(event.which == 13){
    sendMessage()
  }
}

input.addEventListener('keydown', keyPressed)
reference.on('child_added', receiveMessage)
