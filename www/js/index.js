var pin = [], positions = [], bg = [];

var beaconActive = {};

beaconActive.minor = "";
beaconActive.meters = "";
beaconActive.distance = "";


pin[1] = "pin_1";
pin[2] = "pin_2";
pin[3] = "pin_3";
pin[4] = "pin_4";

positions['pin_1'] = {
  left: "90px",
  bottom: "320px"
}

positions['pin_2'] = {
  left: "90px",
  bottom: "30px",
}

positions['pin_4'] = {
  right: "100px",
  top: "20px"
}

positions['pin_3'] = {
  right: "100px",
  bottom: "30px"
}

bg['pin_1'] = {
  top: "-100px",
  left: "0px"
}

bg['pin_2'] = {
  top: "-200px",
  left: "0px"
}

bg['pin_4'] = {
  right: "10px",
  top: "10px"
}

bg['pin_3'] = {
  right: "10px",
  top: "-200px"
}

var app = (function() {
  var app = {};

  app.initialize = function() {
    document.addEventListener('deviceready', onDeviceReady, false);
  };

  function onDeviceReady() {
    // Specify a shortcut for the location manager holding the iBeacon functions.
    window.estimote = EstimoteBeacons;

    // Start tracking beacons!
    startScan();
  }

  // Start application
  function startScan() {
    // Callback success
    function onBeaconsRanged(beaconInfo) {
      
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

        // Check intersection
        checkProximity(distance, meters, minor);
      }
    }

    // Callback error
    function onError(errorMessage) {
      console.log('Ranging beacons did fail: ' + errorMessage);
    }

    // Request authorization for IOS
    estimote.requestAlwaysAuthorization();
    
    // Start ranging beacons.
    estimote.startRangingBeaconsInRegion({}, onBeaconsRanged, onError);
  }

  return app;
})();

// Initialize
app.initialize();


/*
 * Function to check if the pin is between two beacons.
 */
function checkProximity(distance, meters, minor) {
  if(beaconActive.minor === "") {
    beaconActive.distance = distance;
    beaconActive.meters = meters;
    beaconActive.minor = minor;
    addPin(minor);
  }

  if(beaconActive.minor != minor) {
    if (Math.round(distance) <= 2) {
      beaconActive.minor = minor;
      beaconActive.meters = meters;
      beaconActive.distance = distance;

      alert("PIN!! "+ minor);
      addPin(minor);
    }
  }
}

/**
 * AddPin
 * @param 
 */
// Move Pin in MAP
function addPin(minor) {
  var pinHere = pin[minor];

  $(".im").removeAttr('style');
  $("#mapa").removeAttr("style");

  $(".im").animate(positions[pinHere], 500);
  $('#mapa').animate(bg[pinHere], 500);
}