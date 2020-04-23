function addEntry(err) {
  
} 

function addMsg(msg) {
  $("#chatHistory").append("<div>"+msg+"</div><hr />")
}

async function run() {
  const id = nats.nuid.next()

  nats.connect({url: 'wss://localhost:9222', noEcho: true})
    .then(async (nc) => {
      addEntry(`connected as ${id} to ${nc.options.url}`)

      // handle errors
      nc.addEventListener('error', (err) => {
        addEntry(`error: ${err.toString()}`)
        addEntry(`reloading in 1s`)
        setTimeout(() => {
          location.reload()
        }, 1000)
      })

      // handle close
      nc.addEventListener('close', () => {
        addEntry(`connection closed`)
        addEntry(`will attempt to reconnect in 1s`)
        setTimeout(() => {
          location.reload()
        }, 1000)
      })

      $("#btnSend").on("click", (e)=> {
        var v = $("#newMessage").val()

        nc.publish('msg', v)
        addMsg(v);
      })

      nc.subscribe('msg', (m, err) => {
        addMsg(m.data)
      })

      await nc.flush()

      // nc.publish('entered', id)
      // nc.publish('who')
    })
    .catch((err) => {
      addEntry(`error connecting: ${err.toString()}`)
      addEntry(`will reload in 1000`)
      setTimeout(() => {
        location.reload()
      }, 1000)
    })
}
run()
