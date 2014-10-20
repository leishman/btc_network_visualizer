// create new websocket object using a secure connection (wss)
var blkchainSocket = new WebSocket('wss://ws.blockchain.info/inv');

// once the socket connection is established
blkchainSocket.onopen = function(event) {
  var subMessage;

  // message to subscripe to all unconfirmed transactions
  subMessage = '{"op":"unconfirmed_sub"}';

  blkchainSocket.send(subMessage);
}

// callback to execute when a message is displayed
blkchainSocket.onmessage = function(event) {
  console.log(event.data);
  visualize(JSON.parse(event.data));
}


function visualize(data) {

  // declare variables
  var r, txVal, txDot, vizHeight, vizWidth, vizContainter, valNorm = 12500000;

  // query DOM for viz Container
  vizContainter = $('.js-visualize');

  // get height and width of viz container
  vizHeight = vizContainter.height();
  vizWidth = vizContainter.width();

  // get value of first tx ouput (for test only)
  txVal = data.x.out[0].value;

  // calculate radius
  r = (txVal / valNorm) / 2;

  // generate random position
  randTop = randomInt(vizHeight) - r;
  randLeft = randomInt(vizWidth) - r;

  // set minimum size for r
  if(r < 5) r = 5;

  // define HTML element
  txDot = $('<div class="txBubble"></div>')
    .css({'top': randTop, 'left': randLeft, 'width': r, 'height': r});

  vizContainter.append(txDot);

}

// define random integer function
function randomInt(range) {
  return Math.floor(Math.random() * range);
}


