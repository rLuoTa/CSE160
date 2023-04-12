//抄作业自动v我50

var VSHADER_SOURCE =
    'precision mediump float;' +
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_UV;' +
    'attribute vec3 a_Normal;' +
    'varying vec2 v_UV;' +
    'varying vec3 v_Normal;' +
    'varying vec4 v_VertPos;' +
    'uniform mat4 u_ModelMatrix;'+
    'uniform mat4 u_GlobalRotateMatrix;'+
    'uniform mat4 u_ViewMatrix;' +
    'uniform mat4 u_ProjectionMatrix;' +
    'void main() {\n' +
    '    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;' +
    '    v_UV = a_UV;' +
    '    v_Normal = a_Normal;' +
    '    v_VertPos = u_ModelMatrix * a_Position;' +
    '}\n';


var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec2 v_UV;' +
    'varying vec3 v_Normal;' +
    'uniform vec4 u_FragColor;\n' +
    'uniform sampler2D u_Sampler0;' +
    'uniform sampler2D u_Sampler1;' +
    'uniform sampler2D u_Sampler2;' +
    'uniform int u_whichTexture;' +
    'uniform vec3 u_lightPos;' +
    'uniform vec3 u_cameraPos;' +
    'uniform vec3 u_lightColor;' +
    'uniform int u_light;' +
    'uniform int u_lightC;' +
    'varying vec4 v_VertPos;' +
    '' +
    'uniform vec3 u_spotLightPos;' +
    ''+
    'void main() {\n' +
    '   if(u_whichTexture == -3){' +
    '       gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);\n' +
    '   } else if(u_whichTexture == -2){' +
    '       gl_FragColor = u_FragColor;'+
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
    '   }' +
    '' +
    '   if (u_light==1){' +
        '' +
        '   vec3 lightVector = u_lightPos - vec3(v_VertPos);' +
        '   float r = length(lightVector);' +

        '   vec3 L = normalize(lightVector);' +
        '   vec3 N = normalize(v_Normal);' +
        '   float nDotL = max(dot(N,L), 0.0);' +
        '' +
        '   vec3 R = reflect(-L,N);' +
        '' +
        '   vec3 E = normalize(u_cameraPos - vec3(v_VertPos));' +
        '' +
        '   float specular = pow(max(dot(E,R), 0.0), 100.0);' +
        '' +
        '   vec3 diffuse = vec3(gl_FragColor) * nDotL;' +
        '   vec3 ambient = vec3(gl_FragColor) * 0.3;' +
        '   if(u_whichTexture == 0 || u_whichTexture == 1|| u_whichTexture == -2)' +
        '       specular = 0.0;' +
    '       if(u_lightC == 0){' +
        '       gl_FragColor = vec4(specular+diffuse+ambient, 1.0);' +
            '} else{' +
        '       gl_FragColor = vec4(u_lightColor*(diffuse+ambient), 1.0);' +
    '       }' +
    '   } else if (u_light == 2){' +
    '' +
        '   vec3 lightVector = u_spotLightPos - vec3(v_VertPos);' +
        '   vec3 L = normalize(lightVector);' +
        '   vec3 N = normalize(v_Normal);' +
        '   float nDotL = dot(N,L);' +
    '       float spotFactor = 1.0;' +
    '       vec3 D = -vec3(0,-1,0);' +
        '   float spotCosine = dot(D,L);' +
    '       float spotCosineCutoff = 0.98; ' +
    '       if (spotCosine >= spotCosineCutoff) { \n' +
    '            spotFactor = pow(spotCosine,2.0);\n' +
    '       } else { ' +
    '            spotFactor = 0.0;' +
    '       }' +

    '       if(dot(N,L) <=0.0){' +
      '           gl_FragColor = vec4(0.0,0.0,0.0,1.0);' +
    '      } else{' +
    '           vec3 diffuse = vec3(gl_FragColor) * nDotL;' +
    '           vec3 ambient = vec3(gl_FragColor) * 0.3;' +

    '           vec3 reflection = dot(L,N) * u_lightColor * diffuse;' +
    '           vec3 R = reflect(-L,N);' +
    '           vec3 E = normalize(u_cameraPos - vec3(v_VertPos));' +

    '           float specular = pow(max(dot(E,R), 0.0), 100.0);' +
    '           if(dot(R,E)>0.0){' +
    '               float factor = pow(dot(R,E),2.0);' +
    '               reflection += factor *specular* u_lightColor;' +
    '             }' +
    '           vec3 color = spotFactor*reflection;' +
    '           gl_FragColor = vec4(color, 1.0);' +

    '       }' +
    '' +

    '   }' +

    '}';

let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
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
let u_light;
let u_lightPos;
let u_spotLightPos;
let u_cameraPos;
let u_lightColor;
let u_lightC;


