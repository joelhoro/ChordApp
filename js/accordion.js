import Vue from '../node_modules/vue/dist/vue.esm.browser.js';
import  '../node_modules/underscore/underscore-min.js';
import {util} from './util.js';

var Griffs = {
          'c-system' : (i,j) => 3*i+j*2+2,
          'b-system' : (i,j) => 3*i+j+2,
        }

var numberOfCols = 21;
var numberOfRows = 5;

Vue.component('accordion', {
    template: `<span @keydown='keyDown($event)'>
    <svg type='accordionkeyboard' :width='21*size' :height='4*size' >
        <g :name='"accordionrow-"+i' v-for='i in columns' :transform='scaleFn()' >
          <g :note='noteFn(i,j)' class='key' 
            :class='{ highlighted: isSelected(i,j), black: black[noteFn(i,j)] }' 
            v-for='j in rows' 
            :transform='translate(-9.5+w*i*0.8+j*w/2+11.2*w,.5+j*w*0.8)'
             @click="$emit('note',fullNoteNames[noteFn(i,j)])"
            >
            <circle :transform='scaleFn(true)' :cx='0' :cy='0' :r='r*scale' stroke=black />
            <text :transform='scaleFn(true)' :class='textClass(scale)' :x='-0.25*scale' :y='0.10*scale'>{{noteNames[noteFn(i,j)]}}</text>
            </g>
        </g>
       </svg></span>
`,
            
// <!-- <text visibility='{{textvisibility}}' class='{{textClassSmall}}' x={{x+0.05*scale}} y={{y+0.3*scale}}>{{position}}</text> -->
    props: {
        size: {type: Number},
        selected: {},
        griff : {default: 'c-system'}
    },
    data: function() {
        return {
            columns: _.range(0,numberOfCols),
            rows: _.range(0,numberOfRows),
            r: 40/100,
            w: 90/100,
            scale: this.size,
            noteFn: Griffs[this.griff],
            noteHighlighted: {},
            black: util.black,
            noteNames: util.noteNames,
            fullNoteNames: util.fullNoteNames,
        }
    },
    methods: {
        isSelected(i,j) {
            var note = this.noteFn(i,j);
            return this.selected.indexOf(this.fullNoteNames[note])>=0;
        },
        translate(x,y) {
            return `translate(${x},${y})`;
        },
        scaleFn(invert) {
            return `scale(${invert? 1/this.scale : this.scale})`;
        },
     textClass(scale) {
       if(scale >= 150)
          return "accordion-key-xl";
        else if(scale >= 100)
          return "accordion-key-lg";
        else if(scale >= 50)
          return "accordion-key";
        else if(scale > 30)
          return "accordion-key-sm";
        else if(scale > 10)
          return "accordion-key-xs";
        else
          return "accordion-key-xxs";
    },


    }
});
