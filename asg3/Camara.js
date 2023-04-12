class Camera{
    constructor() {
        this.fov = 60.0;
        this.eye = new Vector3([0,0,3]);
        this.at = new Vector3([0,0,-100]);
        this.up = new Vector3([0,1,0]);

        this.f = new Vector3();

        this.f.set(this.at);
        this.f.sub(this.eye);
        this.f.normalize();

        this.rotationMatrix = new Matrix4();
        //this.hori = Vector3.cross(this.f, this.up);


        this.speed = 0.3;
        this.alpha = 5;
        /*this.viewMat = new Matrix4();
        this.viewMat.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
            this.at.elements[0],this.at.elements[1],this.at.elements[2],
            this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        this.projMat = new Matrix4();
        this.projMat.setPerspective(this.fov, 1, 0.1,1000);

         */
    }
    forward(){
        /*
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(this.speed);
        this.at.add(f);
        this.eye.add(f);*/
        this.f.set(this.at);
        this.f.sub(this.eye);
        this.f.normalize();
        this.f.mul(this.speed);
        this.at.add(this.f);
        this.eye.add(this.f);
    }
    back(){
        //var f = new Vector3();
        this.f.set(this.eye);
        this.f.sub(this.at);
        this.f.normalize();
        this.f.mul(this.speed);
        this.at.add(this.f);
        this.eye.add(this.f);
    }

    left(){
        //var f = new Vector3();
        this.f.set(this.eye);
        this.f.sub(this.at);
        this.f.normalize();
        let s = Vector3.cross(this.f,this.up);
        s.normalize();
        s.mul(this.speed);
        this.at.add(s);
        this.eye.add(s);
    }
    right() {
        //var f = new Vector3();
        this.f.set(this.eye);
        this.f.sub(this.at);
        this.f.normalize();
        let s = Vector3.cross(this.f, this.up);
        s.normalize();
        s.mul(this.speed);
        this.at.sub(s);
        this.eye.sub(s);
    }
    upward(){
        var f = new Vector3([0,this.speed,0]);
        this.up.add(f);
        this.at.add(f);
        this.eye.add(f);
    }
    downward(){
        var f = new Vector3([0,-1*this.speed,0]);
        this.up.add(f);
        this.at.add(f);
        this.eye.add(f);
    }
    rotateLeft(){
        //var f = new Vector3();
        this.f.set(this.at);
        this.f.sub(this.eye);
        //let rotationMatrix = new Matrix4();
        this.rotationMatrix.setIdentity();
        this.rotationMatrix.setRotate(this.alpha,
            this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        this.f = this.rotationMatrix.multiplyVector3(this.f);
        this.at.set(this.f.add(this.eye));

        /*
        let x = [this.at.elements[0] - this.eye.elements[0],0,
            this.at.elements[2]-this.eye.elements[2]];
        let d = Math.sqrt(x[0]*x[0]+x[2]*x[2]);
        let theta = Math.atan(x[2]/x[0]);
        console.log(theta)
        theta += 5*Math.PI/180;

        console.log(theta)
        x[0] = d*Math.cos(theta);
        x[2] = d*Math.sin(theta);
        this.at.elements[0] = x[0];
        this.at.elements[2] = x[2];
        console.log(this.at.elements);
        */

    }
    rotateRight(){
        //var f = new Vector3();
        this.f.set(this.at);
        this.f.sub(this.eye);
        //let rotationMatrix = new Matrix4();
        this.rotationMatrix.setIdentity();
        this.rotationMatrix.setRotate(-1*this.alpha,
            this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        this.f = this.rotationMatrix.multiplyVector3(this.f);
        this.at.set(this.f.add(this.eye));
        /*
        let x = [this.at.elements[0]-this.eye.elements[0],0,
            this.at.elements[2]-this.eye.elements[2]];
        let d = Math.sqrt(x[0]*x[0]+x[2]*x[2]);
        let theta = Math.atan(x[2]/x[0]);
        console.log(theta)
        theta -= 5*Math.PI/180;
        console.log(theta)
        x[0] = d*Math.cos(theta);
        x[2] = d*Math.sin(theta);
        this.at.elements[0] = x[0];
        this.at.elements[2] = x[2];

         */
        //console.log(this.at.elements);
    }
    mouseX(alpha){
        this.f.set(this.at);
        this.f.sub(this.eye);
        //let rotationMatrix = new Matrix4();
        this.rotationMatrix.setIdentity();
        this.rotationMatrix.setRotate(alpha,
            this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        this.f = this.rotationMatrix.multiplyVector3(this.f);
        this.at.set(this.f.add(this.eye));
    }
    mouseY(alpha){
        this.f.set(this.at);
        this.f.sub(this.eye);
        //let rotationMatrix = new Matrix4();
        this.rotationMatrix.setIdentity();
        let hori = Vector3.cross(this.f, this.up);
        this.rotationMatrix.setRotate(alpha,
            hori.elements[0],hori.elements[1],hori.elements[2]);
        this.f = this.rotationMatrix.multiplyVector3(this.f);
        this.at.set(this.f.add(this.eye));
    }

}