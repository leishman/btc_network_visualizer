
// create new websocket object using a secure connection (wss)
var blkchainSocket = new WebSocket('wss://ws.blockchain.info/inv');

// once the socket connection is established
blkchainSocket.onopen = function(event) {
  var subMessage;

  // message to subscribe to all unconfirmed transactions
  subMessage = '{"op":"unconfirmed_sub"}';

  // send message to subscribe
  blkchainSocket.send(subMessage);
}

// callback to execute when a message is displayed
blkchainSocket.onmessage = function(event) {
  console.log(event.data);
  visualize(JSON.parse(event.data));
}


function visualize(data) {

  // declare variables
  var r, outputs, txDot, vizHeight, vizWidth,
    vizContainter, dot, txVal = 0, valNorm = 10000000;

  // query DOM for viz Container
  vizContainter = $('.js-visualize');

  // get height and width of viz container
  vizHeight = vizContainter.height();
  vizWidth = vizContainter.width();

  // get value of first tx ouput (for test only)
  outputs = data.x.out;

  // iterate through all unspent outputs to calculate value of tx
  for(var i = 0; i < outputs.length; i++){
    txVal += outputs[i].value;
  }

  // calculate radius of circle to display
  r = (txVal / valNorm) / 2;

  // generate random position
  randTop = randomInt(vizHeight) + 88;
  randLeft = randomInt(vizWidth) - r;

  // set minimum size for r
  if(r < 5) {
    r = 5;
  } else if(r > 100) {
    r = 100;
  }

  // define HTML element
  txDot = $('<div class="txBubble"><div class="txBubbleInner"></div></div>')
    .css({'top': randTop, 'left': randLeft, 'width': r, 'height': r})
    .attr('data-txvalue', txVal);

  // add element to DOM
  dot = vizContainter.append(txDot);
}

// function to display tooltip
function showTooltip(event) {
  // declare variables
  var addrs, value, tooltip;

  // get value of tx stored as data attribute
  value = $(this).data('txvalue');

  // get coordinates of user's click
  xCoord = event.clientX;
  yCoord = event.clientY;

  // remove other tooltips
  $('.toolTip').remove();

  // create a tooltip and position it at user's click
  tooltip = $('<div class="toolTip"></div>')
    .css({'top': yCoord, 'left': xCoord})
    .html('<p>' + satoshi2btc(value) + ' BTC</p>');

  // add tooltip to DOM
  $('.js-visualize').append(tooltip);
}

// define random integer function
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// convert satoshis to BTC
function satoshi2btc(val) {
  return val / 100000000;
}

// bind showTooltip function on dom load
$(function() {
  $(document).on('click', '.txBubble', showTooltip);
});

