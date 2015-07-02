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
    if (confirm('Are you sure?')) {
      canvas.clear();
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



  $scope.getFreeDrawingMode = function() {
    return canvas.isDrawingMode;
  };




  $scope.setFreeDrawingMode = function(value) {
    canvas.isDrawingMode = !!value;
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


  $scope.jsfeat_canny = function() {

      var demo_opt = function () {
          this.blur_radius = 2;
          this.low_threshold = 20;
          this.high_threshold = 50;

      };
      if (gui_canny.is(':hidden')) {
          options = new demo_opt();
          $scope.jsfeat_gui_canny.add(options, 'blur_radius', 0, 4).step(1);
          $scope.jsfeat_gui_canny.add(options, 'low_threshold', 1, 127).step(1);
          $scope.jsfeat_gui_canny.add(options, 'high_threshold', 1, 127).step(1);
          gui_canny.show()
      }
      var ctx, canvasWidth, canvasHeight;
      var img_u8;
      canvas.deactivateAll().renderAll();
      canvasWidth = output_canvas.width;
      canvasHeight = output_canvas.height;
      ctx = output_canvas.getContext('2d');
      ctx.fillStyle = "rgb(0,255,0)";
      ctx.strokeStyle = "rgb(0,255,0)";
      img_u8 = new jsfeat.matrix_t(canvasHeight, canvasWidth, jsfeat.U8C1_t);
      ctx = document.getElementById('canvas').getContext('2d');
      var imageData = ctx.getImageData(0, 0, canvasHeight, canvasWidth);
      jsfeat.imgproc.grayscale(imageData.data, img_u8.data);
      var r = options.blur_radius | 0;
      var kernel_size = (r + 1) << 1;
      jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);
      jsfeat.imgproc.canny(img_u8, img_u8, options.low_threshold | 0, options.high_threshold | 0);
      // render result back to canvas
      var data_u32 = new Uint32Array(imageData.data.buffer);
      var alpha = (0xff << 24);
      var i = img_u8.cols * img_u8.rows, pix = 0;
      while (--i >= 0) {
          pix = img_u8.data[i];
          data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
      }
      output_canvas.getContext('2d').putImageData(imageData, 0, 0);
  };

$scope.segmentation_slic = function() {

  var ctx, canvasWidth, canvasHeight;
  var slic_opt = function () {
    this.regionSize = 40;
    this.minSize = 20;
    };
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
    if (gui_slic.is(':hidden')){
        slic_options = new slic_opt();
        $scope.jsfeat_gui_slic.add(slic_options, "regionSize", 20, 400);
        $scope.jsfeat_gui_slic.add(slic_options, "minSize", 2, 100);
        gui_slic.show()
    }
    canvas.deactivateAll().renderAll();
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, canvasHeight, canvasWidth);
    slic_options.callback = callback;
    SLICSegmentation(imageData,slic_options);
    last_algorithm = "slic"
    $('#segment_message').show()
};

$scope.segmentation_pf = function() {

  var ctx, canvasWidth, canvasHeight;
  var pf_opt = function () {
    this.sigma = 0;
    this.threshold = 1000;
    this.minSize = 1000;

    };
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
    if (gui_pf.is(':hidden')){
        pf_options = new pf_opt();
        $scope.jsfeat_gui_pf.add(pf_options, "threshold", 20, 40000);
        $scope.jsfeat_gui_pf.add(pf_options, "sigma", 0, 20);
        $scope.jsfeat_gui_pf.add(pf_options, "minSize", 2, 10000);
        gui_pf.show()
    }
    canvas.deactivateAll().renderAll();
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, canvasHeight, canvasWidth);
    pf_options.callback = callback;
    PFSegmentation(imageData,pf_options);
    last_algorithm = "pf";
    $('#segment_message').show()
};

$scope.jsfeat_yape = function(){

    var yape_opt = function(){
        this.lap_thres = 30;
        this.eigen_thres = 25;
    };
    if (gui_yape.is(':hidden')){
        yape_options = new yape_opt();
        $scope.jsfeat_gui_yape.add(yape_options, "lap_thres", 1, 100);
        $scope.jsfeat_gui_yape.add(yape_options, "eigen_thres", 1, 100);
        gui_yape.show()
    }
    var ctx,img_u8,imageData,corners, i,count,data_u32;
    canvas.deactivateAll().renderAll();
    ctx = output_canvas.getContext('2d');
    ctx.fillStyle = "rgb(0,255,0)";
    ctx.strokeStyle = "rgb(0,255,0)";
    img_u8 = new jsfeat.matrix_t(height, width, jsfeat.U8_t | jsfeat.C1_t);
    imageData = document.getElementById('canvas').getContext('2d').getImageData(0, 0, height, width);
    corners = [];
    i = height*width;
    while(--i >= 0) {
        corners[i] = new jsfeat.point2d_t(0,0,0,0);
    }
    jsfeat.imgproc.grayscale(imageData.data, img_u8.data);
    jsfeat.imgproc.box_blur_gray(img_u8, img_u8, 2, 0);
    jsfeat.yape06.laplacian_threshold = yape_options.lap_thres|0;
    jsfeat.yape06.min_eigen_value_threshold = yape_options.eigen_thres|0;
    count = jsfeat.yape06.detect(img_u8, corners);
    data_u32 = new Uint32Array(imageData.data.buffer);
    results_global.yape = [];
    var pix = (0xff << 24) | (0x00 << 16) | (0xff << 8) | 0x00;
    for(var i=0; i < count; ++i)
    {
        var x = corners[i].x;
        var y = corners[i].y;
        results_global.yape.push(corners[i]);
        var off = (x + y * height);
        data_u32[off] = pix;
        data_u32[off-1] = pix;
        data_u32[off+1] = pix;
        data_u32[off-height] = pix;
        data_u32[off+height] = pix;
    }
    output_canvas.getContext('2d').putImageData(imageData, 0, 0);
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
            rgbData = results_global[last_algorithm].rgbData,
            i_x,i_y;
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
  $scope.jsfeat_gui_pf = jsfeat_gui_pf;
  $scope.jsfeat_gui_canny = jsfeat_gui_canny;
  $scope.jsfeat_gui_yape = jsfeat_gui_yape;
  $scope.jsfeat_gui_slic = jsfeat_gui_slic;
  $scope.canvas = canvas;
  $scope.output_canvas = output_canvas;
  $scope.getActiveStyle = getActiveStyle;
  addAccessors($scope);
  watchCanvas($scope);
});
