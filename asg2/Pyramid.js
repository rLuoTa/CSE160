class Pyramid{
    constructor() {
        this.type = 'pyramid';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        //gl.disableVertexAttribArray(a_Position);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        //back
        //drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        //drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,0.0,0.0,
            0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,0.0,
            0.0,0.0,1.0,  0.0,1.0,0.0,  1.0,0.0,0.0,
            0.0,0.0,0.0,  0.0,1.0,0.0,  0.0,0.0,1.0])

    }
}