'use strict';

/* Directives */

var appDirectives = angular.module('appDirectives', []);

appDirectives.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog" role="document">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).appendTo("body").modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
          	scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
});

appDirectives.directive('pwCheck', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        elem.add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
}]);

appDirectives.directive('ngModelOnblur', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 1, // needed for angular 1.2.x
        link: function(scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.unbind('input').unbind('keydown').unbind('change');
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(elm.val());
                });         
            });
        }
    };
});
 
appDirectives.directive("ngFileSelect",function(){

  return {
    link: function($scope,el){
      
      el.bind("change", function(e){
      
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      })
      
    }
    
  }
   
});

appDirectives.directive('scrollup', function ($document) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                elm.bind("click", function () {

                    // Maybe abstract this out in an animation service:
                    // Ofcourse you can replace all this with the jQ 
                    // syntax you have above if you are using jQ
                    function scrollToTop(element, to, duration) {
                        if (duration < 0) return;
                        var difference = to - element.scrollTop;
                        var perTick = difference / duration * 10;

                        setTimeout(function () {
                            element.scrollTop = element.scrollTop + perTick;
                            scrollToTop(element, to, duration - 10);
                        }, 10);
                    }

                    // then just add dependency and call it
                    scrollToTop($document[0].body, 0, 400);
                });
            }
        };
});

appDirectives.directive('zoom', function(){
    function link(scope, element, attrs){
      var $ = angular.element;
      var original = $(element[0].querySelector('.original'));
      var originalImg = original.find('img');
      var zoomed = $(element[0].querySelector('.zoomed'));
      var zoomedImg = zoomed.find('img');

      var mark = $('<div></div>')
        .addClass('mark')
        .css('position', 'absolute')
        .css('height', scope.markHeight +'px')
        .css('width', scope.markWidth +'px')

      $(element).append(mark);

      element
        .on('mouseenter', function(evt){
          mark.removeClass('hide');

          var offset = calculateOffset(evt);
          moveMark(offset.X, offset.Y);
        })
        .on('mouseleave', function(evt){
          mark.addClass('hide');
        })
        .on('mousemove', function(evt){
          var offset = calculateOffset(evt);
          moveMark(offset.X, offset.Y);
        });

      scope.$on('mark:moved', function(event, data){
        updateZoomed.apply(this, data);
      });

      function moveMark(offsetX, offsetY){
        var dx = scope.markWidth, 
            dy = scope.markHeight, 
            x = offsetX - dx/2, 
            y = offsetY - dy/2;

        mark
          .css('left', x + 'px')
          .css('top',  y + 'px');

        scope.$broadcast('mark:moved', [
          x, y, dx, dy, originalImg[0].height, originalImg[0].width
        ]);
      }

      function updateZoomed(originalX, originalY, originalDx, originalDy, originalHeight, originalWidth){
        var zoomLvl = scope.zoomLvl;
        scope.$apply(function(){
          zoomed
            .css('height', zoomLvl*originalDy+'px')
            .css('width', zoomLvl*originalDx+'px');
          zoomedImg
            .attr('src', scope.src)
            .css('height', zoomLvl*originalHeight+'px')
            .css('width', zoomLvl*originalWidth+'px')
            .css('left',-zoomLvl*originalX +'px')
            .css('top',-zoomLvl*originalY +'px');
        });
      }

      var rect;
      function calculateOffset(mouseEvent){
        rect = rect || mouseEvent.target.getBoundingClientRect();
        var offsetX = mouseEvent.clientX - rect.left;
        var offsetY = mouseEvent.clientY - rect.top;  

        return { 
          X: offsetX, 
          Y: offsetY
        }
      }

      attrs.$observe('ngSrc', function(data) {
        scope.src = attrs.ngSrc;
      }, true);


      attrs.$observe('zoomLvl', function(data) {
        scope.zoomLvl =  data;;
      }, true);
    }

    return {
      restrict: 'EA',
      scope: {
        markHeight: '@markHeight',
        markWidth: '@markWidth',
        src: '@src', 
        zoomLvl: "@zoomLvl"
      },
      template: [
        '<div class="original">',
          '<img ng-src="{{src}}"/>',
        '</div>',
        '<div class="zoomed">',
          '<img/>',
        '</div>'
      ].join(''),
      link: link
    };
});

appDirectives.directive('fallbackSrc', function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", iAttrs.fallbackSrc);
      });
    }
   }
   return fallbackSrc;
});
appDirectives.directive('exportToCsv',function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            element.bind('click', function(e){
                var table = e.target.nextElementSibling;
                var csvString = '';
                for(var i=0; i<table.rows.length;i++){
                    var rowData = table.rows[i].cells;
                    for(var j=0; j<rowData.length;j++){
                        csvString = csvString + rowData[j].innerHTML + ",";
                    }
                    csvString = csvString.substring(0,csvString.length - 1);
                    csvString = csvString + "";
                }
                csvString = csvString.substring(0, csvString.length - 1);
                var a = $('<a/>', {
                    style:'display:none',
                    href:'data:application/octet-stream;base64,'+btoa(csvString),
                    download:'ListOFSubscribedUsers.csv'
                }).appendTo('body')
                a[0].click()
                a.remove();
            });
        }
    }
});
