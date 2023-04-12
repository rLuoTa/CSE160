
var VSHADER_SOURCE =
    'precision mediump float;' +
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_UV;' +
    'varying vec2 v_UV;' +
    'uniform mat4 u_ModelMatrix;'+
    'uniform mat4 u_GlobalRotateMatrix;'+
    'uniform mat4 u_ViewMatrix;' +
    'uniform mat4 u_ProjectionMatrix;' +
    'void main() {\n' +
    '    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;' +
    '    v_UV = a_UV;' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec2 v_UV;' +
    'uniform vec4 u_FragColor;\n' +
    'uniform sampler2D u_Sampler0;' +
    'uniform sampler2D u_Sampler1;' +
    'uniform sampler2D u_Sampler2;' +
    'uniform int u_whichTexture;'+
    'void main() {\n' +
    '   if(u_whichTexture == -2){' +
    '       gl_FragColor = u_FragColor;\n'+
    '   } else if (u_whichTexture ==-1){' +
    '       gl_FragColor = vec4(v_UV,1.0,1.0);' +
    '   } else if(u_whichTexture == 0){' +
    '       gl_FragColor = texture2D(u_Sampler0, v_UV);' +
    '   } else if(u_whichTexture == 1){' +
    '       gl_FragColor = texture2D(u_Sampler1, v_UV);'+
    '   } else if(u_whichTexture == 2){' +
    '       gl_FragColor = texture2D(u_Sampler2, v_UV);'+
    '   } else{' +
    '       gl_FragColor = vec4(1,.2,.2,1);' +
    '   }\n' +
    '}';

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;

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

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
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

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }

    // Get the storage location of u_Sampler
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return false;
    }
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler1');
        return false;
    }

    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
        console.log('Failed to get the storage location of u_Sampler2');
        return false;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_whichTexture');
        return false;
    }

    var identifyM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix,false,identifyM.elements);
}




let g_baseTime = 0;

