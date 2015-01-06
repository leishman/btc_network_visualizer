
///////////////////////////////////////////
/// Connect with Blockchain Websockets API
////////////////////////////////////////////

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
  // Parse the data returned to convert to JSON
  var txData = JSON.parse(event.data);

  // log data to console
  console.log(txData);

  // pass data to visualize() function (defined below)
  visualize(txData);
}


/////////////////////////
/// Visualize the data
/////////////////////////

// Input: JSON data object representing a new Bitcoin transaction from Blockchain.info API
// Result: Append a circle (bubble) to the DOM with a size proportional to the transaction value
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

  // sum all unspent outputs to calculate total value of Tx
  for(var i = 0; i < outputs.length; i++){
    txVal += outputs[i].value;
  }

  // calculate radius of circle to display based on Tx value
  r = (txVal / valNorm) / 2;

  // generate random position
  randTop = randomInt(vizHeight) + 88;
  randLeft = randomInt(vizWidth) - r;

  // set min and max sizes for radius (r)
  if(r < 5) {
    r = 5;
  } else if(r > 100) {
    r = 100;
  }

  // create HTML elements to use as bubble
  txBubble = $('<div class="txBubble"><div class="txBubbleInner"></div></div>')
    .css({'top': randTop, 'left': randLeft, 'width': r, 'height': r})
    .attr('data-txvalue', txVal);

  // add bubble element to DOM
  dot = vizContainter.append(txBubble);
}


/////////////////////////////////////////
/// Create a tooltip to display Tx data
//////////////////////////////////////////

// Input: event, passed by calling function. showTooltip() acts as a callback function when a bubble is clicked
// see $(document).on('click', '.txBubble', showTooltip);

// Result: Display tooltip with the transaction value (in BTC) represented by the bubble

function showTooltip(event) {
  // declare variables
  var addrs, value, tooltip, xCoord, yCoord;

  // get value of tx stored as data attribute
  value = $(this).data('txvalue');

  // get coordinates of user's click
  xCoord = event.clientX;
  yCoord = event.clientY;

  // remove other tooltips to ensure only 1 is displayed at a time
  $('.toolTip').remove();

  // create a tooltip and position it at user's click
  tooltip = $('<div class="toolTip"></div>')
    .css({'top': yCoord, 'left': xCoord})
    .html('<p>' + satoshi2btc(value) + ' BTC</p>');

  // add tooltip to DOM
  $('.js-visualize').append(tooltip);
}

// define random integer function
// radomInt(5) will return a number from 0 to 4

function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// convert Satoshis to BTC
// There are 100,000,000 Satoshis in 1 Bitcoin
function satoshi2btc(val) {
  return val / 100000000;
}


/////////////////////////////////////////
/// Bind Tooltip event on document load
//////////////////////////////////////////

// bind showTooltip function on DOM load
$(function() {
  $(document).on('click', '.txBubble', showTooltip);
});

