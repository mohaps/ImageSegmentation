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

function initialize_smart_eraser(){
      var layer_defs = [];
      layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:3});
      layer_defs.push({type:'conv', sx:5, filters:16, stride:1, pad:2, activation:'relu'});
      layer_defs.push({type:'pool', sx:2, stride:2});
      layer_defs.push({type:'conv', sx:5, filters:20, stride:1, pad:2, activation:'relu'});
      layer_defs.push({type:'pool', sx:2, stride:2});
      layer_defs.push({type:'conv', sx:5, filters:20, stride:1, pad:2, activation:'relu'});
      layer_defs.push({type:'pool', sx:2, stride:2});
      layer_defs.push({type:'softmax', num_classes:1});
      state.net = new convnetjs.Net();
      state.net.makeLayers(layer_defs);
      trainer = new convnetjs.SGDTrainer(net, {method:'adadelta', batch_size:4, l2_decay:0.0001});
}



function addAccessors($scope) {

  $scope.getOpacity = function() {
    return getActiveStyle('opacity') * 100;
  };
  $scope.setOpacity = function(value) {
    setActiveStyle('opacity', parseInt(value, 10) / 100);
  };

  $scope.getScale = function() {
    return (getActiveStyle('scaleX')+getActiveStyle('scaleY')) * 50;
  };
  $scope.setScale = function(value) {
    setActiveStyle('scaleX', parseInt(value, 10) / 100);
    setActiveStyle('scaleY', parseInt(value, 10) / 100);
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
    state.masks_present = false;
    }
  };

  $scope.showTour = function(){
      hopscotch.startTour(tour);
  };

  $scope.showDev = function(){
      $scope.dev = !$scope.dev;
  };

  $scope.getDev = function(){
      return $scope.dev
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

  $scope.getCanvasBgColor = function() {
    return canvas.backgroundColor;
  };

  $scope.setCanvasBgColor = function(value) {
    canvas.backgroundColor = value;
    canvas.renderAll();
  };


$scope.export = function() {
    if (!fabric.Canvas.supports('toDataURL')) {
      alert('This browser doesn\'t provide means to serialize canvas to an image');
    }
    else {
      fabric.Image.fromURL(output_canvas.toDataURL(), function(img) {
            canvas.add(img);
            img.bringToFront();
            canvas.renderAll();
            state.recompute = true;
        });
    }
  };


  $scope.download = function() {
    if (!fabric.Canvas.supports('toDataURL')) {
      alert('This browser doesn\'t provide means to serialize canvas to an image');
    }
    else {
      window.open(output_canvas.toDataURL('png'));
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
        return canvas.isDrawingMode == false || mode != $scope.current_mode ? false : true;
      }
      else{
          return canvas.isDrawingMode
      }

  };

mover_cursor = function(options) {yax.css({'top': options.e.y + delta_top,'left': options.e.x + delta_left});};


  $scope.setFreeDrawingMode = function(value,mode) {
    canvas.isDrawingMode = !!value;
    canvas.freeDrawingBrush.color = mode == 1 ? 'green': 'red';
    if (value && mode == 1){
        $scope.status = "Drawing foreground, click segment to update results."
    }else if(value){
        $scope.status = "Drawing background, click segment to update results."
    }
    if(canvas.isDrawingMode){
        yax.show();
        canvas.on('mouse:move',mover_cursor);
    }
   else{
        yax.hide();
        canvas.off('mouse:move',mover_cursor);
    }
    canvas.freeDrawingBrush.width = 5;
    $scope.current_mode = mode;
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


  $scope.load_image = function(){
    var input, file, fr, img;
    state.recompute = true;
    input = document.getElementById('imgfile');
    input.click();
  };

$scope.updateCanvas = function () {
    fabric.Image.fromURL(output_canvas.toDataURL('png'), function(oImg) {
        canvas.add(oImg);
    });
};

$scope.labelUnknown = function(){
    for(var s in state.results.unknown) {
        seg = state.results.unknown[s];
    }
};

$scope.labelMixed = function(){
    for(var s in state.results.mixed) {
        seg = state.results.mixed[s];
    }
};

$scope.updateClusters = function(){
    var mask = state.mask_data.data,
        segments = state.results.segments,
        indexMap = state.results.indexMap;
    state.results.unknown = [];
    state.results.mixed = [];
    state.results.foreground = [];
    state.results.background = [];
    for(var s in segments) {
        seg = segments[s];
        seg.mask.f = 0;
        seg.mask.b = 0;
    }

    for (var i = 0; i < indexMap.length; ++i) {
        var value = indexMap[i];
            if (mask[4 * i + 0] == 0 && mask[4 * i + 1] == 128)
            {
                segments[value].mask.f++;
            }
            if (mask[4 * i + 0] > 0 && mask[4 * i + 1] == 0)
            {
                segments[value].mask.b++;
            }
    }
    for(var s in segments){
        seg = segments[s];
        if (seg.mask.f > 0 && seg.mask.b == 0){
            seg.foreground = true;
            seg.unknown = false;
            seg.mixed = false;
            state.results.foreground.push(seg)
        }
        else if (seg.mask.b > 0 && seg.mask.f == 0){
            seg.foreground = false;
            seg.unknown = false;
            seg.mixed = false;
            state.results.background.push(seg)
        }
        else if (seg.mask.b > 0 && seg.mask.f > 0){
            seg.foreground = false;
            seg.unknown = false;
            seg.mixed = true;
            state.results.mixed.push(seg)
        }
        else{
            seg.foreground = false;
            seg.unknown = true;
            seg.mixed = false;
            state.results.unknown.push(seg)

        }
    }
};

$scope.renderSuperpixels = function(){
    var results = state.results;
    var context = output_canvas.getContext('2d');
    var imageData = context.createImageData(output_canvas.width, output_canvas.height);
    var data = imageData.data;
    for (var i = 0; i < results.indexMap.length; ++i) {
            data[4 * i + 0] = (results.indexMap[i]*5)%255;
            data[4 * i + 1] = (results.indexMap[i]*25)%255;
            data[4 * i + 2] = (results.indexMap[i]*85)%255;
            data[4 * i + 3] = 255;
    }
    context.putImageData(imageData, 0, 0);
};

$scope.renderMixed = function(){
    var results = state.results;
    var context = output_canvas.getContext('2d');
    var imageData = context.createImageData(output_canvas.width, output_canvas.height);
    var data = imageData.data;
    for (var i = 0; i < results.indexMap.length; ++i) {
        if (results.segments[results.indexMap[i]].mixed)
        {
            data[4 * i + 0] = results.rgbData[4 * i + 0];
            data[4 * i + 1] = results.rgbData[4 * i + 1];
            data[4 * i + 2] = results.rgbData[4 * i + 2];
            data[4 * i + 3] = 255;
        }
        else{
            data[4 * i + 3] = 0;
        }
    }
    context.putImageData(imageData, 0, 0);

};

$scope.renderUnknown = function(){
    var results = state.results;
    var context = output_canvas.getContext('2d');
    var imageData = context.createImageData(output_canvas.width, output_canvas.height);
    var data = imageData.data;
    for (var i = 0; i < results.indexMap.length; ++i) {
        if (results.segments[results.indexMap[i]].unknown)
        {
            data[4 * i + 0] = results.rgbData[4 * i + 0];
            data[4 * i + 1] = results.rgbData[4 * i + 1];
            data[4 * i + 2] = results.rgbData[4 * i + 2];
            data[4 * i + 3] = 255;
        }
        else{
            data[4 * i + 3] = 0;
        }
    }
    context.putImageData(imageData, 0, 0);
};

var callbackSegmentation  = function(results){
        results.segments = {};

        var w = width,
            h = height;
            l = results.indexMap.length;
        for (var i = 0; i < l; ++i) {
            var current = results.indexMap[i];
            if (!results.segments.hasOwnProperty(current))
            {
                results.segments[current] = {
                    'min_pixel':i,
                    'max_pixel':i,
                    'min_x':w+1,
                    'min_y':h+1,
                    'max_x':-1,
                    'max_y':-1,
                    'mask':{'b':0,'f':0},
                    'neighbors':new Uint32Array(results.size)
                    }
            }
            var y = Math.floor(i/w), x = (i % w);
            if (i != x + y*w)
            {
                console.log(["Error?",i,x + y*w])
            }
            if (x > 0 && y > 0 && x < w-1 && y < h-1){ // Ignoring all pixels on the image border
                if (i+1 < l )
                {
                    results.segments[current].neighbors[results.indexMap[i+1]] += 1
                }
                if (i-1 > 0)
                {
                    results.segments[current].neighbors[results.indexMap[i-1]] += 1
                }
                n = x + (y+1)*w;
                if (n >= 0 && n < l)
                {
                    results.segments[current].neighbors[results.indexMap[n]] += 1
                }
                n = x + 1 + (y+1)*w;
                if (n >= 0 && n < l)
                {
                    results.segments[current].neighbors[results.indexMap[n]] += 1
                }
                n = x - 1 + (y+1)*w;
                if (n >= 0 && n < l)
                {
                    results.segments[current].neighbors[results.indexMap[n]] += 1
                }
                n = x + (y-1)*w;
                if (n >= 0 && n < l)
                {
                    results.segments[current].neighbors[results.indexMap[n]] += 1
                }
                n = x + 1 + (y-1)*w;
                if (n >= 0 && n < l)
                {
                    results.segments[current].neighbors[results.indexMap[n]] += 1
                }
                n = x - 1 + (y-1)*w;
                if (n >= 0 && n < l)
                {
                    results.segments[current].neighbors[results.indexMap[n]] += 1
                }
            }
            results.segments[current].max_pixel = i;
            if (x > results.segments[current].max_x){
                results.segments[current].max_x = x
            }
            if (x < results.segments[current].min_x){
                results.segments[current].min_x = x
            }
            if (y > results.segments[current].max_y){
                results.segments[current].max_y = y
            }
            if (y < results.segments[current].min_y){
                results.segments[current].min_y = y
            }
        }
        for(var s in results.segments){
            results.segments[s].edges = {};
            for(var k in results.segments[s].neighbors){
                if(results.segments[s].neighbors[k] > 0 && k != s)
                    results.segments[s].edges[k] = results.segments[s].neighbors[k]
            }
        }
        state.results = results;
};

$scope.deselect = function(){
    canvas.deactivateAll().renderAll();
    $scope.$$phase || $scope.$digest();
};



$scope.renderResults = function(){
    var results = state.results;
    var context = output_canvas.getContext('2d');
    var imageData = context.createImageData(output_canvas.width, output_canvas.height);
    var data = imageData.data;
    for (var i = 0; i < results.indexMap.length; ++i) {
        if (results.segments[results.indexMap[i]].foreground)
        {
            data[4 * i + 0] = results.rgbData[4 * i + 0];
            data[4 * i + 1] = results.rgbData[4 * i + 1];
            data[4 * i + 2] = results.rgbData[4 * i + 2];
            data[4 * i + 3] = 255;
        }
        else{
            data[4 * i + 3] = 0;
        }
        //data[4 * i + 0] = (results.indexMap[i]*5)%255;
        //data[4 * i + 1] = (results.indexMap[i]*25)%255;
        //data[4 * i + 2] = (results.indexMap[i]*85)%255;
    }
    context.putImageData(imageData, 0, 0);
};




$scope.refreshData = function(){
    if (state.recompute){
        canvas.deactivateAll().renderAll();
        canvas.forEachObject(function(obj){
            if (!obj.isType('image')){
                obj.opacity = 0;
            }
        });
        canvas.renderAll();
        state.canvas_data = canvas.getContext('2d').getImageData(0, 0, height, width);
    }
    else{
        console.log("did not recompute")
    }
    canvas.forEachObject(function(obj){
        if (!obj.isType('image')){
            obj.opacity = 1.0;
        }
        else{
            obj.opacity = 0;
        }
    });
    canvas.renderAll();
    state.mask_data = canvas.getContext('2d').getImageData(0, 0, height, width);
    canvas.forEachObject(function(obj){
        if (obj.isType('image'))
        {
            obj.opacity = 1.0;
        }
        else{
            obj.opacity = 0.6;
        }
    });
    canvas.renderAll();
};

$scope.checkStatus = function(){
    return $scope.status;
};

$scope.disableStatus = function(){
    $scope.status = "";
};

$scope.check_movement = function(){
    // set image positions or check them
    if ($scope.dev){
        // Always recompute if dev mode is enabled.
        state.recompute = true;
    }
    canvas.forEachObject(function(obj){
        if (!obj.isType('image')){
            state.masks_present = true;
        }
    });
    old_positions_joined = state.images.join();
    state.images = [];
    canvas.forEachObject(function(obj){
        if (obj.isType('image')){
            state.images.push([obj.scaleX,obj.scaleY,obj.top,obj.left,obj.opacity])
        }
    });
    if(!state.recompute) // if recompute is true let it remain true.
    {
        state.recompute = state.images.join() != old_positions_joined;
    }
};


$scope.segment = function () {
    $scope.setFreeDrawingMode(false,$scope.current_mode);
    $scope.check_movement();
    if (state.masks_present) {
        $scope.status = "Starting segementation";
        if(canvas.isDrawingMode){
            canvas.isDrawingMode = false;
            canvas.deactivateAll().renderAll();
        }
        $scope.$$phase || $scope.$digest();
        $scope.refreshData();
        if (state.recompute)
        {
            state.options.slic.callback = callbackSegmentation;
            SLICSegmentation(state.canvas_data, state.mask_data, state.options.slic);
            console.log("recomputing segmentation")
        }
        else{
            console.log("Did not recompute, using previously computed superpixels.")
        }
        $scope.updateClusters();
        $scope.renderResults();
        $scope.status = "Segmentation completed";
        state.recompute = false;
    }
    else {
        $scope.status = "Please mark background and foreground !! "
    }
};



$scope.addOnClick = function(event) {
		if ( event.layerX ||  event.layerX == 0) { // Firefox
			mouseX = event.layerX ;
			mouseY = event.layerY;
		} else if (event.offsetX || event.offsetX == 0) { // Opera
			mouseX = event.offsetX;
			mouseY = event.offsetY;
		}
        if (state.results)
        {
        var segment = state.results.segments[state.results.indexMap[width*mouseY+mouseX]],
            segment_index = state.results.indexMap[width*mouseY+mouseX],
            c = document.createElement('canvas');
        c.setAttribute('id', '_temp_canvas');
        c.width = segment.max_x - segment.min_x + 1;
        c.height = segment.max_y - segment.min_y + 1;
        var context = c.getContext('2d'),
            imageData = context.createImageData(c.width, c.height),
            data = imageData.data,
            indexMap = state.results.indexMap,
            rgbData = state.canvas_data.data;
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
  $scope.yax = $('#yaxis');
  delta_left = $('#output_canvas').offset().left - $('#canvas').offset().left;
  delta_top = $('#output_canvas').offset().top - $('#canvas').offset().top;
  $scope.canvas = canvas;
  $scope.output_canvas = output_canvas;
  $scope.getActiveStyle = getActiveStyle;
  $scope.dev = false;
  $scope.status = "Note: Images are not uploaded to server, all processing is performed within the browser.";
  $scope.current_mode = null;
  addAccessors($scope);
  watchCanvas($scope);
});
