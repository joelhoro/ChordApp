angular.module('chordApp')
.service('storage',function(){
  var keyNameBase = 'chordscreator.chordset'
  var keyName = scope => keyNameBase + "." + scope.selectedSet;
  
  this.save = function(scope) {
    var savedJSON = JSON.stringify(scope.chords);
    console.log("Saving to ", keyName(scope));
    localStorage.setItem(keyName(scope), savedJSON);
  }
  
  this.load = function(scope) {
    var json = localStorage.getItem(keyName(scope));
    console.log("Loading from ", keyName(scope), JSON.parse(json));
    scope.chords = JSON.parse(json);
  }

  this.findChordSets = function() {
    var chordSets = [];
    var regEx = new RegExp(keyNameBase + "\.(.*)")
    for (var key in localStorage){ 
      var match = key.match(regEx)
      if(match == null) continue;
      chordSets.push(match[1]);
    }
    return chordSets;
  }

  
})
