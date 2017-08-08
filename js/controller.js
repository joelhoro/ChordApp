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

  $scope.sort = function(index) {
    var before = $scope.chords[index].slice(0);
    var after = util.Sort(before);
    console.log("Sort", before, "=>", after);
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
  
  $scope.play = function(chord,type) {
    var notes = chord.map(chord => {
        var note = util.ChordSplit(chord);
        duration = 2;
        note.push(duration);
        return note;
    });
    var delay = type == "arpeggio" ? 100 : 0;
    util.PlayNotes(notes,delay);
  }

  $scope.x = function() {
    debugger;
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
    //$scope.chords = chordInversions();
    var sequence = ["Cm9", "F7b9#11", "Bb7M9", "Eb7M" , "Am5b7", "D9b", "Gm11", "Gsus"];
    var chords = sequence.map(c => util.SymbolToChord(c));
    console.log("Chords:",chords);
    $scope.chords = chords;
  }


  $scope.griffs = _.keys(util.Griffs);
  $scope.griff = $scope.griffs[0];

  $scope.count = 0;
  var instrumentName = 'piano';
  var instrument = Synth.createInstrument(instrumentName);

  function updateActiveNotes() {
    $scope.activeNotes = util.Sort(_.keys($scope.activeNotesDictionary));
    //
    //console.log($scope.activeNotes);
  }

  $scope.deleteActiveNotes = function() {
    $scope.activeNotesDictionary = {};
    updateActiveNotes();
  }

  $scope.removenote = function(note) {
    delete($scope.activeNotesDictionary[note]);
    updateActiveNotes();
  }

  $scope.processKeystroke = function(event) {
    //console.log(event);
    var notes = "q2w3er5t6y7ui9o0p[=]"
    var noteRank = notes.indexOf(event.key);
    if(noteRank<0) return;

    var fullNote = util.IntToChord(noteRank+36);

    if(event.type=="keydown") {
      var note = util.ChordSplit(fullNote);
      if($scope.activeNotesDictionary[fullNote] == undefined)
          instrument.play(note[0],note[1],2);
      $scope.activeNotesDictionary[fullNote] = 1;
    }
    else if (event.type == "keyup" && !$scope.stickyNotes) {
      delete($scope.activeNotesDictionary[fullNote]);
    }

    updateActiveNotes();

    $scope.$apply();
  }

  $scope.stickyNotes = true;
  $scope.activeNotesDictionary = {};

  // $scope.activeNotesDictionary["C3"] = 1;
  // $scope.activeNotesDictionary["E3"] = 1;
  // $scope.activeNotesDictionary["G3"] = 1;
  updateActiveNotes();

  document.addEventListener("keydown", $scope.processKeystroke, false);
  document.addEventListener("keyup", $scope.processKeystroke, false);

});