function getActiveStyle(styleName, object) {
  object = object || canvas.getActiveObject();
  if (!object) return '';

  return (object.getSelectionStyles && object.isEditing)
    ? (object.getSelectionStyles()[styleName] || '')
    : (object[styleName] || '');
}

function setActiveStyle(styleName, value, object) {
  object = object || canvas.getActiveObject();
  if (!object) return;

  if (object.setSelectionStyles && object.isEditing) {
    var style = { };
    style[styleName] = value;
    object.setSelectionStyles(style);
    object.setCoords();
  }
  else {
    object[styleName] = value;
  }

  object.setCoords();
  canvas.renderAll();
}

function getActiveProp(name) {
  var object = canvas.getActiveObject();
  if (!object) return '';
  return object[name] || '';
}

function setActiveProp(name, value) {
  var object = canvas.getActiveObject();
  if (!object) return;
  object.set(name, value).setCoords();
  canvas.renderAll();
}

function addAccessors($scope) {

  $scope.getOpacity = function() {
    return getActiveStyle('opacity') * 100;
  };
  $scope.setOpacity = function(value) {
    setActiveStyle('opacity', parseInt(value, 10) / 100);
  };

  $scope.confirmClear = function() {
    if (confirm('Remove everything including images. Are you sure?')) {
      canvas.clear();
    }
  };

  $scope.confirmClearMasks = function() {
    if (confirm('Remove all masks. Are you sure?')) {
        canvas.forEachObject(function(obj){
            if (!obj.isType('image')){
                obj.remove()
            }
        });
    }
  };

  $scope.getFill = function() {
    return getActiveStyle('fill');
  };
  $scope.setFill = function(value) {
    setActiveStyle('fill', value);
  };







  $scope.getBgColor = function() {
    return getActiveProp('backgroundColor');
  };
  $scope.setBgColor = function(value) {
    setActiveProp('backgroundColor', value);
  };


  $scope.getStrokeColor = function() {
    return getActiveStyle('stroke');
  };
  $scope.setStrokeColor = function(value) {
    setActiveStyle('stroke', value);
  };

  $scope.getStrokeWidth = function() {
    return getActiveStyle('strokeWidth');
  };
  $scope.setStrokeWidth = function(value) {
    setActiveStyle('strokeWidth', parseInt(value, 10));
  };





  $scope.toggleConsole = function(value) {
      if ($scope.js_console.style){
          $('#execute-code').toggle()
      }
  };

  $scope.getCanvasBgColor = function() {
    return canvas.backgroundColor;
  };

  $scope.setCanvasBgColor = function(value) {
    canvas.backgroundColor = value;
    canvas.renderAll();
  };

  $scope.addRect = function() {
    var coord = getRandomLeftTop();

    canvas.add(new fabric.Rect({
      left: coord.left,
      top: coord.top,
      fill: '#' + getRandomColor(),
      width: 50,
      height: 50,
      opacity: 0.5
    }));
  };

  $scope.addCircle = function() {
    var coord = getRandomLeftTop();

    canvas.add(new fabric.Circle({
      left: coord.left,
      top: coord.top,
      fill: '#' + getRandomColor(),
      radius: 50,
      opacity: 0.8
    }));
  };

  $scope.addTriangle = function() {
    var coord = getRandomLeftTop();

    canvas.add(new fabric.Triangle({
      left: coord.left,
      top: coord.top,
      fill: '#' + getRandomColor(),
      width: 50,
      height: 50,
      opacity: 0.8
    }));
  };

  $scope.addLine = function() {
    var coord = getRandomLeftTop();

    canvas.add(new fabric.Line([ 50, 100, 200, 200], {
      left: coord.left,
      top: coord.top,
      stroke: '#' + getRandomColor()
    }));
  };


  $scope.save = function() {
    if (!fabric.Canvas.supports('toDataURL')) {
      alert('This browser doesn\'t provide means to serialize canvas to an image');
    }
    else {
      $.post( "/Gallery", { "atoken":FB.getAccessToken(),"email":email, "s3key":s3key, "image": canvas.toDataURL('png'),'json':""}).done(
          function(data) {
              alert(data);
            });
        } // JSON.stringify(canvas.toDatalessJSON())
  };



  $scope.rasterize = function() {
    if (!fabric.Canvas.supports('toDataURL')) {
      alert('This browser doesn\'t provide means to serialize canvas to an image');
    }
    else {
      window.open(canvas.toDataURL('png'));
    }
  };

  $scope.getSelected = function() {
    return canvas.getActiveObject() || canvas.getActiveGroup();
  };

  $scope.removeSelected = function() {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeGroup) {
      var objectsInGroup = activeGroup.getObjects();
      canvas.discardActiveGroup();
      objectsInGroup.forEach(function(object) {
        canvas.remove(object);
      });
    }
    else if (activeObject) {
      canvas.remove(activeObject);
    }
  };


  $scope.sendBackwards = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendBackwards(activeObject);
    }
  };

  $scope.sendToBack = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendToBack(activeObject);
    }
  };

  $scope.bringForward = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.bringForward(activeObject);
    }
  };

  $scope.bringToFront = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.bringToFront(activeObject);
    }
  };




  $scope.execute = function() {
    if (!(/^\s+$/).test(consoleValue)) {
      eval(consoleValue);
    }
  };





  function initCustomization() {
    if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
      fabric.Object.prototype.cornerSize = 30;
    }
    fabric.Object.prototype.transparentCorners = false;
    if (document.location.search.indexOf('guidelines') > -1) {
      initCenteringGuidelines(canvas);
      initAligningGuidelines(canvas);
    }
  }
  initCustomization();



  $scope.getFreeDrawingMode = function(mode) {
      if (mode){
        return canvas.isDrawingMode == false || mode != current_mode ? false : true;
      }
      else{
          return canvas.isDrawingMode
      }

  };




  $scope.setFreeDrawingMode = function(value,mode) {
    canvas.isDrawingMode = !!value;
    canvas.freeDrawingBrush.color = mode == 1 ? 'green': 'red';
    canvas.freeDrawingBrush.width = 5;
    current_mode = mode;
    canvas.deactivateAll().renderAll();
    $scope.$$phase || $scope.$digest();
  };

  $scope.freeDrawingMode = 'Pencil';

  $scope.getDrawingMode = function() {
    return $scope.freeDrawingMode;
  };

  $scope.setDrawingMode = function(type) {
    $scope.freeDrawingMode = type;
    $scope.$$phase || $scope.$digest();
  };

  $scope.getDrawingLineWidth = function() {
    if (canvas.freeDrawingBrush) {
      return canvas.freeDrawingBrush.width;
    }
  };

  $scope.setDrawingLineWidth = function(value) {
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = parseInt(value, 10) || 1;
    }
  };

  $scope.getDrawingLineColor = function() {
    if (canvas.freeDrawingBrush) {
      return canvas.freeDrawingBrush.color;
    }
  };
  $scope.setDrawingLineColor = function(value) {
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = value;
    }
  };


  $scope.duplicate = function(){
    var obj = fabric.util.object.clone(canvas.getActiveObject());
        obj.set("top", obj.top+12);
        obj.set("left", obj.left+9);
        canvas.add(obj);
  };

  $scope.jsoneditor_download = function(){
    data = "data:application/octet-stream;charset=utf-8," + JSON.stringify(editor.get()); window.open(data);
  };



  $scope.load_image = function(){
    var input, file, fr, img;
    input = document.getElementById('imgfile');
    input.click();
  };

