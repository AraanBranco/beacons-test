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

pin[4] = "pin_1_2";
pin[5] = "pin_2_3";
pin[6] = "pin_3_4";

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

    // Display refresh timer.
    updateTimer = setInterval(displayBeaconList, 100);
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

  function displayBeaconList() {

    $.each(beacons, function(key, beacon) {
      var pinHere = pin[beacon.minor];
      var proximity = beacon.proximity;
      var proximityNames = [
        'Unknown',
        'Immediate',
        'Near',
        'Far'
      ];

      if(proximityNames[proximity] == "Immediate") {
        $(".im").removeAttr('style');
        $(".im").css(positions[pinHere]);
        //$('#mapa').css(bg[pinHere]);
      }
    });
  }

  return app;
})();

app.initialize();

function checkProximity(distance, meters, minor) {
  if(beaconActive.minor != "") {
    if(beaconActive.minor != minor) {
      if (beaconActive.meters == meters && Math.round(distance) <= 2 && Math.round(beaconActive.distance) <= 2 ) {
        
      }
    }
  } else {
    beaconActive.distance = distance;
    beaconActive.meters = meters;
    beaconActive.minor = minor;
  }
}

// Move Pin in MAP
function addPin(minor, proximity) {
  var pinHere = pin[minor];
  var proximityNames = [
    'Unknown',
    'Immediate',
    'Near',
    'Far'
  ];

  if(proximityNames[proximity] == "Immediate") {
    $(".im").removeAttr('style');
    $(".im").css(positions[pinHere]);
    //$('#mapa').css(bg[pinHere]);
  }
}