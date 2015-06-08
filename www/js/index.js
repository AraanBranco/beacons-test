var pin = [];
var positions = [];
var bg = [];

var beaconActive = {};

beaconActive.minor = "";
beaconActive.meters = "";
beaconActive.distance = "";


pin[1] = "pin_1";
pin[2] = "pin_2";
pin[3] = "pin_3";

positions['pin_1'] = {
  left: "90px",
  bottom: "320px"
}

positions['pin_2'] = {
  left: "90px",
  bottom: "30px",
}

positions['pin_3'] = {
  right: "100px",
  top: "20px"
}

bg['pin_1'] = {
  top: "-100px",
  left: "0px"
}

bg['pin_2'] = {
  top: "-200px",
  left: "0px"
}

bg['pin_3'] = {
  right: "10px",
  top: "10px"
}

var app = (function() {
  // Application object.
  var app = {};

  // Dictionary of beacons.
  var beacons = {};

  // Timer that displays list of beacons.
  var updateTimer = null;

  app.initialize = function() {
    document.addEventListener('deviceready', onDeviceReady, false);
  };

  function onDeviceReady() {
    // Specify a shortcut for the location manager holding the iBeacon functions.
    window.estimote = EstimoteBeacons;

    // Start tracking beacons!
    startScan();
  }

  function startScan() {
    function onBeaconsRanged(beaconInfo) {
      
      beacons = beaconInfo.beacons;
      for (var i in beaconInfo.beacons) {
        var beacon = beaconInfo.beacons[i];
        var minor = beacon.minor;
        var distance = 0;
        var meters = "";
        var proximity = beacon.proximity;

        if (beacon.distance > 1) {
          distance = beacon.distance.toFixed(3);
          meters = "m";
        } else {
          distance = (beacon.distance * 100).toFixed(3);
          meters = "cm";
        }

        checkProximity(distance, meters, minor);
      }
    }

    function onError(errorMessage) {
      console.log('Ranging beacons did fail: ' + errorMessage);
    }

    // Request authorization
    estimote.requestAlwaysAuthorization();
    
    // Start ranging beacons.
    estimote.startRangingBeaconsInRegion({}, onBeaconsRanged, onError);
  }

  return app;
})();

app.initialize();

function checkProximity(distance, meters, minor) {
  if(beaconActive.minor != "" && beaconActive.minor != minor) {
    if (Math.round(distance) <= 2) {
      beaconActive.minor = minor;
      beaconActive.meters = meters;
      beaconActive.distance = distance;
    }
  } else {
    beaconActive.distance = distance;
    beaconActive.meters = meters;
    beaconActive.minor = minor;
  }

  addPin(beaconActive.minor);
}

// Move Pin in MAP
function addPin(minor) {
  var pinHere = pin[minor];

  $(".im").removeAttr('style');

  if(beaconActive.minor != minor) {
    $("#mapa").removeAttr("style");
  }

  $(".im").css(positions[pinHere]);
  $('#mapa').animate(bg[pinHere], 500);
}