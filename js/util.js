angular.module('chordApp')
.service('util',function(){
  
  var notes = ["C","D","E","F","G","A","B"];
  var allNotes = ["C","C#","D","Eb","E","F","F#","G","Ab","A",
                 "Bb","B"];
  
  this.IntToChord = function(k) {
    var note = k%12;
    var octave = ( k - note) / 12;
    return allNotes[note] + octave.toString();
  }
  
  this.ChordToInt = function(chord) {
    var chordPatt = /([ABCDEFG])([#b]?)([0-9])/
    match = chord.match(chordPatt)
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
  
  this.Transpose = function(chords,direction) {
    var shift = {"up" : 1, "down" : -1}[direction];
    return chords.map(c => this.IntToChord(this.ChordToInt(c) + shift));
    
  }

  this.Griffs = {
          'c-system' : (i,j) => 3*i+j*2+2,
          'b-system' : (i,j) => 3*i+j+2,
        }


})