$scope.updateCanvas = function () {
    fabric.Image.fromURL(output_canvas.toDataURL('png'), function(oImg) {
        canvas.add(oImg);
    });
};



$scope.segmentation_slic = function() {
  var callback  = function(results){
            var context = output_canvas.getContext('2d');
            var segments = {};
            var imageData = context.createImageData(output_canvas.width, output_canvas.height);
            var data = imageData.data;
            var w = output_canvas.width,h= output_canvas.height;
            for (var i = 0; i < results.indexMap.length; ++i) {
                var value = results.indexMap[i];
                if (!segments.hasOwnProperty(value))
                {
                    segments[value] = {
                        'r':(results.indexMap[i]*5)%255,
                        'g':(results.indexMap[i]*25)%255,
                        'b':(results.indexMap[i]*85)%255,
                        'min_pixel':i,
                        'max_pixel':i,
                        'min_x':w+1,
                        'min_y':h+1,
                        'max_x':-1,
                        'max_y':-1
                        }
                }
                    data[4 * i + 0] = (results.indexMap[i]*5)%255;
                    data[4 * i + 1] = (results.indexMap[i]*25)%255;
                    data[4 * i + 2] = (results.indexMap[i]*85)%255;
                    data[4 * i + 3] = 255;
                    segments[value].max_pixel = i;
                    var y = Math.floor(i/w),
                        x = (i % w);
                    if (x > segments[value].max_x){
                        segments[value].max_x = x
                    }
                    if (x < segments[value].min_x){
                        segments[value].min_x = x
                    }
                    if (y > segments[value].max_y){
                        segments[value].max_y = y
                    }
                    if (y < segments[value].min_y){
                        segments[value].min_y = y
                    }
            }
            results_global.slic = {indexMap:results.indexMap,segments:segments,rgbData:results.rgbData};
            context.putImageData(imageData, 0, 0);
        };
    slic_options.callback = callback;
    $scope.refreshData();
    SLICSegmentation(canvas_data.imageData,slic_options);
    last_algorithm = "slic";
    $('#segment_message').show()
};