function Reset(){

    g_globalAngleY = 0;
    g_globalAngleX = 0;
    g_globalAngleZ = 0;

    g_camera.eye.elements = [0,0,3];
    g_camera.at.elements = [0,0,-100];
    g_camera.up.elements = [0,1,0];

    g_eye = [0,0,1];
    g_at = [0,0,-100];
    g_up = [0,1,0];

    g_vertexBufferCube = null;
    g_uvBuffer = null;

    //g_map = g_orginmap;
    setupMap();

    g_headAngle = 0;

    //renderScene();
    /*
    canvas = document.getElementById('webgl');
    gl = getWebGLContext(canvas);
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

     */

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

function initTextures() {
    var image0 = new Image();  // Create the image object
    var image1 = new Image();
    var image2 = new Image();
    if (!image0 || !image1 || !image2) {
        console.log('Failed to create the image object');
        return false;
    }
    // Register the event handler to be called on loading an image
    image0.onload = function(){ sendImageToTexture(image0, 0); };
    image0.src = 'sky2.jpg';
    image1.onload = function(){ sendImageToTexture(image1, 1); };
    image1.src = 'grass.jpeg';
    image2.onload = function(){ sendImageToTexture(image2, 2); };
    image2.src = 'mud.jpeg';
    return true;
}

function sendImageToTexture(image, index) {

    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    if (index === 0){
        gl.activeTexture(gl.TEXTURE0);
    } else if(index === 1){
        gl.activeTexture(gl.TEXTURE1);
    } else if(index === 2){
        gl.activeTexture(gl.TEXTURE2);
    }
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // Set the texture unit 0 to the sampler
    if (index === 0){
        gl.uniform1i(u_Sampler0, 0);
    } else if (index === 1){
        gl.uniform1i(u_Sampler1, 1);
    } else if (index === 2){
        gl.uniform1i(u_Sampler2, 2);
    }
    //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
    console.log('finished loadTexture', image);
}

/*function sendImageToTexture0(image) {

    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);
    //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
    console.log('finished loadTexture', image);
}

function sendImageToTexture1(image) {

    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE1);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler1, 1);
    //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
    console.log('finished loadTexture', image);
}


 */

//let g_map =[[[0 for x in Math.range(4)]for row in range(4)] for x in range(6)];

let g_map= [];
//setupMap();
/*[[
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],//x=0
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],//x=1
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],//x=2
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],//x=1
   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],//x=2
   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]], [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
]];


 */


let g_orginmap;

function setupMap(){
    for(let z = 0; z < 2; z++){
        g_map[z] = [];
        for(let x = 0; x < 32; x++){
            g_map[z][x] = [];
            for(let y = 0; y < 32; y++) {
                g_map[z][x][y] = 0;
                if (x === 0 || y === 0 || x === 31 || y === 31)
                    g_map[z][x][y] = 1;
            }
        }
    }
    for(let z = 2; z < 9; z++){
        g_map[z] = [];
        for(let x = 0; x < 32; x++){
            g_map[z][x] = [];
            for(let y = 0; y < 32; y++){
                g_map[z][x][y] = 0;
            }
        }
    }
    g_orginmap = g_map;
}

function Maze(){
    g_camera.eye.elements[0] = 12;
    g_camera.eye.elements[2] = 12;
    g_camera.at.elements[0] = 12;
    g_camera.at.elements[2] = 12-100;

    g_eye = g_camera.eye.elements;
    g_at = g_camera.at.elements;

    //console.log(g_camera.eye, g_camera.at);
    setupMaze();
}

function setupMaze(){
    for(let z = 0; z < 2; z++){
        for(let x = 5; x < 26; x++){
            if (x === 5 || x === 25)
                for(let y = 5; y < 26; y++)
                    g_map[z][x][y] = 1;
            else if (x === 6 || x === 24){
                g_map[z][x][5] = 1; g_map[z][x][25] = 1;
            }
            else if (x === 7 || x === 23){
                for (let y = 5; y < 26; y++)
                    g_map[z][x][y] = 1;
                g_map[z][x][6] = 0; g_map[z][x][24] = 0;
            } else if (x === 8 || x === 22){
                g_map[z][x][5] = 1; g_map[z][x][25] = 1;
                g_map[z][x][7] = 1; g_map[z][x][23] = 1;
            } else if (x === 9 || x === 21){
                for (let y = 5; y < 26; y++)
                    g_map[z][x][y] = 1;
                g_map[z][x][6] = 0; g_map[z][x][24] = 0;
                g_map[z][x][8] = 0; g_map[z][x][22] = 0;
            } else if (x === 10 || x === 20){
                g_map[z][x][5] = 1; g_map[z][x][25] = 1;
                g_map[z][x][7] = 1; g_map[z][x][23] = 1;
                g_map[z][x][9] = 1; g_map[z][x][21] = 1;
            } else if (x === 11 || x === 19){
                for (let y = 5; y < 26; y++)
                    g_map[z][x][y] = 1;
                g_map[z][x][6] = 0; g_map[z][x][24] = 0;
                g_map[z][x][8] = 0; g_map[z][x][22] = 0;
                g_map[z][x][10] = 0; g_map[z][x][20] = 0;
            } else if (x === 12 || x === 18){
                g_map[z][x][5] = 1; g_map[z][x][25] = 1;
                g_map[z][x][7] = 1; g_map[z][x][23] = 1;
                g_map[z][x][9] = 1; g_map[z][x][21] = 1;
                g_map[z][x][11] = 1; g_map[z][x][19] = 1;
            } else if (x === 13 || x === 17){
                for (let y = 5; y < 26; y++)
                    g_map[z][x][y] = 1;
                g_map[z][x][6] = 0; g_map[z][x][24] = 0;
                g_map[z][x][8] = 0; g_map[z][x][22] = 0;
                g_map[z][x][10] = 0; g_map[z][x][20] = 0;
                g_map[z][x][12] = 0; g_map[z][x][22] = 0;
            } else if (x === 14 || x === 16){
                g_map[z][x][5] = 1; g_map[z][x][25] = 1;
                g_map[z][x][7] = 1; g_map[z][x][23] = 1;
                g_map[z][x][9] = 1; g_map[z][x][21] = 1;
                g_map[z][x][11] = 1; g_map[z][x][19] = 1;
                g_map[z][x][13] = 1; g_map[z][x][17] = 1;
            } else {
                g_map[z][x][5] = 1; g_map[z][x][25] = 1;
                g_map[z][x][7] = 1; g_map[z][x][23] = 1;
                g_map[z][x][9] = 1; g_map[z][x][21] = 1;
                g_map[z][x][11] = 1; g_map[z][x][19] = 1;
                g_map[z][x][18] = 1; g_map[z][x][17] = 1;
                g_map[z][x][20] = 1;
            }
            g_map[z][9][13] = 0;
            g_map[z][12][15] = 1;
            g_map[z][13][18] = 0;   g_map[z][13][19] = 0;
            g_map[z][14][19] = 1;
            g_map[z][17][18] = 0;   g_map[z][17][19] = 0;
            g_map[z][22][15] = 1;
            g_map[z][23][14] = 0;
            g_map[z][23][16] = 0;
            g_map[z][25][24] = 0;
            g_map[z][24][25] = 0;
            g_map[z][25][25] = 0;
            g_map[z][25][23] = 0;
            g_map[z][23][25] = 0;

            /*
            if (x === 5 || y === 5||x === 25||y === 25)
                g_map[z][x][y] = 1;
            if (x === 7 || y === 7||x === 23||y === 23)
                g_map[z][x][y] = 1;
            if (x === 9 || y === 9||x === 21||y === 21)
                g_map[z][x][y] = 1;
            if (x === 11 || y === 11||x === 19||y === 19)
                g_map[z][x][y] = 1;
            if (x === 13 || y === 13||x === 17||y === 17)
                g_map[z][x][y] = 1;

             */


        }
    }
}

function drawMap(){

    var block = new Cube();
    block.color = [0.8,1,1,1];
    block.textureNum = 2;
    //block.matrix.scale(1.2,1,1.2);
    block.matrix.translate(0,-0.7,0);
    for (let z = 0;z < 2; z++) {
        for (let x = 15; x >= -16; x--) {
            for (let y = 15; y >= -16; y--) {
                if (x === -16 || x === 15 || y === -16 || y === 15) {
                   block.matrix.translate(x, 0, y);

                    block.drawCubeFast();
                    block.matrix.translate(-x, 0, -y);
                }
                if (g_map[z][x + 16][y +16]) {
                    block.matrix.translate(x, 0, y);
                    block.drawCubeFast();
                    block.matrix.translate(-x, 0, -y);
                }
                /*
                if(x===0||x === 15||y===0||y===15){
                    //var block = new Cube();
                    //block.color = [0.8,1,1,1];
                    //block.textureNum = 2;
                    //block.matrix.translate(0,-0.75,0);
                    //block.matrix.scale(.3,.3,.3);
                    block.matrix.translate(x-4,0,y-4);
                    block.drawCube();
                }

                 */
            }
        }
        block.matrix.translate(0,1,0);
    }
}

function addBlock(){
    console.log('eye',g_camera.eye, 'at', g_camera.at);
    let x = Math.floor(g_camera.eye.elements[0]+16);
    let y = Math.floor(g_camera.eye.elements[2]+16);
    let z = Math.floor(g_camera.eye.elements[1]);


    if (Math.tan(g_camera.f.elements[0]/g_camera.f.elements[2])<1 &&
        Math.tan(g_camera.f.elements[0]/g_camera.f.elements[2])>-1){
        if (g_camera.f.elements[2]< 0)
            y-=2;
        else y += 2;
        //console.log('a/l')
    } else if (Math.tan(g_camera.f.elements[0]/g_camera.f.elements[2])>=1){
        if(g_camera.f.elements[0]>0) {
            x+=2;
            console.log('l')
        }
        else{
            x-=2;  console.log('l2')
        }

    } else if (Math.tan(g_camera.f.elements[0]/g_camera.f.elements[2])<=-1){
        if(g_camera.f.elements[0]>0) x+=2;
        else x-=2;
    }
    g_map[z][x][y] = 1;


}

function deleteBlock(){
    let x = Math.floor(g_camera.eye.elements[0]+16);
    let y = Math.floor(g_camera.eye.elements[2]+16);
    let z = Math.floor(g_camera.eye.elements[1]);

    if (Math.tan(g_camera.f.elements[0]/g_camera.f.elements[2])<1 &&
        Math.tan(g_camera.f.elements[0]/g_camera.f.elements[2])>-1){
        if (g_camera.f.elements[2]< 0)
            y-=2;
        else y += 2;
        //console.log('a/l')
    } else if (Math.tan(g_camera.f.elements[0]/g_camera.f.elements[2])>=1){
        if(g_camera.f.elements[0]>0) {
            x+=2;
            //console.log('l')
        }
        else{
            x-=2;  //console.log('l2')
        }

    } else if (Math.tan(g_camera.f.elements[0]/g_camera.f.elements[2])<=-1){
        if(g_camera.f.elements[0]>0) x+=2;
        else x-=2;
    }
    g_map[z][x][y] = 0;
    console.log(g_map, x, y)

}

var g_eye = [0,0,3];
var g_at = [0,0,-100];
var g_up = [0,1,0];

/*
var projMat = new Matrix4();
var viewMat = new Matrix4();
var globalRotMat = new Matrix4().rotate(g_globalAngleY,0,1,0);
*/


function renderScene(){

    var startTime = performance.now();

    var projMat = new Matrix4();
    projMat.setPerspective(g_camera.fov,1, .1, 1000);
    //projMat.rotate(g_viewX,1,0,0);
    //projMat.rotate(g_viewY, 0, 1, 0);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(g_eye[0],g_eye[1],g_eye[2] , g_at[0],g_at[1],g_at[2], g_up[0],g_up[1],g_up[2]);
    //viewMat.rotate(g_viewX, 1, 0, 0);
    //viewMat.rotate(g_viewY, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
    //console.log(projMat, viewMat);

    var globalRotMat = new Matrix4().rotate(g_globalAngleY,0,1,0);    //2.3
    globalRotMat.rotate(g_globalAngleX,1,0,0);
    globalRotMat.rotate(g_globalAngleZ,0,0,1);


    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);    //2.3

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var floor = new Cube();
    floor.color = [1.0,0.0,0.0,1.0];
    floor.textureNum = 1;
    floor.matrix.translate(0,-0.75,0.0);
    floor.matrix.scale(32,0,32);
    floor.matrix.translate(-0.5,0,-0.5);
    floor.drawCubeFast();

    var sky = new Cube();
    sky.color = [1.0,0.0,0.0,1.0];
    sky.textureNum = 0;
    sky.matrix.scale(50,50,50);
    sky.matrix.translate(-0.5,-0.5,-0.5);
    sky.drawCubeFast();

    var catBody1 = new Cube();
    catBody1.color = [0.3, 0.3, 0.3, 1.4];
    catBody1.matrix.translate(-0.2,-0.2,-0.25);
    //catBody1.matrix.rotate(-5,1,0,0);
    catBody1.matrix.scale(0.4,.4,0.5);
    catBody1.drawCubeFast();

    var catBody2 = new Cube();
    catBody2.color = [0.3, 0.3, 0.3, 1.4];
    catBody2.textureNum = 0;
    catBody2.matrix.translate(-0.1995,-0.1995,0.25);
    //catBody2.matrix.rotate(-5,1,0,0);
    catBody2.matrix.scale(0.399,.399,0.5);
    catBody2.drawCubeFast();

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
    head.drawCubeFast();

    let eyeLeft = new Cube();
    eyeLeft.matrix = eyeCoorM;
    eyeLeft.color = [1,1,0,1];
    eyeLeft.matrix.translate(0.05,0.15,-0.36);
    eyeLeft.matrix.scale(0.07,0.07,0.1);
    eyeLeft.drawCubeFast();

    let eyeRight = new Cube();
    eyeRight.matrix = eyeCoorM;
    eyeRight.color = [1,1,0,1];
    eyeRight.matrix.translate(2.65,0,0);
    eyeRight.drawCubeFast();

    let eyeR = new Cube();
    eyeR.matrix = eyeCoorM;
    eyeR.color = [0,0,0,1];
    eyeR.matrix.translate(0.5,0,-0.001);
    eyeR.matrix.scale(.1, 1, 1);
    eyeR.drawCubeFast();

    let eyeL = new Cube();
    eyeL.matrix = eyeCoorM;
    eyeL.color = [0,0,0,1];
    eyeL.matrix.translate(-27, 0, 0);
    //eyeL.matrix.scale(.1,1,1);
    eyeL.drawCubeFast();

    var leftArm1 = new Cube();
    leftArm1.color = [0.1, 0.1, 0.1, 1.0];
    leftArm1.matrix.translate(-0.195,-0.05,-0.2);
    leftArm1.matrix.rotate(-g_leftArmAngle1,1,0,0);
    var LA1CoorM = new Matrix4(leftArm1.matrix);
    leftArm1.matrix.scale(0.1,-.3,0.15);
    leftArm1.drawCubeFast();


    var leftArm2 = new Cube();
    leftArm2.matrix = LA1CoorM;
    leftArm2.color = [0.5, 0, 0, 1.0];
    leftArm2.matrix.translate(0.001,-0.25,0.101);
    leftArm2.matrix.rotate(-g_leftArmAngle2,1,0,0);
    leftArm2.matrix.translate(0,0,-.10);
    leftArm2.matrix.scale(.1,-.15,0.15);
    leftArm2.drawCubeFast();

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
    rightArm1.drawCubeFast();

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
    rightArm2.drawCubeFast();

    var leftLeg1 = new Cube();
    leftLeg1.color = [0.1, .1, .1, 1.0];
    leftLeg1.matrix.translate(-0.195,-0.05,0.4);
    leftLeg1.matrix.rotate(g_rightArmAngle1,1,0,0);
    let LLCoorM = new Matrix4(leftLeg1.matrix);
    leftLeg1.matrix.scale(0.1,-.3,0.15);
    leftLeg1.drawCubeFast();

    var leftLeg2 = new Cube();
    leftLeg2.matrix = LLCoorM;
    leftLeg2.color = [0.5, 0, 0, 1.0];
    leftLeg2.matrix.translate(0.001,-0.25,0.101);
    leftLeg2.matrix.rotate(g_rightArmAngle2,1,0,0);
    leftLeg2.matrix.translate(0,0,-.1);
    leftLeg2.matrix.scale(0.1,-.15,0.15);
    leftLeg2.drawCubeFast();

    var rightLeg1 = new Cube();
    rightLeg1.color = [0.1, .1, .1, 1.0];
    rightLeg1.matrix.translate(0.095,-0.05,0.4);
    rightLeg1.matrix.rotate(-g_leftArmAngle1,1,0,0);
    let RLCoorM = new Matrix4(rightLeg1.matrix);
    rightLeg1.matrix.scale(0.1,-.3,0.15);
    rightLeg1.drawCubeFast();

    var rightLeg2 = new Cube();
    rightLeg2.matrix = RLCoorM;
    rightLeg2.color = [.5, 0, 0, 1.0];
    rightLeg2.matrix.translate(-0.001,-0.25,0.101);
    rightLeg2.matrix.rotate(-g_leftArmAngle2,1,0,0);
    rightLeg2.matrix.translate(0,0,-0.10);
    rightLeg2.matrix.scale(0.1,-.15,0.15);
    rightLeg2.drawCubeFast();

    var tailBase = new Cube();
    tailBase.color = [0.15,0.15,.15,1];
    tailBase.matrix.translate(-0.1,.1,0.7);
    tailBase.matrix.rotate(g_tailEndAngle,1,0,0)
    tailBase.matrix.translate(0,-0.1,.05);;
    let tailCoorM = new Matrix4(tailBase.matrix);
    tailBase.matrix.scale(0.2,.2,0.1);
    tailBase.drawCubeFast();

    var tail0 = new Cube();
    tail0.matrix = tailCoorM;
    tail0.color = [0.25,0.25,0.25,1];
    tail0.matrix.translate(0.002,0.1,0.1);
    //tail0.matrix.rotate(0,1,0,0);
    tail0.matrix.rotate(g_tailAngle0,1,0,0);
    tail0.matrix.translate(0.045,-0.05,-0.005);
    tail0.matrix.scale(0.1,.1,0.2);
    let tailCoorM1 = new Matrix4(tail0.matrix);
    tail0.drawCubeFast();

    var tail1 = new Cube();
    tail1.matrix = tailCoorM1;
    tail1.color = [.15,0.15,0.15,1];
    tail1.matrix.translate(0.0001,0.425,.8);
    tail1.matrix.rotate(g_tailAngle1,1,0,0);
    tail1.matrix.translate(0,-0.4,0);
    tail1.matrix.scale(0.95,0.95,0.95);
    let tailCoorM2 = new Matrix4(tail1.matrix);
    tail1.drawCubeFast();

    var tail2 = new Cube();
    tail2.matrix = tailCoorM2;
    tail2.color = [0.2,0.2,0.2,1];
    tail2.matrix.translate(0.0001,.425,.8);
    tail2.matrix.rotate(g_tailAngle2,1,0,0);
    tail2.matrix.translate(0,-.4,0);
    tail2.matrix.scale(0.95,0.95,0.95);
    //let tailCoorM3 = new Matrix4(tail2.matrix);
    tail2.drawCubeFast();
/*
    var tail3 = new Cube();
    tail3.matrix = tailCoorM3;
    tail3.color = [0,0,0,1];
    tail3.matrix.translate(0.0001,.8,0.5);
    //tail3.matrix.rotate(g_tailAngle-15,1,0,0);
    tail3.matrix.translate(0,0,-0.5);
    tail3.drawCubeFast);*/

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

    drawMap();


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
            //Reset();
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

            //g_globalAngleX = -currentAngle[0];
            //g_globalAngleY = -currentAngle[1];

            //let alpha = Math.atan(dy/dx);
            //console.log(alpha);
            /*
            g_camera.f.set(g_camera.at);
            g_camera.f.sub(g_camera.eye);
            let rotationMatrix = new Matrix4();
            console.log(g_camera.up.elements)
            rotationMatrix.setRotate(x - lastX,
                g_camera.up.elements[0],g_camera.up.elements[1],g_camera.up.elements[2]);
            rotationMatrix.setRotate(y - lastY,1, 0, 0);
            g_camera.f = rotationMatrix.multiplyVector3(g_camera.f);
            g_camera.at.set(g_camera.f.add(g_camera.eye));

             */
            g_camera.mouseX(x - lastX);
            g_camera.mouseY(y - lastY);
            g_at = g_camera.at.elements;
            g_eye = g_camera.eye.elements;
            g_up = g_camera.up.elements;

            /*
            this.f.set(this.at);
            this.f.sub(this.eye);
            let rotationMatrix = new Matrix4();
            rotationMatrix.setRotate(this.alpha,
                this.up.elements[0],this.up.elements[1],this.up.elements[2]);
            this.f = rotationMatrix.multiplyVector3(this.f);
            this.at.set(this.f.add(this.eye));

             */

            //console.log(dx,dy)

        }
        lastX = x, lastY = y;
    };


}

