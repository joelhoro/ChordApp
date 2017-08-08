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

    function textClassSmall(scale) {
       if(scale >= 150)
          return "accordion-key-lg";
        else if(scale >= 100)
          return "accordion-key";
        else if(scale >= 50)
          return "accordion-key-sm";
        else if(scale > 30)
          return "accordion-key-xs";
        else
          return "accordion-key-xxs";
    }
  
    var notes = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B" ]; 

    function setNotes($scope) {
      $scope.noteHighlighted = [];

      var selected = JSON.parse($scope.notes)
        .map(util.ChordToInt);
      $scope.noteNames = []; 
      $scope.positions = [];
      $scope.black = [];
      for (var i = 0; i < 90; i++) {
        note = (i+2)%12;
        $scope.noteHighlighted[i] = selected.indexOf(i+2) >= 0;
        $scope.noteNames[i] = notes[note];
        $scope.black[i] = notes[note].length > 1;
      }

    }

    return {
      scope: {
        notes: '@',
        size: '@',
        griff: '@'
      },
      controller: function($scope) {
        console.log("Notes:", $scope.notes);
        var numberOfCols = 21;
        var numberOfRows = 5;

        $scope.columns = _.range(0,numberOfCols);
        $scope.rows = _.range(0,numberOfRows)
        var sizeString = $scope.size || "100";
        $scope.scale = parseFloat(sizeString);
        $scope.textClass = textClass($scope.scale);
        $scope.textClassSmall = textClassSmall($scope.scale);
        
        // console.debug($scope.size);
        $scope.r = 40*$scope.scale/100;
        $scope.w = 90*$scope.scale/100;

        setNotes($scope,$scope.notes);

        $scope.noteFn = util.Griffs[$scope.griff];
        $scope.util = util;

        $scope.textvisibility = 'hidden';
        //$scope.textvisibility = 'visible';

        $scope.$watch('notes',function() { setNotes($scope) } );

      },
      //replace: true,
      template: `
       <svg type='accordionkeyboard' width={{25*size}} height={{6*size}}>
        <g name='accordionrow-{{i}}' ng-repeat='i in columns'  >
          <g note='{{noteNames[position]}}' class='key' ng-class='{ highlighted: noteHighlighted[position], black: black[position] }' ng-repeat='j in rows' 
            ng-init='x=-9.5*scale+w*i+j*w/2+200; y=scale*1+j*w; position=noteFn(i,j)' ng-click='util.clickNote($parent,position)'>
          <circle cx='{{x}}' cy='{{y}}' r={{r}} stroke=black />
          <text class='{{textClass}}' x={{x-0.15*scale}} y={{y+0.10*scale}}>{{noteNames[position]}}</text>
          <text visibility='{{textvisibility}}' class='{{textClassSmall}}' x={{x+0.05*scale}} y={{y+0.3*scale}}>{{position}}</text>
          </g>
        </g>
       </svg>
      `
    };
  });