let g_normalOn = false;
let g_lightMoveOn = false;

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

    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if (!u_lightPos) {
        console.log('Failed to get the storage location of u_lightPos');
        return;
    }

    u_spotLightPos = gl.getUniformLocation(gl.program, 'u_spotLightPos');
    if (!u_spotLightPos) {
        console.log('Failed to get the storage location of u_spotLightPos');
        return;
    }


    u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    if (!u_cameraPos) {
        console.log('Failed to get the storage location of u_cameraPos');
        return;
    }

    u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
    if (!u_lightColor) {
        console.log('Failed to get the storage location of u_lightColor');
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

    u_light = gl.getUniformLocation(gl.program, 'u_light');
    if (!u_light) {
        console.log('Failed to get the storage location of u_light');
        return false;
    }
    u_lightC = gl.getUniformLocation(gl.program, 'u_lightC');
    if (!u_lightC) {
        console.log('Failed to get the storage location of u_lightC');
        return false;
    }

    var identifyM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix,false,identifyM.elements);
}




let g_baseTime = 0;

function updateSliders(){
    document.getElementById("angleSlideX").value = g_globalAngleX;
    document.getElementById("angleSlideY").value = g_globalAngleY;
    document.getElementById("angleSlideZ").value = g_globalAngleZ;

    document.getElementById("headSlide").value = g_headAngle;
    document.getElementById("tailSlide").value = g_tailEndAngle;

    document.getElementById("tailSlide0").value = g_tailAngle0;
    document.getElementById("tailSlide1").value = g_tailAngle1;
    document.getElementById("tailSlide2").value = g_tailAngle2;

    document.getElementById("lightAngleSlideX").value = g_lightPos[0]*100;
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

let g_lightPos = [0,1,-2];
let g_lightColor = [1,1,1];

let g_spotlightPos = [0,10,-1];


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

    document.getElementById('normalOn').onclick = function (){g_normalOn = true; };
    document.getElementById('normalOff').onclick = function (){g_normalOn = false; };

    document.getElementById('lightMoveOn').onclick = function (){g_lightMoveOn = true; };
    document.getElementById('lightMoveOff').onclick = function (){g_lightMoveOn = false; };


    document.getElementById('lightOn').onclick = function (){
        gl.uniform1i(u_light, 1); };
    document.getElementById('lightOff').onclick = function (){
        gl.uniform1i(u_light, 0);
        gl.uniform1i(u_lightC, 0);
        g_lightColor = [1,1,1];

        document.getElementById("lightR").value = g_lightColor[0]*255;
        document.getElementById("lightG").value = g_lightColor[1]*255;
        document.getElementById("lightB").value = g_lightColor[2]*255;
    };

    document.getElementById('spotLightOn').onclick = function (){
        gl.uniform1i(u_light, 2); };

    document.getElementById('spotLightOff').onclick = function (){
        gl.uniform1i(u_light, 0);
        gl.uniform1i(u_lightC, 0);
        g_lightColor = [1,1,1];

        document.getElementById("lightR").value = g_lightColor[0]*255;
        document.getElementById("lightG").value = g_lightColor[1]*255;
        document.getElementById("lightB").value = g_lightColor[2]*255;
    };

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

    document.getElementById('lightAngleSlideX').addEventListener('mousemove', function (ev){
        if(ev.buttons == 1){
            g_lightPos[0] = this.value/100;
            //renderScene();
        }
    });
    document.getElementById('lightAngleSlideY').addEventListener('mousemove', function (ev){
        if(ev.buttons == 1){
            g_lightPos[1]= this.value/100;
            //renderScene();
        }
    });
    document.getElementById('lightAngleSlideZ').addEventListener('mousemove', function (ev){
        if(ev.buttons == 1){
            g_lightPos[2] = this.value/100;
            //renderScene();
        }
    });

    document.getElementById('lightR').addEventListener('mousemove', function (ev){
        if(ev.buttons == 1){
            gl.uniform1i(u_lightC, 1);
            g_lightColor[0] = this.value/100;
            //renderScene();
        }
    });
    document.getElementById('lightG').addEventListener('mousemove', function (ev){
        if(ev.buttons == 1){

            gl.uniform1i(u_lightC, 1);
            g_lightColor[1]= this.value/100;
            //renderScene();
        }
    });
    document.getElementById('lightB').addEventListener('mousemove', function (ev){
        if(ev.buttons == 1){

            gl.uniform1i(u_lightC, 1);
            g_lightColor[2] = this.value/100;
            //renderScene();
        }
    });

    document.getElementById('spotSlideX').addEventListener('mousemove', function (ev){
        if(ev.buttons == 1){
            g_spotlightPos[0] = this.value/10;
            //renderScene();
        }
    });
    document.getElementById('spotSlideY').addEventListener('mousemove', function (ev){
        if(ev.buttons == 1){
            g_spotlightPos[1]= this.value/10;
            //renderScene();
        }
    });
    document.getElementById('spotSlideZ').addEventListener('mousemove', function (ev){
        if(ev.buttons == 1){
            g_spotlightPos[2] = this.value/10;
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

var g_eye = [0,0,3];
var g_at = [0,0,-100];
var g_up = [0,1,0];

//let light = new Cube();

let floor = new Cube();
var ball =  new Sphere();

function setupRender(){
    //light.color = [2,2,0,1];

    floor.color = [1.0,0.0,0.0,1.0];
    floor.textureNum = 1;
    floor.matrix.translate(0,-0.75,0.0);
    floor.matrix.scale(32,0,32);
    floor.matrix.translate(-0.5,0,-0.5);

    ball.matrix.translate(-3,.5,-2);
}

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
    var globalRotMat = new Matrix4().rotate(g_globalAngleY,0,1,0);    //2.3
    globalRotMat.rotate(g_globalAngleX,1,0,0);
    globalRotMat.rotate(g_globalAngleZ,0,0,1);


    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);    //2.3

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    gl.uniform3f(u_spotLightPos, g_spotlightPos[0], g_spotlightPos[1], g_spotlightPos[2]);
    gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);
    gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);

    var light = new Cube();
    light.color = [2,2,0,1];
    light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    light.matrix.scale(-.1,-.1,-.1);
    light.matrix.translate(-.5,-.5,-.5);
    light.drawCube();

    //var floor = new Cube();
    /*
    floor.color = [1.0,0.0,0.0,1.0];
    floor.textureNum = 1;
    floor.matrix.translate(0,-0.75,0.0);
    floor.matrix.scale(32,0,32);
    floor.matrix.translate(-0.5,0,-0.5);*/
    floor.drawCube();
    /*
    var sky = new Cube();
    sky.color = [1.0,0.0,0.0,1.0];
    sky.textureNum = 0;
    sky.matrix.scale(50,50,50);
    sky.matrix.translate(-0.5,-0.5,-0.5);
    sky.drawCube();

     */

    var ball =  new Sphere();
    //ball.color = [1,1,1,.5];
    if(g_normalOn) ball.textureNum = -3;
    //ball.matrix.scale(2,2,2);
    ball.matrix.translate(-3,.5,-2);
    ball.render();


    var room = new Cube();

    room.color = [0.8,0.8,0.8,1];
    if(g_normalOn) room.textureNum = -3;
    room.matrix.scale(-10,-8,-10);
    room.matrix.translate(-0.5,-0.5,-0.5);
    room.drawCube();

    var catBody1 = new Cube();
    catBody1.color = [0.3, 0.3, 0.3, 1.0];
    if(g_normalOn) catBody1.textureNum = -3;
        catBody1.matrix.translate(-0.2,-0.2,-0.25);
    //catBody1.matrix.rotate(-5,1,0,0);
    catBody1.matrix.scale(0.4,.4,0.5);
    catBody1.drawCube();

    var catBody2 = new Cube();
    catBody2.color = [0.3, 0.3, 0.3, 1.4];
    catBody2.textureNum = 0;
    if(g_normalOn) catBody2.textureNum = -3;
    catBody2.matrix.translate(-0.1995,-0.1995,0.25);
    //catBody2.matrix.rotate(-5,1,0,0);
    catBody2.matrix.scale(0.399,.399,0.5);
    catBody2.drawCube();

    var head = new Cube();
    head.color = [0.2, 0.2, 0.2, 1.0];
    //if(g_normalOn) head.textureNum = -3;
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
    tail3.drawCube);*/

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

    if(g_lightMoveOn){
        g_lightPos[0] = cos(g_seconds);
        g_spotlightPos[0] = cos(g_seconds);
    }
    updateSliders();
}

