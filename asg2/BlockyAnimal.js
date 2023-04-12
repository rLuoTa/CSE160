var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;'+
    'uniform mat4 u_GlobalRotateMatrix;'+
    'void main() {\n' +
    '    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;'+
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +  // uniform変数
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';



// Global Var
let canvas;
let gl;
let a_Position;
let u_FragColor;

let u_ModelMatrix;
let  u_GlobalRotateMatrix;

function setupWebGL(){
    canvas = document.getElementById('webgl');
    gl = canvas.getContext('webgl', {preserveDrawingBuffer:true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
    }
    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
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

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    var identifyM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix,false,identifyM.elements);
}

let g_baseTime = 0;

function Reset(){
    //console.log("Reset");

    g_globalAngleY = 0;
    g_globalAngleX = 0;
    g_globalAngleZ = 0;

    //g_rightArmAngle1 = 0;
    g_headAngle = 0;

    //renderScene();
    canvas = document.getElementById('webgl');
    gl = getWebGLContext(canvas);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //shiftC = false;
    //g_shiftAngle = 0;

    g_baseTime = 0;
    g_run = false;
    g_rightArmAngle1 = 0;
    g_leftArmAngle1 = 0;
    g_leftArmAngle2 = 0;
    g_rightArmAngle2 = 0;

    //g_baseTime = performance.now()/1000;
    g_tailEndAngle = 0;
    g_tailAnimation = false;
    g_tailTime = 0;
    g_tailStart = 0;
    g_tailPauseTime = 0;
    g_tailStop = 0;

    g_headAngle = 0;
    g_headAnimation = false;
    g_headTime = 0;
    g_headStart = 0;
    g_headPauseTime = 0;
    g_headStop = 0;

    updateSliders();
}

function updateSliders(){
    document.getElementById("angleSlideX").value = g_globalAngleX;
    document.getElementById("angleSlideY").value = g_globalAngleY;
    document.getElementById("angleSlideZ").value = g_globalAngleZ;

    document.getElementById("headSlide").value = g_headAngle;
    document.getElementById("tailSlide").value = g_tailEndAngle;

    document.getElementById("tailSlide0").value = g_tailAngle0;
    document.getElementById("tailSlide1").value = g_tailAngle1;
    document.getElementById("tailSlide2").value = g_tailAngle2;
}

let g_globalAngleY = 0;
let g_globalAngleX = 0;
let g_globalAngleZ = 0;


let g_shiftAngle = 0;
let g_headAngle = 0;


let g_leftArmAngle1 = 0;
let g_leftArmAngle2 = 0;
let g_rightArmAngle1 = 0;
let g_rightArmAngle2 = 0;

let g_run = false;
let g_runTime = 0;
let g_runStart = 0;
let g_runPauseTime = 0;
let g_runTotalPauseTime = 0;
let g_runBaseTime = 0;
let g_runStop = 0;

let g_headAnimation = false;
let g_headTime = 0;
let g_headStart = 0;
let g_headPauseTime = 0;
let g_headTotalPauseTime = 0;
let g_headBaseTime = 0;
let g_headStop = 0;


let g_tailEndAngle = 0;
let g_tailAngle0 = 0;
let g_tailAngle1 = 0;
let g_tailAngle2 = 0;
let g_tailAnimation = false;
let g_tailTime = 0;
let g_tailStart = 0;
let g_tailPauseTime = 0;
let g_tailTotalPauseTime = 0;
let g_tailBaseTime = 0;
let g_tailStop = 0;


