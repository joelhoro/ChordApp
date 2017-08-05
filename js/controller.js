angular.module('chordApp')
.controller('chordAppCtrl', function($scope,util,storage) {
  $scope.util = util;
  $scope.allNotes = []
  for(i = 0; i < 100; i++)
    $scope.allNotes.push(i);
  
  function chordInversions() {
    var chord = ["C2","Eb2","G2","Bb2", "D3" ]

    // just for testing
    var out = [];
    out.push([]);
    for(var i = 0; i < 10; i++) {
      out.push(chord.slice(0));
      chord = util.Invert(chord,"down");
    }
    return out;
  }
  
  $scope.invert = function(index,direction) {
    var before = $scope.chords[index].slice(0);
    var after = util.Invert(before,direction);
    console.log("Inverting", before, direction, "=>", after);
    $scope.chords[index] = after;
  }  
  
  $scope.transpose = function(index,direction) {
    var before = $scope.chords[index].slice(0);
    var after = util.Transpose(before,direction);
    console.log("Transposing", before, direction, "=>", after);
    $scope.chords[index] = after;
  }
  
  $scope.insert = function(index) {
    var copy = $scope.chords[index].slice(0);
    $scope.chords.splice(index+1,0,copy);
  }

  $scope.delete = function(index) {
    //var copy = $scope.chords[index].slice(0);
    $scope.chords.splice(index,1);
  }
  
  $scope.load = () => storage.load($scope);
  $scope.save = () => storage.save($scope);
  
  $scope.chordSets = storage.findChordSets();
  if($scope.chordSets.length>0) {
    console.log("Found ", $scope.chordSets.length, " chordsets", $scope.chordSets)
    $scope.selectedSet = $scope.chordSets[0];
    storage.load($scope); 
  }
  else {
    $scope.chords = chordInversions();
  }

  $scope.griffs = _.keys(util.Griffs);
  $scope.griff = $scope.griffs[0];
});