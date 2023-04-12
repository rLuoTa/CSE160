class Triangle{
    constructor() {
        this.type = 'triangle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];

        this.buffer = null;

    }

    render(){
        var xy = this.position;
        var rgba = this.color;

        if(this.buffer === null){
            this.buffer = gl.createBuffer();
            if (!this.buffer){
                console.log("Fail to create the buffer object");
                return -1;
            }
        }

        gl.disableVertexAttribArray(a_Position);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniform1f(u_Size, size);

        //gl.drawArrays(gl.POINTS, 0, 1);
        drawT( [xy[0], xy[1], xy[0]+.05*size/10, xy[1]-.1*size/10, xy[0]-.05*size/10, xy[1]-.1*size/10]);
    }
}


function drawT(vertices){
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);


    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}


function drawTriangle3D(vertices){
    //var n = 3;
    let n = vertices.length/3;

    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }
/*
    if(this.buffer === null){
        this.buffer = gl.createBuffer();
        if (!this.buffer){
            console.log("Fail to create the buffer object");
            return -1;
        }
    }
*/


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);


    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}