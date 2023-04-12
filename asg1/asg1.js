var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform float u_Size; ' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = u_Size;\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +  // uniform変数
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';




let canvas;
let gl;
let a_Position;
let u_FragColor;

let u_Size = 25.0;

function setupWebGL(){
    canvas = document.getElementById('webgl');
    gl = canvas.getContext('webgl', {preserveDrawingBuffer:true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}
function connectVariablesToGLSL(){
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

function clearcanvas(){
    g_shapesList = [];
    renderAllShapes();
    canvas = document.getElementById('webgl');
    gl = getWebGLContext(canvas);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectColor = [0.5, 0.5, 0.5, 1.0];
let g_selectSize = u_Size;
let g_selectType = POINT;
let segment = 10;

function changeui(){
    document.getElementById('square').onclick = function (){g_selectType = POINT};
    document.getElementById('triangle').onclick = function (){g_selectType = TRIANGLE};
    document.getElementById('circle').onclick = function (){g_selectType = CIRCLE};


    document.getElementById('color').onclick = function (){g_selectColor[0] = Math.random();
        g_selectColor[1] = Math.random();
        g_selectColor[2] = Math.random();
        g_selectColor[3] = Math.random();
    };

    document.getElementById('redS').addEventListener('mouseup', function (){g_selectColor[0] = this.value/256;});
    document.getElementById('greenS').addEventListener('mouseup', function (){g_selectColor[1] = this.value/256;});
    document.getElementById('blueS').addEventListener('mouseup', function (){g_selectColor[2] = this.value/256;});

    document.getElementById('alphaS').addEventListener('mouseup', function (){g_selectColor[3] = this.value/100;});

    document.getElementById('shapeS').addEventListener('mouseup', function (){g_selectSize = this.value});
    document.getElementById('segC').addEventListener('mouseup', function (){segment = this.value});
}

var g_shapesList = [];

function click(ev) {

    let [x, y] = convertToGL(ev);
    let point;
    if (g_selectType == POINT){
        point = new Point();
    } else if (g_selectType == TRIANGLE){
        point = new Triangle();
    } else{
        point = new Circle();
        point.segments = segment;
    }
    point.position = [x, y];
    point.color = g_selectColor.slice();
    point.size = g_selectSize;
    g_shapesList.push(point);
    renderAllShapes();

}

function convertToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return([x,y]);
}

function renderAllShapes(){

    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_shapesList.length;
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
}


function main() {
    setupWebGL();
    connectVariablesToGLSL();
    clearcanvas();
    changeui();
    let body = document.querySelector("body");
    body.style.cursor = "crosshair";

    canvas.onmousedown = function (ev){click(ev)};
    canvas.onmousemove = function (ev){if(ev.buttons == 1){click(ev)}};
}

function showColor() {
    console.log("The color is " + Math.round(g_shapesList[g_shapesList.length - 1].color[0] * 100) / 100,
        Math.round(g_shapesList[g_shapesList.length - 1].color[1] * 100) / 100,
        Math.round(g_shapesList[g_shapesList.length - 1].color[2] * 100) / 100,
        Math.round(g_shapesList[g_shapesList.length - 1].color[3] * 100) / 100);
}

function Painting(){
    clearcanvas();

        var point = new Circle();
        point.size = 50;
        point.segments = 45;
        point.type = 'circle';
        point.position = [-0.58, 0.48, 0.0];
        point.color = [1, 1, 0.5, 1];
        g_shapesList[0] = point;

       var point2 = new Point();
        point2.size = 85;
        point2.type = 'point';
        point2.position = [-0.025, -0.7, 0.0];
        point2.color = [0.2109375, 0.8125, 0.7578125, 1];
        g_shapesList[1] = point2;

        var point1 = new Triangle();
        point1.size = 50;
        point1.type = 'triangle';
        point1.position = [-0.025, 0.005, 0.0];
        point1.color = [1, 0.2109375, 0.20703125, 1];
        g_shapesList[2] = point1;

        var p3 = new Point();
        p3.size = 35;
        p3.type = 'point';
        p3.position = [0.02, -0.67, 0.0];
        p3.color = [0.77734375, 0.3671875, 0.19140625, 1];
        g_shapesList[3] = p3;
        var p4 = new Point();
        p4.size = 35;
        p4.type = 'point';
        p4.position = [0.02, -0.83, 0.0];
        p4.color = [0.77734375, 0.3671875, 0.19140625, 1];
        g_shapesList[4] = p4;

        var p5 = new Triangle();
        p5.size = 42;
        p5.type = 'triangle';
        p5.position = [-0.42, -0.845, 0.0];
        p5.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[5] = p5;
        var p6 = new Triangle();
        p6.size = 42;
        p6.type = 'triangle';
        p6.position = [-0.665, -0.865, 0.0];
        p6.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[6] = p6;
        var p7 = new Triangle();
        p7.size = 42;
        p7.type = 'triangle';
        p7.position = [0.585, -0.815, 0.0];
        p7.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[7] = p7;
        var p8 = new Triangle();
        p8.size = 42;
        p8.type = 'triangle';
        p8.position =  [0.385, -0.84, 0.0];
        p8.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[8] = p8;
        var p9 = new Triangle();
        p9.size = 42;
        p9.type = 'triangle';
        p9.position = [-0.29, -0.895, 0.0];
        p9.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[9] = p9;
        var p10 = new Triangle();
        p10.size = 42;
        p10.type = 'triangle';
        p10.position = [0.165, -0.87, 0.0];
        p10.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[10] = p10;
        var p11 = new Triangle();
        p11.size = 42;
        p11.type = 'triangle';
        p11.position = [-0.13, -0.825,0.0];
        p11.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[11] = p11;
        var p12 = new Triangle();
        p12.size = 42;
        p12.type = 'triangle';
        p12.position = [0.13, -0.825, 0.0];
        p12.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[12] = p12;
        var p13 = new Triangle();
        p13.size = 60;
        p13.type = 'triangle';
        p13.position =[0.08, -0.815];
        p13.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[13] = p13;
        var p14 = new Triangle();
        p14.size = 69;
        p14.type = 'triangle';
        p14.position = [-0.025, -0.805]
        p14.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[14] = p14;
        var p15 = new Triangle();
        p15.size = 60;
        p15.type = 'triangle';
        p15.position = [-0.51, -0.79];
        p15.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[15] = p15;
        var p16 = new Triangle();
        p16.size = 60;
        p16.type = 'triangle';
        p16.position = [0.07, -0.815];
        p16.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[16] = p16;
        var p17 = new Triangle();
        p17.size = 42;
        p17.type = 'triangle';
        p17.position = [0.435, -0.885];
        p17.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[17] = p17;
        var p18 = new Triangle();
        p18.size = 42;
        p18.type = 'triangle';
        p18.position = [0.44, -0.885]
        p18.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[18] = p18;
        var p19 = new Triangle();
        p19.size = 42;
        p19.type = 'triangle';
        p19.position = [0.5, -0.82];
        p19.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[19] = p19;
        var p20 = new Triangle();
        p20.size = 60;
        p20.type = 'triangle';
        p20.position =[0.68, -0.925];
        p20.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[20] = p20;
        var p21 = new Triangle();
        p21.size = 60;
        p21.type = 'triangle';
        p21.position = [0.28, -0.865];
        p21.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[21] = p21;
        var p22 = new Triangle();
        p22.size = 60;
        p22.type = 'triangle';
        p22.position =[-0.355, -0.875];
        p22.color = [0.4609375, 0.74609375, 0.18359375, 1];
        g_shapesList[22] = p22;
        var p23 = new Point();
        p23.size = 25;
        p23.type = 'triangle';
        p23.position = [0.08, -0.145];
        p23.color = [0.5, 0.5, 0.5, 1];
        g_shapesList[23] = p23;

    var p24 = new Point();
    p24.size = 25;
    p24.type = 'point';
    p24.position = [0.08, -0.245];
    p24.color = [0.5, 0.5, 0.5, 1];
    g_shapesList[24] = p24;

    var p25 = new Point();
    p25.size = 25;
    p25.type = 'point';
    p25.position = [0.08, -0.345];
    p25.color = [0.5, 0.5, 0.5, 1];
    g_shapesList[25] = p25;

    var p26 = new Circle();
    p26.size = 25;
    p26.segments = 6;
    p26.type = 'circle';
    p26.position = [0.32, 0.555]
    p26.color = [0.5, 0.5, 0.5, 1];
    g_shapesList[26] = p26;

    var p27 = new Circle();
    p27.size = 25;
    p27.segments = 6;
    p27.type = 'circle';
    p27.position = [0.15, 0.205];
    p27.color = [0.5, 0.5, 0.5, 1];
    g_shapesList[27] = p27;

    var p28 = new Circle();
    p28.size = 25;
    p28.segments = 6;
    p28.type = 'circle';
    p28.position = [0.62, 0.805];
    p28.color = [0.5, 0.5, 0.5, 1];
    g_shapesList[28] = p28;

    renderAllShapes();
}
