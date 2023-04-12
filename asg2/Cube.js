class Cube{
    constructor() {
        this.type = 'cube';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = g_selectSize;
        //this.segments = 10;
        this.matrix = new Matrix4();
    }

    drawCube(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        //gl.disableVertexAttribArray(a_Position);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        //back
        //drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        //drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);
        drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0,
            0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0])

        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]); //2.3

        //top
        //drawTriangle3D([0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0]);
        //drawTriangle3D([0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0]);
        drawTriangle3D([0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0,
            0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0])

        gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
        //bottom
        //drawTriangle3D([0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0]);
        //drawTriangle3D([0.0,0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,0.0]);
        drawTriangle3D([0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0,
            0.0,0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,0.0])

        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        //front
        //drawTriangle3D([0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0]);
        //drawTriangle3D([0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
        drawTriangle3D([0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0,
            0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0])

        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]); //2.3
        //left
        //drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,1.0,0.0]);
        //drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,0.0,1.0]);
        drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,1.0,0.0,
            0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,0.0,1.0,
            1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0,
            1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0])

        //right
        //drawTriangle3D([1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0]);
        //drawTriangle3D([1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);

    }
}