angular.module('chordApp')
  .directive('accordionKeyboard', function(util) {
  
    function textClass(scale) {
       if(scale >= 150)
          return "accordion-key-xl";
        else if(scale >= 100)
          return "accordion-key-lg";
        else if(scale >= 50)
          return "accordion-key";
        else if(scale > 30)
          return "accordion-key-sm";
        else
          return "accordion-key-xs";
    }
  
    var notes = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B" ]; 

    return {
      scope: {
        notes: '@',
        size: '@',
        griff: '@'
      },
      controller: function($scope) {

        var numberOfCols = 21;

        $scope.range = _.range(0,numberOfCols);
        var sizeString = $scope.size || "100";
        $scope.scale = parseFloat(sizeString);
        $scope.textClass = textClass($scope.scale);
        
        // console.debug($scope.size);
        $scope.r = 40*$scope.scale/100;
        $scope.w = 90*$scope.scale/100;
        $scope.noteHighlighted = [];

        var selected = JSON.parse($scope.notes)
          .map(n => util.ChordToInt(n));
        $scope.noteNames = []; 
        $scope.positions = [];
        $scope.black = [];
        for (var i = 0; i < 90; i++) {
          note = (i+2)%12;
          $scope.noteHighlighted[i] = selected.indexOf(i+2) >= 0;
          $scope.noteNames[i] = notes[note];
          $scope.black[i] = notes[note].length > 1;
        }

        $scope.noteFn = util.Griffs[$scope.griff];
        $scope.test = util.test;
      },
      //replace: true,
      template: `
       <svg type='accordionkeyboard' width={{25*size}} height={{6*size}}>
        <g name='accordionrow-{{i}}' ng-repeat='i in range'  >
          <g note='{{noteNames[position]}}' class='key' ng-class='{ highlighted: noteHighlighted[position], black: black[position] }' ng-repeat='j in [0,1,2,3,4]' 
            ng-init='x=-9.5*scale+w*i+j*w/2+200; y=scale*1+j*w; position=noteFn(i,j)' ng-click='test(notes,position)'>
          <circle cx='{{x}}' cy='{{y}}' r={{r}} stroke=black />
          <text class='{{textClass}}' x={{x-0.15*scale}} y={{y+0.10*scale}}>{{noteNames[position]}}</text>
          </g>
        </g>
       </svg>
      `
    };
  });
