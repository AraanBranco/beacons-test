var bluetoothle;

var jqmReady = $.Deferred();
var pgReady = $.Deferred();

var pin = [];

pin["MiniBeacon_00796"] = "pin_1";
pin["MiniBeacon_00791"] = "pin_2";
pin["MiniBeacon_00783"] = "pin_3";
pin["MiniBeacon_00721"] = "pin_4";

pin["Intercect_1"] = "pin_1_2";
pin["Intercect_2"] = "pin_2_3";
pin["Intercect_3"] = "pin_3_4";

var positions = [];
var bg = [];

positions['pin_1'] = {
  top: "40px",
  right: "443px"
}

bg['pin_1'] = {
  left: "0px",
  top: "0px"
}

positions['pin_1_2'] = {
  top: "40px",
  right: "553px"
}

positions['pin_2'] = {
  top: "40px",
  left: "8px",
}

bg['pin_2'] = {
  left: "-40px",
  top: "0px"
}

positions['pin_2_3'] = {
  top: "270px",
  left: "8px",
}

positions['pin_3'] = {
  left: "8px",
  bottom: "84px"
}

bg['pin_3'] = {
  left: "0",
  bottom: "0"
}

positions['pin_3_4'] = {
  left: "250px",
  bottom: "84px",
}

positions['pin_4'] = {
  right: "25px",
  bottom: "84px",
}

bg['pin_4'] = {
  left: "-350px",
  bottom: "0px"
}

var beacons = {}, pseudo = {};

var app = {
  callback: null,
  initialize: function(callback) {
    this.callback = callback;
    //If testing on a desktop, automatically resolve PhoneGap
    if (document.URL.match(/^https?:/) || document.URL.match(/^file:/)) {
      pgReady.resolve();
    }
    //Else if on a mobile device, add event listener for deviceready
    else {
      document.addEventListener("deviceready", onDeviceReady, false);
    }
  }
};

$(document).on("pagecreate", function() {
  //Resolve jQuery Mobile
  jqmReady.resolve();
  $(document).off("pagecreate");
});

$.when(jqmReady, pgReady).then(function()
{
  //When PhoneGap and jQuery Mobile are resolved, start the app
  if (app.callback !== null)
  {
    app.callback();
  }
});

function onDeviceReady() {
  //Resolve PhoneGap after deviceready has fired
  pgReady.resolve();
}


app.initialize(function() {
  $(document).on('vclick', initialize);
})

function initialize() {
  var paramsObj = {request:true};

  console.log("Initialize : " + JSON.stringify(paramsObj));

  bluetoothle.initialize(initializeSuccess, initializeError, paramsObj);

  return false;
}

function initializeSuccess(obj) {
  console.log("Initialize Success : " + JSON.stringify(obj));

  if (obj.status == "enabled") {
    console.log("Enabled");

    $(MeuAjax);
  }
  else
  {
    console.log("Unexpected Initialize Status");
  }
}

function MeuAjax() {
  setTimeout("MeuAjax()", 500);
  startScan();
}

function initializeError(obj) {
  console.log("Initialize Error : " + JSON.stringify(obj));
}

function enable()
{
  console.log("Enable");

  bluetoothle.enable(enableSuccess, enableError);

  return false;
}

function enableSuccess(obj)
{
  console.log("Enable Success : " + JSON.stringify(obj));

  if (obj.status == "enabled")
  {
    console.log("Enabled");
  }
  else
  {
    console.log("Unexpected Enable Status");
  }
}

function enableError(obj)
{
  console.log("Enable Error : " + JSON.stringify(obj));
}

function disable()
{
  console.log("Disable");

  bluetoothle.disable(disableSuccess, disableError);

  return false;
}

function disableSuccess(obj)
{
  console.log("Disable Success : " + JSON.stringify(obj));

  if (obj.status == "disabled")
  {
    console.log("Disabled");
  }
  else
  {
    console.log("Unexpected Disable Status");
  }
}

function disableError(obj)
{
  console.log("Disable Error : " + JSON.stringify(obj));
}

function startScan() {
  //TODO Disconnect / Close all addresses and empty

  var paramsObj = {serviceUuids:[]};

  console.log("Start Scan : " + JSON.stringify(paramsObj));

  bluetoothle.startScan(startScanSuccess, startScanError, paramsObj);

  return false;
}

