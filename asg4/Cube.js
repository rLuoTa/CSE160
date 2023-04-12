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


       let allVert = [];
        allVert = allVert.concat(
            [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0,     0,0,0, 0,1,0, 1,1,0]);
        allVert = allVert.concat(
            [0,0,1, 1,1,1, 1,0,1,   0,0,1, 0,1,1, 1,1,1]);
        allVert = allVert.concat(
            [0,1,0, 0,1,1, 1,1,1,   0,1,0, 1,1,1, 1,1,0]);
        allVert = allVert.concat(
            [0,0,0, 0,0,1, 1,0,1,   0,0,0, 1,0,1, 1,0,0]);
        allVert = allVert.concat(
            [1,1,0, 1,1,1, 1,0,0,   1,0,0, 1,1,1, 1,0,1]);
        allVert = allVert.concat(
            [0,1,0, 0,1,1, 0,0,0,   0,0,0, 0,1,1, 0,0,1]);



        let allUV = [];
        allUV = allUV.concat([0,0, 1,1, 1,0,    0,0, 0,1, 1,1]);
        allUV = allUV.concat([0,0, 1,1, 1,0,    0,0, 0,1, 1,1]);
        allUV = allUV.concat([0,0, 0,1, 1,1,    0,0, 1,1, 1,0]);
        allUV = allUV.concat([0,0, 0,1, 1,1,    0,0, 1,1, 1,0]);
        allUV = allUV.concat([0,0, 0,1, 1,1,    0,0, 1,1, 1,0]);
        allUV = allUV.concat([0,0, 0,1, 1,1,    0,0, 1,1, 1,0]);

        let allNorm = [];
        allNorm = allNorm.concat([0,0,-1, 0,0,-1, 0,0,-1,    0,0,-1, 0,0,-1, 0,0,-1]);
        allNorm = allNorm.concat([0,0,1, 0,0,1, 0,0,1,    0,0,1, 0,0,1, 0,0,1]);
        allNorm = allNorm.concat([0,1,0, 0,1,0, 0,1,0,    0,1,0, 0,1,0, 0,1,0]);
        allNorm = allNorm.concat([0,-1,0, 0,-1,0, 0,-1,0,    0,-1,0, 0,-1,0, 0,-1,0]);
        allNorm = allNorm.concat([1,0,0, 1,0,0, 1,0,0,    1,0,0, 1,0,0, 1,0,0]);
        allNorm = allNorm.concat([-1,0,0, -1,0,0, -1,0,0,    -1,0,0, -1,0,0, -1,0,0]);

        drawTriangle3DUVNormal(allVert, allUV, allNorm);

/*
        //front
        drawTriangle3DUVNormal([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);
        drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);

        //back
        drawTriangle3DUVNormal([0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [0,0,1, 0,0,1, 0,0,1]);
        drawTriangle3DUVNormal([0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1]);

        //top

        drawTriangle3DUVNormal([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0]);
        drawTriangle3DUVNormal([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0]);

        //bottom

        drawTriangle3DUVNormal([0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
        drawTriangle3DUVNormal([0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0], [0,-1,0, 0,-1,0, 0,-1,0]);

        //Right
        drawTriangle3DUVNormal([1,1,0, 1,1,1, 1,0,0], [0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0]);
        drawTriangle3DUVNormal([1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [1,0,0, 1,0,0, 1,0,0]);
        //gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]); //2.3

        //Left
        drawTriangle3DUVNormal([0,1,0, 0,1,1, 0,0,0], [0,0, 0,1, 1,1], [-1,0,0, -1,0,0, -1,0,0]);
        drawTriangle3DUVNormal([0,0,0, 0,1,1, 0,0,1], [0,0, 1,1, 1,0], [-1,0,0, -1,0,0, -1,0,0]);


 */
    }

}