var keyNameBase = 'chordscreator.chordset'
var keyName = name => keyNameBase + "." + name;

export var storage = {
  save(stack, name) {
    var savedJSON = JSON.stringify(stack);
    console.log("Saving to ", keyName(name));
    localStorage.setItem(keyName(name), savedJSON);
  },

  load(name) {
    var json = localStorage.getItem(keyName(name));
    console.log("Loading from ", keyName(name), JSON.parse(json));
    return JSON.parse(json);
  },

  findChordSets() {
    var chordSets = [];
    var regEx = new RegExp(keyNameBase + "\.(.*)")
    for (var key in localStorage){ 
      var match = key.match(regEx)
      if(match == null) continue;
      chordSets.push(match[1]);
    }
    chordSets.sort();
    return chordSets;
  }
}