function startScanSuccess(obj){

  if(obj.name.match(/MiniBeacon/g)) {
    if (obj.status == "scanResult") {
      beacons[obj.name] = obj.rssi;

      addPin(beacons);
    } else if (obj.status == "scanStarted") {
      console.log("Scan Started");
    } else {
      console.log("Unexpected Start Scan Status");
    }
  }
}

function startScanError(obj) {
  console.log("Start Scan Error : " + JSON.stringify(obj));
}

function stopScan()
{
  console.log("Stop Scan");

  bluetoothle.stopScan(stopScanSuccess, stopScanError);

  return false;
}

function stopScanSuccess(obj)
{
  console.log("Stop Scan Success : " + JSON.stringify(obj));

  if (obj.status == "scanStopped")
  {
    console.log("Scan Stopped");
  }
  else
  {
    console.log("Unexpected Stop Scan Status");
  }
}

function stopScanError(obj)
{
  console.log("Stop Scan Error : " + JSON.stringify(obj));
}


function connect(address)
{
  var paramsObj = {address:address};

   console.log("Connect : " + JSON.stringify(paramsObj));

  bluetoothle.connect(connectSuccess, connectError, paramsObj);

  return false;
}

function connectSuccess(obj)
{
  console.log("Connect Success : " + JSON.stringify(obj));

  if (obj.status == "connected")
  {
    console.log("Connected");
  }
  else if (obj.status == "connecting")
  {
    console.log("Connecting");
  }
  else
  {
    console.log("Unexpected Connect Status");
  }
}

function connectError(obj)
{
  console.log("Connect Error : " + JSON.stringify(obj));
}

function reconnect(address)
{
  var paramsObj = {address:address};

  console.log("Reconnect : " + JSON.stringify(paramsObj));

  bluetoothle.reconnect(reconnectSuccess, reconnectError, paramsObj);

  return false;
}

function reconnectSuccess(obj)
{
  console.log("Reconnect Success : " + JSON.stringify(obj));

  if (obj.status == "connected")
  {
    console.log("Connected");
  }
  else if (obj.status == "connecting")
  {
    console.log("Connecting");
  }
  else
  {
    console.log("Unexpected Reconnect Status");
  }
}

function reconnectError(obj)
{
  console.log("Reconnect Error : " + JSON.stringify(obj));
}

function disconnect(address)
{
  var paramsObj = {address:address};

  console.log("Disconnect : " + JSON.stringify(paramsObj));

  bluetoothle.disconnect(disconnectSuccess, disconnectError, paramsObj);

  return false;
}

function disconnectSuccess(obj)
{
  console.log("Disconnect Success : " + JSON.stringify(obj));

  if (obj.status == "disconnected")
  {
    console.log("Disconnected");
  }
  else if (obj.status == "disconnecting")
  {
    console.log("Disconnecting");
  }
  else
  {
    console.log("Unexpected Disconnect Status");
  }
}

function disconnectError(obj)
{
  console.log("Disconnect Error : " + JSON.stringify(obj));
}

function close(address)
{
  var paramsObj = {address:address};

  console.log("Close : " + JSON.stringify(paramsObj));

  bluetoothle.close(closeSuccess, closeError, paramsObj);

  return false;
}

function closeSuccess(obj)
{
  console.log("Close Success : " + JSON.stringify(obj));

  if (obj.status == "closed")
  {
    console.log("Closed");
  }
  else
  {
    console.log("Unexpected Close Status");
  }
}

function closeError(obj)
{
  console.log("Close Error : " + JSON.stringify(obj));
}


function servicesError(obj)
{
  console.log("Services Error : " + JSON.stringify(obj));
}

function rssi(address)
{
  var paramsObj = {address:address};

  console.log("RSSI : " + JSON.stringify(paramsObj));

  bluetoothle.rssi(rssiSuccess, rssiError, paramsObj);

  return false;
}

// Move Pin in MAP
function addPin(beacons) {
  var objOrdered = Object.keys(beacons).sort(function(a,b){return beacons[a]-beacons[b]});
  var last = parseInt(objOrdered.length - 1);
  var pinHere = pin[objOrdered[last]];

  $(".im").removeAttr('style');
  $(".im").css(positions[pinHere]);
  $('#mapa').css(bg[pinHere]);

  stopScan();
}