var g_camera = new Camera();

function keydown(ev){


    if (ev.keyCode === 68){
/*
        if(boundary()){
            console.log("stop!")
        } else {
            g_camera.right();
        }

 */
        g_camera.right();
    } else if (ev.keyCode === 65) {
        /*
        if (boundary()) {
            console.log("stop!")
        } else{
            g_camera.left();
        }

         */
        g_camera.left();
    } else if (ev.keyCode === 83){
        /*
        if(boundary()){
            console.log("stop!")
        } else {
            g_camera.back();
        }

         */
        g_camera.back();
    } else if (ev.keyCode === 87){
        /*
        if(boundary()){
            console.log("stop!")
        } else {
            g_camera.forward();
        }

         */
        g_camera.forward();
    } else if (ev.keyCode === 38){
        g_camera.upward();
    } else if (ev.keyCode === 40){
        g_camera.downward();
    }
    if (ev.keyCode === 81){
        g_camera.rotateLeft();
        //console.log("f",g_camera.f.elements)
    } else if (ev.keyCode === 69){
        g_camera.rotateRight();
        //console.log("f",g_camera.f.elements[0],g_camera.f.elements[1],g_camera.f.elements[2])
    }

    g_eye = g_camera.eye.elements;
    g_at = g_camera.at.elements;
    g_up = g_camera.up.elements;
    console.log(g_camera.eye.elements[0],g_camera.eye.elements[1],g_camera.eye.elements[2] )

    //renderScene();
    console.log(ev.keyCode);
}

