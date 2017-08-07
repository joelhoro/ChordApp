angular.module('chordApp')
.service('util',function(){
  
  var notes = ["C","D","E","F","G","A","B"];
  var allNotes = ["C","C#","D","D#","E","F","F#","G","G#","A",
                 "A#","B"];
  
  this.IntToChord = function(k) {
    var note = k%12;
    var octave = ( k - note) / 12;
    return allNotes[note] + octave.toString();
  }

  function matchChord(chord) {
    var chordPatt = /([ABCDEFG])([#b]?)([0-9])/
    return chord.match(chordPatt)
  }
  
  this.Normalize = function(chord) {
    return this.IntToChord(this.ChordToInt(chord));
  }

  this.ChordToInt = function(chord) {
    match = matchChord(chord);
    if(match == null)
      return -1;
    [full,note,alteration,octave] = match
    value = 0
    value += allNotes.indexOf(note);
    alterations = {"#" : 1, "b" : -1, "" : 0}
    value += alterations[alteration];
    value += octave * 12;
    return value;
  }
  
  this.ChordSplit = function(chord) {
    chord = this.Normalize(chord);
    match = matchChord(chord);
    if(match == null)
      return -1;
    [full,note,alteration,octave] = match
    return [note+alteration,octave];
  }

  this.Invert = function(chords,direction) {
    var chords = chords.slice();
    var sign = 1;
    if(direction == "down") {
      chords.reverse();
      sign = -1;      
    }
    
    var first = chords[0];
    first = this.IntToChord(this.ChordToInt(first) + 12*sign);
    chords = chords.splice(1)
    chords.push(first);
    if(direction == "down") {
      chords.reverse();
    }
    
    return chords;
  }

  this.Sort = function(chords) {
    return _.sortBy(chords,c => this.ChordToInt(c));
  }
  
  this.Transpose = function(chords,direction) {
    var shift = {"up" : 1, "down" : -1}[direction];
    return chords.map(c => this.IntToChord(this.ChordToInt(c) + shift));
    
  }

  this.Griffs = {
          'c-system' : (i,j) => 3*i+j*2+2,
          'b-system' : (i,j) => 3*i+j+2,
        }

  this.test = function(x) {
    debugger;
  }

  var instrumentName = 'acoustic';
  var instrumentName = 'piano';
  var instrument = Synth.createInstrument(instrumentName);

  this.PlayNotes = function(notes,interval) {
    var i = 0;
    notes.map(note => {
      //console.log("Preparing", note);
      setTimeout(() => instrument.play(note[0],note[1],note[2]),(i++ + 0.1)*interval);
    });
  }


  var chordTypes = {

    ''  : [4,7],
    'm' : [3,7],
    'm7' : [3,7,10],
    'm5b7' : [3,6,10,12],
    'm9' : [3,7,10,15],
    '7' : [4,7,10],
    '7b9#11' : [4,7,10,13,18],
    '7M' : [4,7,11],
    '7M9' : [4,7,11,14],
    '9b' : [4,7,10,14],
    'm11' : [3,7,10,15,19],
    'sus' : [4,8,10,13]
  }

  this.SymbolToChord = function(symbol) {
    var re = /([ABCDEFG])([#b]?)(.*)/
    var match = symbol.match(re)  
    var baseRank = this.ChordToInt(match[1]+match[2]+"3");
    var chordIntervals = chordTypes[match[3]]
    chordIntervals.splice(0,0,-24);
    return chordIntervals.map(c => this.IntToChord(baseRank + c));
  }

})