let shiftC = false;
function addActionsForHtmlUI(){

    document.getElementById('animationRunOnButton').onclick = function (){ //g_run = true;
        if(!g_run) {
            g_run = true;
            g_tailAnimation = true;
            g_headAnimation = true;
            g_runStart = performance.now() / 1000;
            g_runTotalPauseTime += (g_runStart - g_runStop);
        }};

    document.getElementById('animationRunOffButton').onclick = function (){ //g_run = false;
        if(g_run) {
            g_run = false;
            g_tailAnimation = false;
            g_headAnimation = false;
            g_runStop = performance.now() / 1000;
        }
    };

    document.getElementById('headSlide').addEventListener('mousemove', function (ev){
        if(ev.buttons == 1){
            g_headAngle = this.value; //renderScene();
        }
    });
    document.getElementById('animationHeadOnButton').onclick = function (){
        if(!g_headAnimation){
            g_headAnimation = true;
            g_headStart = performance.now()/1000;
            g_headTotalPauseTime += (g_headStart-g_tailStop);
        }
    };
    document.getElementById('animationHeadOffButton').onclick = function (){
        if(g_headAnimation) {
            g_headAnimation = false;
            g_headStop = performance.now() / 1000;
        }
    };

    document.getElementById('tailSlide').addEventListener('mousemove', function (ev){
        if(ev.buttons === 1){
            g_tailEndAngle = this.value; //renderScene();
        }
    });
    document.getElementById('tailSlide0').addEventListener('mousemove', function (ev){
        if(ev.buttons === 1){
            g_tailAngle0 = this.value; //renderScene();
        }
    });
    document.getElementById('tailSlide1').addEventListener('mousemove', function (ev){
        if(ev.buttons === 1){
            g_tailAngle1= this.value; //renderScene();
        }
    });
    document.getElementById('tailSlide2').addEventListener('mousemove', function (ev){
        if(ev.buttons === 1){
            g_tailAngle2 = this.value; //renderScene();
        }
    });
    document.getElementById('animationTailOnButton').onclick = function (){
        if(g_tailBaseTime === 0){
            g_tailBaseTime = performance.now()/1000;
        }
        if(!g_tailAnimation){
            g_tailAnimation = true;
            g_tailStart = performance.now()/1000;
            g_tailTotalPauseTime += (g_tailStart-g_tailStop);
        }
    };
    document.getElementById('animationTailOffButton').onclick = function (){
        if(g_tailAnimation) {
            g_tailAnimation = false;
            g_tailStop = performance.now() / 1000;
        }
    };

    //ENV control
    document.getElementById('angleSlideY').addEventListener('mousemove', function (ev){
        if(ev.buttons == 1){
            g_globalAngleY = this.value;
            //renderScene();
        }
    });
    document.getElementById('angleSlideX').addEventListener('mousemove', function (ev){
        if(ev.buttons == 1){
        g_globalAngleX= this.value;
        //renderScene();
        }
    });
    document.getElementById('angleSlideZ').addEventListener('mousemove', function (ev){
        if(ev.buttons == 1){
        g_globalAngleZ = this.value;
        //renderScene();
        }
    });

}