var g_seconds = performance.now()/1000;
function tick(){
    //updateSliders();
    g_seconds = performance.now()/1000;
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


            g_camera.mouseX(x - lastX);
            g_camera.mouseY(y - lastY);
            g_at = g_camera.at.elements;
            g_eye = g_camera.eye.elements;
            g_up = g_camera.up.elements;

        }
        lastX = x, lastY = y;
    };


}

var g_camera = new Camera();

function keydown(ev){


    if (ev.keyCode === 68){
        g_camera.right();
    } else if (ev.keyCode === 65) {
        g_camera.left();
    } else if (ev.keyCode === 83){

        g_camera.back();
    } else if (ev.keyCode === 87){
        g_camera.forward();
    } else if (ev.keyCode === 38){
        g_camera.upward();
    } else if (ev.keyCode === 40){
        g_camera.downward();
    }
    if (ev.keyCode === 81){
        g_camera.rotateLeft();
    } else if (ev.keyCode === 69){
        g_camera.rotateRight();
    }

    g_eye = g_camera.eye.elements;
    g_at = g_camera.at.elements;
    g_up = g_camera.up.elements;
}



function main() {

    setupWebGL();

    connectVariablesToGLSL();

    addActionsForHtmlUI();

    document.onkeydown = function(ev){keydown(ev)};
    initTextures();

    gl.clearColor(1.0,0.0,0.0,1.0);

    var currentAngle = [g_globalAngleX,g_globalAngleY];
    initEventHandlers(canvas, currentAngle);

    setupRender();
    requestAnimationFrame(tick);
}