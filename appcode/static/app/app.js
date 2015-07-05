/**
 * Created by aub3 on 5/1/15.
 */
var results_global = {};
var canvas = new fabric.Canvas('canvas');
var output_canvas = document.getElementById('output_canvas');
var width = canvas.getWidth(), height = canvas.getHeight();
var last_algorithm,current_mode;
var canvas_data; // Contains serialized image and mask data.
var jsfeat_gui = new dat.GUI({ autoPlace: false });
var gui_element = $("#dat_gui");
var pf_opt = function () {
    this.sigma = 0;
    this.threshold = 1000;
    this.minSize = 1000;
};

var slic_opt = function () {
    this.regionSize = 40;
    this.minSize = 20;
};

var pf_options = new pf_opt(),
    slic_options = new slic_opt();





initial = function() {
    if (document.location.hash !== '#zoom') return;

    function renderVieportBorders() {
      var ctx = canvas.getContext();

      ctx.save();

      ctx.fillStyle = 'rgba(0,0,0,0.1)';

      ctx.fillRect(
        canvas.viewportTransform[4],
        canvas.viewportTransform[5],
        canvas.getWidth() * canvas.getZoom(),
        canvas.getHeight() * canvas.getZoom());

      ctx.setLineDash([5, 5]);

      ctx.strokeRect(
        canvas.viewportTransform[4],
        canvas.viewportTransform[5],
        canvas.getWidth() * canvas.getZoom(),
        canvas.getHeight() * canvas.getZoom());

      // var viewport = canvas.getViewportCenter();
      //console.log(canvas.getZoom(), viewport.x, viewport.y);

      ctx.restore();
    }

    $(canvas.getElement().parentNode).on('wheel mousewheel', function(e) {

      // canvas.setZoom(canvas.getZoom() + e.originalEvent.wheelDelta / 300);

      var newZoom = canvas.getZoom() + e.originalEvent.wheelDelta / 300;
      canvas.zoomToPoint({ x: e.offsetX, y: e.offsetY }, newZoom);

      renderVieportBorders();

      return false;
    });

    var viewportLeft = 0,
        viewportTop = 0,
        mouseLeft,
        mouseTop,
        _drawSelection = canvas._drawSelection,
        isDown = false;

    canvas.on('mouse:down', function(options) {
      isDown = true;

      viewportLeft = canvas.viewportTransform[4];
      viewportTop = canvas.viewportTransform[5];

      mouseLeft = options.e.x;
      mouseTop = options.e.y;

      if (options.e.altKey) {
        _drawSelection = canvas._drawSelection;
        canvas._drawSelection = function(){ };
      }

      renderVieportBorders();
    });

    canvas.on('mouse:move', function(options) {
      if (options.e.altKey && isDown) {
        var currentMouseLeft = options.e.x;
        var currentMouseTop = options.e.y;

        var deltaLeft = currentMouseLeft - mouseLeft,
            deltaTop = currentMouseTop - mouseTop;

        canvas.viewportTransform[4] = viewportLeft + deltaLeft;
        canvas.viewportTransform[5] = viewportTop + deltaTop;

        console.log(deltaLeft, deltaTop);

        canvas.renderAll();
        renderVieportBorders();
      }
    });

    canvas.on('mouse:up', function() {
      canvas._drawSelection = _drawSelection;
      isDown = false;
    });
  };
initial();

(function() {
  fabric.util.addListener(fabric.window, 'load', function() {
    var canvas = this.__canvas || this.canvas,
        canvases = this.__canvases || this.canvases;

    canvas && canvas.calcOffset && canvas.calcOffset();

    if (canvases && canvases.length) {
      for (var i = 0, len = canvases.length; i < len; i++) {
        canvases[i].calcOffset();
      }
    }
  });
})();

$(document).ready(function(){
     $('#imgfile').on("change",function(){
        file = this.files[0];
        fr = new FileReader();
        fr.onload = function () {
            img = new Image();
            img.onload = function () {
                fabric.Image.fromURL(img.src, function (oImg) {
                canvas.add(oImg);
                });
            };
            img.src = fr.result;
        };
        fr.readAsDataURL(file);
    });
    var pf_gui = jsfeat_gui.addFolder('PF Graph Segmentation');
    pf_gui.add(pf_options, "threshold", 20, 40000);
    pf_gui.add(pf_options, "sigma", 0, 20);
    pf_gui.add(pf_options, "minSize", 2, 10000);
    var slic_gui = jsfeat_gui.addFolder('Superpixel Segmentation');
    slic_gui.add(slic_options, "regionSize", 20, 400);
    slic_gui.add(slic_options, "minSize", 2, 100);
    gui_element.append(jsfeat_gui.domElement);
    $('#segment_message').hide();
    var load_options = {crossOrigin:"Anonymous"};
    fabric.Image.fromURL("/static/img/test.png", function(oImg)
    {
        canvas.add(oImg);
    },load_options);
    canvas.backgroundColor = '#ffffff';
    //canvas.add(new fabric.Circle({radius: 80, fill: '#' + getRandomColor(), left: 500, top: 500,opacity: 0.9})
    //);
    $('#bg-color').val('#ffffff')

});