function renderScene(){

    var startTime = performance.now();

    var globalRotMat = new Matrix4().rotate(g_globalAngleY,0,1,0);    //2.3
    globalRotMat.rotate(g_globalAngleX,1,0,0);
    globalRotMat.rotate(g_globalAngleZ,0,0,1);


    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);    //2.3

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var catBody1 = new Cube();
    catBody1.color = [0.3, 0.3, 0.3, 1.4];
    catBody1.matrix.translate(-0.2,-0.2,-0.25);
    //catBody1.matrix.rotate(-5,1,0,0);
    catBody1.matrix.scale(0.4,.4,0.5);
    catBody1.drawCube();

    var catBody2 = new Cube();
    catBody2.color = [0.3, 0.3, 0.3, 1.4];
    catBody2.matrix.translate(-0.1995,-0.1995,0.25);
    //catBody2.matrix.rotate(-5,1,0,0);
    catBody2.matrix.scale(0.399,.399,0.5);
    catBody2.drawCube();

    var head = new Cube();
    head.color = [0.2, 0.2, 0.2, 1.0];
    head.matrix.translate(-.025,0.1,-0.14);
    if(shiftC){
        head.matrix.rotate(g_shiftAngle, 0, 0, 1);
    } else {
        head.matrix.rotate(g_headAngle,1,0,0);
    }
    head.matrix.translate(-.15,0,0);
    let headCoorM = new Matrix4(head.matrix);
    let eyeCoorM = new Matrix4(head.matrix);
    head.matrix.scale(0.35,0.35,-0.35);
    head.drawCube();

    let eyeLeft = new Cube();
    eyeLeft.matrix = eyeCoorM;
    eyeLeft.color = [1,1,0,1];
    eyeLeft.matrix.translate(0.05,0.15,-0.36);
    eyeLeft.matrix.scale(0.07,0.07,0.1);
    eyeLeft.drawCube();

    let eyeRight = new Cube();
    eyeRight.matrix = eyeCoorM;
    eyeRight.color = [1,1,0,1];
    eyeRight.matrix.translate(2.65,0,0);
    eyeRight.drawCube();

    let eyeR = new Cube();
    eyeR.matrix = eyeCoorM;
    eyeR.color = [0,0,0,1];
    eyeR.matrix.translate(0.5,0,-0.001);
    eyeR.matrix.scale(.1, 1, 1);
    eyeR.drawCube();

    let eyeL = new Cube();
    eyeL.matrix = eyeCoorM;
    eyeL.color = [0,0,0,1];
    eyeL.matrix.translate(-27, 0, 0);
    //eyeL.matrix.scale(.1,1,1);
    eyeL.drawCube();

    var leftArm1 = new Cube();
    leftArm1.color = [0.1, 0.1, 0.1, 1.0];
    leftArm1.matrix.translate(-0.195,-0.05,-0.2);
    leftArm1.matrix.rotate(-g_leftArmAngle1,1,0,0);
    var LA1CoorM = new Matrix4(leftArm1.matrix);
    leftArm1.matrix.scale(0.1,-.3,0.15);
    leftArm1.drawCube();


    var leftArm2 = new Cube();
    leftArm2.matrix = LA1CoorM;
    leftArm2.color = [0.5, 0, 0, 1.0];
    leftArm2.matrix.translate(0.001,-0.25,0.101);
    leftArm2.matrix.rotate(-g_leftArmAngle2,1,0,0);
    leftArm2.matrix.translate(0,0,-.10);
    leftArm2.matrix.scale(.1,-.15,0.15);
    leftArm2.drawCube();

    var rightArm1 = new Cube();
    rightArm1.color = [.1, 0.1, .1, 1.0];
    rightArm1.matrix.translate(0.095,-0.05,-0.2);
    if(shiftC) {
        rightArm1.matrix.rotate(g_shiftAngle*7,1,0,0);
    }   else {
        rightArm1.matrix.rotate(g_rightArmAngle1,1,0,0);
    }
    var RA1CoorM = new Matrix4(rightArm1.matrix);
    rightArm1.matrix.scale(0.1,-.3,0.15);
    rightArm1.drawCube();

    var rightArm2 = new Cube();
    rightArm2.matrix = RA1CoorM;
    rightArm2.color = [0.5, 0, 0, 1.0];
    rightArm2.matrix.translate(-0.001,-0.25,0.101);
    if(shiftC){
        rightArm2.matrix.rotate(-g_shiftAngle*3, 1, 0, 0);
    }else {
        rightArm2.matrix.rotate(g_rightArmAngle2, 1, 0, 0);
    }
    rightArm2.matrix.translate(0,0,-.1);
    rightArm2.matrix.scale(0.1,-.15,0.15);
    rightArm2.drawCube();

    var leftLeg1 = new Cube();
    leftLeg1.color = [0.1, .1, .1, 1.0];
    leftLeg1.matrix.translate(-0.195,-0.05,0.4);
    leftLeg1.matrix.rotate(g_rightArmAngle1,1,0,0);
    let LLCoorM = new Matrix4(leftLeg1.matrix);
    leftLeg1.matrix.scale(0.1,-.3,0.15);
    leftLeg1.drawCube();

    var leftLeg2 = new Cube();
    leftLeg2.matrix = LLCoorM;
    leftLeg2.color = [0.5, 0, 0, 1.0];
    leftLeg2.matrix.translate(0.001,-0.25,0.101);
    leftLeg2.matrix.rotate(g_rightArmAngle2,1,0,0);
    leftLeg2.matrix.translate(0,0,-.1);
    leftLeg2.matrix.scale(0.1,-.15,0.15);
    leftLeg2.drawCube();

    var rightLeg1 = new Cube();
    rightLeg1.color = [0.1, .1, .1, 1.0];
    rightLeg1.matrix.translate(0.095,-0.05,0.4);
    rightLeg1.matrix.rotate(-g_leftArmAngle1,1,0,0);
    let RLCoorM = new Matrix4(rightLeg1.matrix);
    rightLeg1.matrix.scale(0.1,-.3,0.15);
    rightLeg1.drawCube();

    var rightLeg2 = new Cube();
    rightLeg2.matrix = RLCoorM;
    rightLeg2.color = [.5, 0, 0, 1.0];
    rightLeg2.matrix.translate(-0.001,-0.25,0.101);
    rightLeg2.matrix.rotate(-g_leftArmAngle2,1,0,0);
    rightLeg2.matrix.translate(0,0,-0.10);
    rightLeg2.matrix.scale(0.1,-.15,0.15);
    rightLeg2.drawCube();

    var tailBase = new Cube();
    tailBase.color = [0.15,0.15,.15,1];
    tailBase.matrix.translate(-0.1,.1,0.7);
    tailBase.matrix.rotate(g_tailEndAngle,1,0,0)
    tailBase.matrix.translate(0,-0.1,.05);;
    let tailCoorM = new Matrix4(tailBase.matrix);
    tailBase.matrix.scale(0.2,.2,0.1);
    tailBase.drawCube();

    var tail0 = new Cube();
    tail0.matrix = tailCoorM;
    tail0.color = [0.25,0.25,0.25,1];
    tail0.matrix.translate(0.002,0.1,0.1);
    //tail0.matrix.rotate(0,1,0,0);
    tail0.matrix.rotate(g_tailAngle0,1,0,0);
    tail0.matrix.translate(0.045,-0.05,-0.005);
    tail0.matrix.scale(0.1,.1,0.2);
    let tailCoorM1 = new Matrix4(tail0.matrix);
    tail0.drawCube();

    var tail1 = new Cube();
    tail1.matrix = tailCoorM1;
    tail1.color = [.15,0.15,0.15,1];
    tail1.matrix.translate(0.0001,0.425,.8);
    tail1.matrix.rotate(g_tailAngle1,1,0,0);
    tail1.matrix.translate(0,-0.4,0);
    tail1.matrix.scale(0.95,0.95,0.95);
    let tailCoorM2 = new Matrix4(tail1.matrix);
    tail1.drawCube();

    var tail2 = new Cube();
    tail2.matrix = tailCoorM2;
    tail2.color = [0.2,0.2,0.2,1];
    tail2.matrix.translate(0.0001,.425,.8);
    tail2.matrix.rotate(g_tailAngle2,1,0,0);
    tail2.matrix.translate(0,-.4,0);
    tail2.matrix.scale(0.95,0.95,0.95);
    //let tailCoorM3 = new Matrix4(tail2.matrix);
    tail2.drawCube();
