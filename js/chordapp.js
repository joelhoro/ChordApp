import Vue from '../node_modules/vue/dist/vue.esm.browser.js';
import { storage } from './storage.js';
import { util } from './util.js';
import {accordion} from './accordion.js';
import { samples } from './samples.js';


var template = `
<div id="main">
    <span v-for='set in savedSets()'>
        <button @click='loadSet(set)'>{{set}}</button>
    </span>
    <span class="material-icons" @click='save'>save</span>
    <input type='text' v-model='name' tabIndex="1"/>
    <br>
    <h2>Chord set '{{name}}'</h2>
    <span v-if='showkeyboard' class="material-icons" @click='showkeyboard = !showkeyboard'>keyboard_hide</span>
    <span v-else class="material-icons" @click='showkeyboard = !showkeyboard'>keyboard</span>
    <span class="material-icons" @click='reset'>delete</span>
    <span class="material-icons" @click='playChord(selected)'>play_circle</span>
    <span class="material-icons"  @click='playChord(selected,true)'>play_circle_outline</span>
    <span class="material-icons" @click='addToStack'>add_circle</span>
    <span class="material-icons" @click='transpose("down")'>arrow_drop_down</span>
    <span class="material-icons" @click='transpose("up")'>arrow_drop_up</span>
    <br>
    <accordion v-for='size in [40]' 
        tabindex="0"
        v-bind:key="size.id" 
        :size='size'  
        :selected='selected' 
        :showkeyboard='showkeyboard'
        @note='noteClicked($event)' ></accordion>
    <!-- <br>Notes selected:     {{selected}} -->
    
    <span v-for='(selected,idx) in stack'>
    <hr><br>
    <span class="material-icons" @click='deleteChord(idx)'>delete</span>
    <span v-if='idx<stack.length-1'  class="material-icons" @click='move(idx,1)'>south</span>
    <span v-if='idx>0' class="material-icons" @click='move(idx,-1)'>north</span>
    <span class="material-icons" @click='playChord(selected)'>play_circle</span>
    <span class="material-icons"  @click='playChord(selected,true)'>play_circle_outline</span>
    <br>
    <accordion :size='24'  :selected='selected' @note='noteClicked($event)' ></accordion>

    <!-- {{selected}} -->
        </span>
        <pre>{{stack}}</pre>
    <!-- <accordion v-for='size in [20]' griff='b-system' :size='size'  :selected='selected' ></accordion> -->
 <!-- <accordion v-for='size in [10,20,45,70,100,150,250,450]' :size='size'  :selected='selected' ></accordion> -->
</div>
`

var initial_chords = samples.ipanema;

export var chordapp = Vue.component('chordapp', {
  template,
  components: {
    accordion
  },
  data() { return {
    ready: false,
    name: 'untitled',
    selected: [...initial_chords[0]],
    stack: initial_chords,
    showkeyboard: true,
    } 
  },
  methods: {
      savedSets() {
          return storage.findChordSets()
      },
      loadSet(setName) {
          this.stack = storage.load(setName);
          this.name = setName;
      },
      save() {
          storage.save(this.stack, this.name);
      },
      noteClicked(ev) {
          util.PlayNotes([ev]);
      },
      reset() {
          this.selected = [];
      },
      doArpeggio() {
          util.PlayNotes(this.selected);
      },
      addToStack() {
          var selected = [...this.selected];
          this.stack.push(selected);
      },
      playChord(chord, arpeggiate) {
          var delay = arpeggiate ? 100 : 0;
          util.PlayNotes(chord, delay)
      },
      deleteChord(idx) {
          this.stack.splice(idx,1);
      },
      transpose(direction) {
          this.selected = util.Transpose(this.selected,direction);
          this.playChord(this.selected, true);
      },
      keydownFn(event) {
          debugger;
      }
  },
  mounted() {
      var thisCopy = this;
      function remove(arr, elt) {
          while(true) {
              var idx = arr.indexOf(elt);
              if(idx<0)
                  return;
              arr.splice(idx,1);
          }
      }
      function toggle(arr, elt) {
          if(arr.indexOf(elt)>=0)
              remove(arr,elt);
          else
              arr.push(elt);
      }
      $(document).on('keydown',function(event) {
          var tabIndex = event.target.tabIndex;
          if(tabIndex != 0)
              return;
          console.log(event.key);
          var note = util.GetNoteFromKey(event.key);
          if(!note)
              return;
          util.PlayNotes([note]);
//                        thisCopy.selected.push(note);
          toggle(thisCopy.selected,note);
      });

      $(document).on('keyup', function(event) {
          var tabIndex = event.target.tabIndex;
          if(tabIndex != 0)
              return;
          // console.log(note);
          var note = util.GetNoteFromKey(event.key);
          if(!note)
              return;
          if(!event.shiftKey)
              remove(thisCopy.selected,note);
      });
  }
});

