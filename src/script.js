let gt

var currentUserID = 'U-' + Math.floor(Math.random() * 10000);

async function main() {

  const createGt = (ip) => {

    const gt = new GT(ip, { handleState: true })


    gt.on('state_object_updated', () => {
      document.getElementById('number').innerText = gt.state.number;
    })

    // fires when WE disconnect.
    gt.on('disconnect', (reason) => {
      console.log(`We have disconnected from the server: ${reason}`)
    })

    // fires when we joined a room
    gt.on('joined', (room, roomState, users) => {
      console.log('Joined', room, 'with state', roomState, 'users', users);
      // if there are users in the room create a cursor for each of them
      Object.keys(users).map((key) => createCursor(key, users[key]));
      document.title = currentUserID;

      var rootElement = $('#root');
      // broadcast mousemovement to all other connected peers
      rootElement.on('mousemove', (e) => {
        gt.updateUser({ 'x': e.pageX - rootElement.offset().left, y: e.pageY - rootElement.offset().top });
      })

    })

    // fires when we authed with an id.
    gt.on('authed', (id, state) => {
      console.log('Authed', id, 'with state', state)
    })

    // fires when someone has joined the room (including ourselves).
    gt.on('connected', (id, userState) => {
      console.log(`ID ${id} has joined with state:`, userState);
      createCursor(id);
    })

    // fires when someone left the room
    gt.on('disconnected', (id, reason) => {
      console.log(`ID ${id} has left with reason: ${reason}`);
      $('#' + id).remove();
    })

    // these will fire when the room/user state changes.
    gt.on('user_updated_reliable', (id, payloadDelta) => {
      console.log(`ID ${id} has updated their state:`, payloadDelta);
      $('#' + id).css({ 'left': payloadDelta.x + 'px', top: payloadDelta.y + 'px' });
    })

    return gt
  }


  try {
    gt = createGt('hci-sandbox.usask.ca:3001')
    await gt.connect();
    await gt.auth(currentUserID);
    await gt.join('synvisio', {});
  }
  catch (e) {
    console.error(e)
  }

  document.getElementById('randomizer').addEventListener('click', async () => {
    gt.updateState({ 'number': Math.floor(Math.random() * 1000) })
  })

}


main()


let colorScale = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

// function to create a new cursor in a random color on the box to represent to a peer
function createCursor(mountID) {
// bypass cursor creation for current user
  if (currentUserID == mountID) return;

  const colorHash = colorScale[Math.floor(Math.random()*10)];

  let cursorElement = "<svg fill='" + colorHash + "' height='25' width='25'><g transform='scale(0.075)'><path d='M247.094,297c-2.831,0-5.549-1.125-7.551-3.129l-82.835-82.868l-34.905,60.448c-2.046,3.544-5.936,5.61-10.017,5.31c-4.081-0.296-7.634-2.896-9.148-6.697L0.825,14.632c-1.58-3.965-0.648-8.489,2.369-11.505C6.212,0.108,10.735-0.82,14.7,0.761l255.317,101.86c3.799,1.515,6.397,5.067,6.693,9.148c0.295,4.079-1.766,7.968-5.308,10.015l-60.435,34.929l82.839,82.878c4.168,4.169,4.168,10.926,0.001,15.096l-39.162,39.186C252.643,295.873,249.927,297,247.094,297z M154.422,182.934c2.813,0,5.534,1.112,7.551,3.129l85.121,85.156l24.067-24.082l-85.126-85.162c-2.347-2.348-3.469-5.651-3.036-8.941c0.433-3.291,2.371-6.191,5.244-7.852l53.427-30.879L29.86,29.801l84.462,211.902l30.853-53.433c1.66-2.874,4.563-4.813,7.854-5.246C153.494,182.964,153.959,182.934,154.422,182.934z'></path></g></svg>";
  let containerDiv = $('<div/>', { id: mountID, 'class': 'cursor-container' }).appendTo('#root');

  containerDiv.html(cursorElement)
    .append('<span style="color:' + colorHash + '">' + mountID + '</span>')
    .css({
      'position': 'absolute',
      'top': '0px',
      'left': '0px'
    });

}