/*
    var tail3 = new Cube();
    tail3.matrix = tailCoorM3;
    tail3.color = [0,0,0,1];
    tail3.matrix.translate(0.0001,.8,0.5);
    //tail3.matrix.rotate(g_tailAngle-15,1,0,0);
    tail3.matrix.translate(0,0,-0.5);
    tail3.drawCube();*/

    let earLeft = new Pyramid();
    earLeft.matrix = headCoorM;
    earLeft.color = [0,0,0,1];
    earLeft.matrix.translate(0,0.35,-0.35);
    earLeft.matrix.scale(0.1,0.1,0.1);
    earLeft.render();

    let earRight = new Pyramid();
    earRight.matrix = headCoorM;
    earRight.color = [0,0,0,1];
    earRight.matrix.translate(3.5,0,0);
    earRight.matrix.scale(-1,1,1);
    earRight.render();

    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: "+ Math.floor(10000/duration)/10, "numdot");    //1.8

}

function shiftClick(){
    renderScene();
}


function updateAnimationAngles(){

    g_shiftAngle = 10*Math.sin(performance.now()/1000 - g_shiftTime)+10;

    if(g_tailAnimation){
        g_tailTime = ((performance.now()-g_baseTime)/1000 - g_tailTotalPauseTime);
        g_tailEndAngle = 7.5*Math.sin(g_tailTime)-90;
        g_tailAngle0 = 10*Math.sin(g_tailTime);
        g_tailAngle1 = 10*Math.sin(g_tailTime);
        g_tailAngle2 = 10*Math.sin(g_tailTime);
    }
    if(g_headAnimation){
        g_headTime = ((performance.now()-g_baseTime)/1000 - g_headTotalPauseTime);
        g_headAngle = 7.5*Math.sin(g_headTime)+15;
    }

    if(g_run){
        g_runTime = ((performance.now()-g_baseTime)/1000 - g_runTotalPauseTime)
        g_leftArmAngle1 = 15*Math.sin(g_runTime)+30;
        g_leftArmAngle2 = 15*Math.sin(g_runTime)-30;
        g_rightArmAngle1 = g_leftArmAngle2;
        g_rightArmAngle2 = g_leftArmAngle1;
        //g_tailAnimation = true;

    }
    //updateSliders();
}

