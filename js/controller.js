angular.module('chordApp')
.controller('chordAppCtrl', function($scope,util,storage) {
  $scope.util = util;
  $scope.allNotes = []
  for(i = 0; i < 100; i++)
    $scope.allNotes.push(i);
  
  function chordInversions() {
    var chord = ["C3","Eb3","G3","Bb3", "D4" ]

    // just for testing
    var out = [];
    out.push([]);
    for(var i = 0; i < 10; i++) {
      out.push(chord.slice(0));
      chord = util.Invert(chord,"up");
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
  
  $scope.play = (chord,type) => {
    var notes = chord.map(chord => {
        var note = util.ChordSplit(chord);
        duration = 2;
        note.push(duration);
        return note;
    });
    var delay = type == "arpeggio" ? 100 : 0;
    util.PlayNotes(notes,delay);
  }


  $scope.playAll = function() {
    var i = 0;
    $scope.chords.map(chord => {
      setTimeout(() => $scope.play(chord,"chord"), i++ * 300);
    })
  }

  $scope.chordSets = storage.findChordSets();
  var loadFirstChordSet = false;
  if(loadFirstChordSet && $scope.chordSets.length>0) {
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