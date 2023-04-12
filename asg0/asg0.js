// DrawRectangle.js
function main() {
    // Retrieve the <canvas> element
    canvas = document.getElementById('cnv1');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return false;
    }
    // Get the rendering context for 2DCG
    ctx = canvas.getContext('2d');
    // Draw a blue rectangle
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a blue color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

    let v1 = new Vector3([2.25,2.25,0]);
    drawVector(v1, 'red');

}

function drawVector(v, color){
    let x = v.elements[0]*20;
    let y = v.elements[1]*20;
    let cx = canvas.width/2;
    let cy = canvas.height/2;

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx + x, cy-y);
    ctx.stroke();
}

function handleDrawEvent(){

    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

    let v1x = document.getElementById("x1").value;
    let v1y = document.getElementById("y1").value;
    let v2x = document.getElementById("x2").value;
    let v2y = document.getElementById("y2").value;

    let v1 = new Vector3([v1x,v1y,0]);
    let v2 = new Vector3([v2x,v2y,0]);
    drawVector(v1, 'red');
    drawVector(v2, 'blue');
}

function handleDrawOperationEvent(){

    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

    let v1x = document.getElementById("x1").value;
    let v1y = document.getElementById("y1").value;
    let v2x = document.getElementById("x2").value;
    let v2y = document.getElementById("y2").value;

    let v1 = new Vector3([v1x,v1y,0]);
    let v2 = new Vector3([v2x,v2y,0]);
    drawVector(v1, 'red');
    drawVector(v2, 'blue');

    let op = document.getElementById("operation-select");
    let index = op.selectedIndex;
    let val = op.options[index].value;
    //console.log(val);

    let s = document.getElementById("scalar").value;

    if (val == 'add'){
        v1.add(v2);
        drawVector(v1, 'green');
    }
    if (val == 'sub'){
        v1.sub(v2);
        drawVector(v1, 'green');
    }
    if (val == 'div'){
        v1.div(s);
        v2.div(s);
        drawVector(v1, 'green');
        drawVector(v2, 'green');
    }
    if (val == 'mul'){
        v1.mul(s);
        v2.mul(s);
        drawVector(v1, 'green');
        drawVector(v2, 'green');
    }
    if (val == 'ang'){
        angleBetween(v1,v2);
    }
    if (val == 'are'){
        areaTriangle(v1, v2);
    }
    if (val == 'mag'){
        console.log('Magnitude v1: ', v1.magnitude());
        console.log('Magnitude v2: ', v2.magnitude());
    }

    if (val == 'nor'){
        v1.normalize();
        v2.normalize();
        drawVector(v1, 'green');
        drawVector(v2, 'green');
    }

}

function angleBetween(v1, v2){
    let d = Vector3.dot(v1,v2);
    let a = v1.magnitude();
    let b = v2.magnitude();
    let c = d/(a*b);
    let ang = Math.acos(0);
    console.log("Angle: ",Math.round(ang*180/Math.PI));
}

function areaTriangle(v1, v2) {
    let v3 = Vector3.cross(v1,v2);
    let area = v3.magnitude()/2;
    console.log("Area of the triangle: ",area);
}