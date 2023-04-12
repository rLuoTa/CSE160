class Cube{
    constructor() {
        this.type = 'cube';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;
        this.vertex = [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0,
            0.0,0.0,0.0, 1.0,1.0,0.0, 0.0,1.0,0.0,
            0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0,
            0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0,
            0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0,
            0.0,0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,0.0,
            0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0,
            0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0,
            0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,1.0,0.0,
            0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,0.0,1.0,
            1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0,
            1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0
        ];
    }

    drawCube(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        //gl.disableVertexAttribArray(a_Position);
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        //back
        drawTriangle3DUV([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0,
            0.0,0.0,0.0, 1.0,1.0,0.0, 0.0,1.0,0.0],
            [0,0, 1,1, 1,0,
                0,0, 1,1, 0,1]
            );
        //drawTriangle3DUV([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0],[0,0, 1,1, 1,0]);
        //drawTriangle3DUV([0.0,0.0,0.0, 1.0,1.0,0.0, 0.0,1.0,0.0],[0,0, 1,1, 0,1]);
        //drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        //drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);
        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]); //2.3

        //top
        drawTriangle3DUV([0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0,
                0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0],
            [0,0, 0,1, 1,1, 0,0, 1,1, 1,0]);


        /*drawTriangle3D([0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0,
            0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0])*/

        gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
        //bottom

        drawTriangle3DUV([0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0,
                0.0,0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,0.0],
            [0,0, 0,1, 1,1, 0,0, 1,1, 1,0]);
        //drawTriangle3D([0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0]);
        //drawTriangle3D([0.0,0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,0.0]);

        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        //front

        drawTriangle3DUV([0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0,
                0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0],
            [0,0, 1,1, 1,0,0,0, 0,1, 1,1]);
        /*
        drawTriangle3DUV([0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0],[0,0, 1,1, 1,0]);
        drawTriangle3DUV([0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0],[0,0, 0,1, 1,1]);
         */
        //drawTriangle3D([0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0]);
        //drawTriangle3D([0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);

        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]); //2.3
        //left

        drawTriangle3DUV([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,1.0,0.0,
                0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,0.0,1.0,
            1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0,
                1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0],
            [0,0, 1,1, 1,0, 0,0, 1,1, 0,1, 0,0, 1,1, 1,0, 0,0, 1,1, 0,1]);

        /*
        drawTriangle3DUV([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,1.0,0.0],[0,0, 1,1, 1,0]);
        drawTriangle3DUV([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,0.0,1.0],[0,0, 1,1, 0,1]);

         */
        //drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,1.0,0.0]);
        //drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,0.0,1.0]);
        /*
        drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,1.0,0.0,
            0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,0.0,1.0,
            1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0,
            1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0])*/

        //right
        /*
        drawTriangle3DUV([1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0],[0,0, 1,1, 1,0]);
        drawTriangle3DUV([1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0],[0,0, 1,1, 0,1]);

         */

        //drawTriangle3D([1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0]);
        //drawTriangle3D([1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);

    }

    drawCubeFast(){
        var rgba = this.color;
        //var size = this.size;
        //gl.disableVertexAttribArray(a_Position);
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        /*let allVert = [];
        allVert = allVert.concat(
            [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0,
            0.0,0.0,0.0, 1.0,1.0,0.0, 0.0,1.0,0.0]);
        allVert = allVert.concat(
            [0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0,
            0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0]);
        allVert = allVert.concat(
            [0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0,
            0.0,0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,0.0]);
        allVert = allVert.concat(
            [0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0,
            0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
        allVert = allVert.concat(
            [0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,1.0,0.0,
            0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,0.0,1.0]);
        allVert = allVert.concat(
            [1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0,
            1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);*/

        let allUV = [];
        allUV = allUV.concat([0,0, 1,1, 1,0, 0,0, 1,1, 0,1]);
        allUV = allUV.concat([0,0, 0,1, 1,1, 0,0, 1,1, 1,0]);
        allUV = allUV.concat([0,0, 0,1, 1,1, 0,0, 1,1, 1,0]);
        allUV = allUV.concat([0,0, 1,1, 1,0,0,0, 0,1, 1,1]);
        allUV = allUV.concat([0,0, 1,1, 1,0, 0,0, 1,1, 0,1]);
        allUV = allUV.concat([0,0, 1,1, 1,0, 0,0, 1,1, 0,1]);

        if (g_vertexBufferCube == null){
            initTriangle3D(this.vertex);
        }
        //if (g_uvBuffer = null){
        //    initUV(allUV);
        //}

        //gl.bufferData(gl.ARRAY_BUFFER, this.vertex, gl.DYNAMIC_DRAW);
        drawTriangle3DUV(this.vertex, allUV);
        //gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}