function boundary(){
    /*
    let x = Math.round(g_camera.eye.elements[0]+16);
    let y = Math.round(g_camera.eye.elements[1]);
    let z = Math.round(g_camera.eye.elements[2]+16);
    console.log(y, x, z)
    if (g_map[y][x][z]){
        console.log("boundary")
        if(x > g_camera.eye.elements[0]+16)
            g_camera.eye.elements[0] -= g_camera.speed*1.5;
        else if (x < g_camera.eye.elements[0]+16)
            g_camera.eye.elements[0] += g_camera.speed*1.5;
        else if ( z > g_camera.eye.elements[2]+16){
            g_camera.eye.elements[2] -=g_camera.speed*1.5;
        } else if (z < g_camera.eye.elements[2]+16){
            g_camera.eye.elements[2] +=g_camera.speed*1.5;
        }
        return true;
    }*/

    if (g_camera.eye.elements[0] > 14){
        g_camera.eye.elements[0] -= g_camera.speed;
    } else if (g_camera.eye.elements[0] < -14 ){
        g_camera.eye.elements[0] += g_camera.speed;
    } else if (g_camera.eye.elements[2] > 14 ){
        g_camera.eye.elements[2] -=g_camera.speed;
    } else if (g_camera.eye.elements[2] < -14){
        g_camera.eye.elements[2] +=g_camera.speed;
    } else {
        return false;
    }
    return true;
}

function main() {

    setupWebGL();

    connectVariablesToGLSL();

    //Reset();
    addActionsForHtmlUI();

    document.onkeydown = function(ev){keydown(ev)};
    initTextures();

    gl.clearColor(1.0,0.0,0.0,1.0);

    //renderScene();
    //renderScene();
    //console.log(g_map);

    var currentAngle = [g_globalAngleX,g_globalAngleY];
    initEventHandlers(canvas, currentAngle);

    setupMap();

    //updateSliders();
    //shiftClick();
    requestAnimationFrame(tick);
}