$scope.segmentation_pf = function() {
  var callback  = function(results){
            var context = output_canvas.getContext('2d');
            var imageData = context.createImageData(output_canvas.width, output_canvas.height);
            var data = imageData.data;
            var segments = {};
            var w = output_canvas.width,h= output_canvas.height;
            for (var i = 0; i < results.indexMap.length; ++i) {
                var value = results.indexMap[i];
                if (!segments.hasOwnProperty(value))
                {
                    segments[value] = {
                        'r':(results.indexMap[i]*5)%255,
                        'g':(results.indexMap[i]*25)%255,
                        'b':(results.indexMap[i]*85)%255,
                        'min_pixel':i,
                        'max_pixel':i,
                        'min_x':w+1,
                        'min_y':h+1,
                        'max_x':-1,
                        'max_y':-1
                        }
                }
                    data[4 * i + 0] = (results.indexMap[i]*5)%255;
                    data[4 * i + 1] = (results.indexMap[i]*25)%255;
                    data[4 * i + 2] = (results.indexMap[i]*85)%255;
                    data[4 * i + 3] = 255;
                    segments[value].max_pixel = i;
                    var y = Math.floor(i/w),
                        x = (i % w);
                    if (x > segments[value].max_x){
                        segments[value].max_x = x
                    }
                    if (x < segments[value].min_x){
                        segments[value].min_x = x
                    }
                    if (y > segments[value].max_y){
                        segments[value].max_y = y
                    }
                    if (y < segments[value].min_y){
                        segments[value].min_y = y
                    }
            }
            results_global.pf = {indexMap:results.indexMap,segments:segments,rgbData:results.rgbData};
            context.putImageData(imageData, 0, 0);
        };
    pf_options.callback = callback;
    $scope.refreshData();
    PFSegmentation(canvas_data.imageData,pf_options);
    last_algorithm = "pf";
    $('#segment_message').show()
};

$scope.refreshData = function(){
    var maskData, imageData;
    canvas.deactivateAll().renderAll();
    canvas.forEachObject(function(obj){
        if (!obj.isType('image')){
            obj.opacity = 0;
        }
    });
    canvas.renderAll();
    ctx = canvas.getContext('2d');
    imageData = ctx.getImageData(0, 0, height, width);
    canvas.forEachObject(function(obj){
        if (!obj.isType('image')){
            obj.opacity = 1.0;
        }
        else{
            obj.opacity = 0;
        }
    });
    maskData = ctx.getImageData(0, 0, height, width);
    canvas.forEachObject(function(obj){
        if (obj.isType('image'))
        {
            obj.opacity = 1.0;
        }
    });
    canvas.renderAll();
    canvas_data = {'maskData':maskData, 'imageData':imageData}
};


$scope.addOnClick = function(event) {
		if ( event.layerX ||  event.layerX == 0) { // Firefox
			mouseX = event.layerX ;
			mouseY = event.layerY;
		} else if (event.offsetX || event.offsetX == 0) { // Opera
			mouseX = event.offsetX;
			mouseY = event.offsetY;
		}
        if (last_algorithm)
        {
        var segment = results_global[last_algorithm].segments[results_global[last_algorithm].indexMap[width*mouseY+mouseX]],
            segment_index = results_global[last_algorithm].indexMap[width*mouseY+mouseX],
            c = document.createElement('canvas');
        c.setAttribute('id', '_temp_canvas');
        c.width = segment.max_x - segment.min_x + 1;
        c.height = segment.max_y - segment.min_y + 1;
        var context = c.getContext('2d'),
            imageData = context.createImageData(c.width, c.height),
            data = imageData.data,
            indexMap = results_global[last_algorithm].indexMap,
            rgbData = canvas_data.imageData.data;
        var i_x,i_y;
        k = 0;
        for (var i = 0; i < indexMap.length; ++i)
        {
            i_y = Math.floor(i/width);
            i_x = (i % width);
            if (i_x >= segment.min_x && i_x <= segment.max_x && i_y >= segment.min_y && i_y <= segment.max_y)
            {
                if (segment_index == indexMap[i]){
                        data[4 * k + 0] = rgbData[4 * i + 0];
                        data[4 * k + 1] = rgbData[4 * i + 1];
                        data[4 * k + 2] = rgbData[4 * i + 2];
                        data[4 * k + 3] = 255;
                }
                else
                {
                    data[4 * k + 0] = 0;
                    data[4 * k + 1] = 0;
                    data[4 * k + 2] = 0;
                    data[4 * k + 3] = 0;
                }
                k++;
            }
        }
        context.putImageData(imageData, 0, 0);
        fabric.Image.fromURL(c.toDataURL(), function(img) {
            img.left = segment.min_x;
            img.top = segment.min_y;
            canvas.add(img);
            img.bringToFront();
            c = null;
            $('#_temp_canvas').remove();
            canvas.renderAll();
        });
        }
    }
}

function watchCanvas($scope) {

  function updateScope() {
    $scope.$$phase || $scope.$digest();
    canvas.renderAll();
  }

  canvas
    .on('object:selected', updateScope)
    .on('group:selected', updateScope)
    .on('path:created', updateScope)
    .on('selection:cleared', updateScope);
}

cveditor.controller('CanvasControls', function($scope) {
  $scope.canvas = canvas;
  $scope.output_canvas = output_canvas;
  $scope.getActiveStyle = getActiveStyle;
  addAccessors($scope);
  watchCanvas($scope);
});