function tick(){
    //updateSliders();

    updateAnimationAngles();

    if(performance.now()/1000 > g_shiftTime+5 ){
        shiftC = false;
    }
    renderScene();

    requestAnimationFrame(tick);
}

function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm){
        console.log("Failed to get "+ htmlID + " from HTML");
        return;
    }
    htmlElm.innerText = text;
}

let g_shiftTime = 0;

function initEventHandlers(canvas, currentAngle) {
    var dragging = false;// Dragging or not
    var lastX = -1, lastY = -1; // Last position of the mouse
    canvas.onmousedown = function(ev) { // Mouse is pressed
        if(ev.shiftKey){
            g_shiftTime = performance.now()/1000;
            shiftC = true;
            Reset();
            shiftClick();
        }   else {
            var x = ev.clientX, y = ev.clientY;
            // Start dragging if a moue is in <canvas>
            var rect = ev.target.getBoundingClientRect();
            if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
                lastX = x; lastY = y;
                dragging = true;
            }
        }

    };

    canvas.onmouseup = function(ev) { dragging = false; }; // Mouse is released

    canvas.onmousemove = function(ev) { // Mouse is moved
        var x = ev.clientX, y = ev.clientY;
        if (dragging) {
            var factor = 100/canvas.height; // The rotation ratio
            var dx = factor * (x - lastX);
            var dy = factor * (y - lastY);
            // Limit x-axis rotation angle to -90 to 90 degrees
            currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
            currentAngle[1] = currentAngle[1] + dx;
            g_globalAngleX = -currentAngle[0];
            g_globalAngleY = -currentAngle[1];

        }
        lastX = x, lastY = y;
    };


}

function main() {

    setupWebGL();

    connectVariablesToGLSL();

    Reset();

    addActionsForHtmlUI();

    gl.clearColor(1.0,1.0,1.0,1.0);

    //renderScene();
    //renderScene();
    var currentAngle = [g_globalAngleX,g_globalAngleY];
    initEventHandlers(canvas, currentAngle);


    //updateSliders();
    //shiftClick();
    requestAnimationFrame(tick);
}


//need to resolve: animation coherent