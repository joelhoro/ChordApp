export var util = function(){

  var utils = {};
  var notes = ["C","D","E","F","G","A","B"];
  var allNotes = ["C","C#","D","D#","E","F","F#","G","G#","A",
                 "A#","B"];
  
  utils.IntToChord = function(k) {
    var note = k%12;
    var octave = ( k - note) / 12;
    return allNotes[note] + octave.toString();
  }

  function matchChord(chord) {
    var chordPatt = /([ABCDEFG])([#b]?)([0-9])/
    return chord.match(chordPatt)
  }
  
  utils.Normalize = function(chord) {
    return utils.IntToChord(utils.ChordToInt(chord));
  }

  utils.ChordToInt = function(chord) {
    var match = matchChord(chord);
    if(match == null)
      return -1;
    var note = match[1];
    var alteration = match[2];
    var octave = match[3];

    var value = 0
    value += allNotes.indexOf(note);
    var alterations = {"#" : 1, "b" : -1, "" : 0}
    value += alterations[alteration];
    value += octave * 12;
    return value;
  }
  
  utils.ChordSplit = function(chord) {
    chord = utils.Normalize(chord);
    match = matchChord(chord);
    if(match == null)
      return -1;
    [full,note,alteration,octave] = match
    return [note+alteration,octave];
  }

  utils.Invert = function(chords,direction) {
    var chords = chords.slice();
    var sign = 1;
    if(direction == "down") {
      chords.reverse();
      sign = -1;      
    }
    
    var first = chords[0];
    first = utils.IntToChord(utils.ChordToInt(first) + 12*sign);
    chords = chords.splice(1)
    chords.push(first);
    if(direction == "down") {
      chords.reverse();
    }
    
    return utils.Sort(chords);
  }

  utils.Sort = function(chords) {
    return _.sortBy(chords,c => utils.ChordToInt(c));
  }
  
  utils.Transpose = function(chords,direction) {
    var shift = {"up" : 1, "down" : -1}[direction];
    return chords.map(c => utils.IntToChord(utils.ChordToInt(c) + shift));
    
  }

  utils.Griffs = {
          'c-system' : (i,j) => 3*i+j*2+2,
          'b-system' : (i,j) => 3*i+j+2,
        }

  utils.test = function(x) {
    debugger;
  }

  utils.clickNote = function(scope,position) {
    var newNote = utils.IntToChord(position);
    var notes = JSON.parse(scope.notes);
    notes.push(newNote);
    scope.notes = JSON.stringify(notes);
  }

  // var instrumentName = 'acoustic';
  // var instrumentName = 'piano';
  // var instrument = Synth.createInstrument(instrumentName);

  utils.PlayNotes = function(notes,interval) {
    var i = 0;
    notes.map(note => {
      var offset = 30;
      var velocity = 80;
      var channel = 0;
      var noteInt = utils.ChordToInt(note) + offset;
      //console.log("Preparing", note);
      MIDI.programChange(0,0);
      
      setTimeout(() => MIDI.noteOn(channel,noteInt, velocity, 0),(i + 0.1)*interval);
      setTimeout(() => MIDI.noteOff(channel,noteInt, 0.5),(i++ + 0.5)*interval);      
    });
  }


  var chordTypes = {

    ''  : [4,7],
    'm' : [3,7],
    'm7' : [3,7,10],
    'm5b7' : [3,6,10,12],
    'm9' : [3,7,10,14],
    '7' : [4,7,10],
    '7b9#11' : [4,7,10,13,18],
    '7M' : [4,7,11],
    '7M9' : [4,7,11,14],
    '9b' : [4,7,10,14],
    'm11' : [3,7,10,15,19],
    'sus' : [4,8,10,13]
  }

  utils.SymbolToChord = function(symbol) {
    var re = /([ABCDEFG])([#b]?)(.*)/
    var match = symbol.match(re)  
    var baseRank = utils.ChordToInt(match[1]+match[2]+"3");
    var chordIntervals = chordTypes[match[3]]
    var bassOffset = 0; // octaves down
    chordIntervals.splice(0,0,-12*bassOffset);
    return chordIntervals.map(c => utils.IntToChord(baseRank + c));
  }

  var notes = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B" ]; 
  utils.black = [];
  utils.noteNames = [];
  utils.fullNoteNames = [];
  for (var i = 0; i < 90; i++) {
          var note = (i+2)%12;
          utils.black[i] = notes[note].length > 1;
          utils.fullNoteNames[i] = notes[note] + Math.floor((i+2)/12);
          utils.noteNames[i] = notes[note];
        }
  


  return utils;
}();

// export default utils;