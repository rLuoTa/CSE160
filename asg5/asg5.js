//import * as THREE from './three.js-master/build/three.module.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

function main() {


    const canvas = document.querySelector('#c');
    const view1Elem = document.querySelector('#view1');
    const view2Elem = document.querySelector('#view2');

    const renderer = new THREE.WebGLRenderer({
        canvas,
        logarithmicDepthBuffer: true,
    });

    //setup camera
    const fov = 45;
    const aspect = 2;
    const near = 5;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);


    const cameraHelper = new THREE.CameraHelper(camera);

    const controls = new OrbitControls(camera, view1Elem);
    controls.target.set(0, 5, 0);
    controls.update();

    const camera2 = new THREE.PerspectiveCamera(
        60,  // fov
        2,   // aspect
        0.1, // near
        500, // far
    );
    camera2.position.set(40, 10, 30);
    camera2.lookAt(0, 5, 0);

    const controls2 = new OrbitControls(camera2, view2Elem);
    controls2.target.set(0, 5, 0);
    controls2.update();

    const scene = new THREE.Scene();
    scene.add(cameraHelper);
    //fog
    {
        const color = 0xFFFFFF;  // white
        const near = 0;
        const far = 100;
        scene.fog = new THREE.Fog(color, near, far);
    }

    //set up floor
    {
        const planeSize = 100;

        const loader = new THREE.TextureLoader();
        const texture = loader.load('resources/images/grass.webp');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        mesh.position.y = 0.1;
        scene.add(mesh);
    }
    //set up skybox
    {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(
            'resources/images/sky.webp',
            () => {
                const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                rt.fromEquirectangularTexture(renderer, texture);
                scene.background = rt.texture;
            });
        console.log("sky")
    }
    {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);

        const loader = new THREE.TextureLoader();
        const sphereMat = new THREE.MeshPhongMaterial({
            map: loader.load('resources/images/box.jpg'),
        });
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
        scene.add(mesh);
    }
    {
        const sphereRadius = 2;
        const sphereWidthDivisions = 16;
        const sphereHeightDivisions = 8;
        const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);

        const loader = new THREE.TextureLoader();
        const sphereMat = new THREE.MeshPhongMaterial({
            map: loader.load('resources/images/box.jpg'),
        });
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-3, 3, 4);
        scene.add(mesh);
    }

        const width = 3;  // ui: width
        const height = 3;  // ui: height
        const depth = 3;  // ui: depth

        const loader = new THREE.TextureLoader();
        const geometry0 = new THREE.BoxGeometry(width, height, depth);
        const material0 = new THREE.MeshPhongMaterial({
            map: loader.load('resources/images/box.jpg'),
        });
        const cube0 = new THREE.Mesh(geometry0, material0);
        cube0.position.set( 3,  2.5, 0);
        scene.add(cube0);


        const rtWidth = 512;
        const rtHeight = 512;
        const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

        const rtFov = 75;
        const rtAspect = rtWidth / rtHeight;
        const rtNear = 0.1;
        const rtFar = 5;
        const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
        rtCamera.position.z = 2;

        const rtScene = new THREE.Scene();
        rtScene.background = new THREE.Color(0x83d7ee);
        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            rtScene.add(light);
        }
        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

        function makeInstance(geometry, color, x) {
            const material = new THREE.MeshPhongMaterial({color});

            const cube = new THREE.Mesh(geometry, material);
            rtScene.add(cube);

            cube.position.x = x;

            return cube;
        }
        const rtCubes = [
            makeInstance(geometry, 0x44aa88,  0),
            makeInstance(geometry, 0x8844aa, -2),
            makeInstance(geometry, 0xaa8844,  2),
        ];

        const material = new THREE.MeshPhongMaterial({
            map: renderTarget.texture,
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0,9,0);
        scene.add(cube);

    //heart
    {
        const shape = new THREE.Shape();
        const x = -2.5;
        const y = -5;
        shape.moveTo(x + 2.5, y + 2.5);
        shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
        shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
        shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
        shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
        shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
        shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

        const extrudeSettings = {
            steps: 2,  // ui: steps
            depth: 2,  // ui: depth
            bevelEnabled: true,  // ui: bevelEnabled
            bevelThickness: 1,  // ui: bevelThickness
            bevelSize: 1,  // ui: bevelSize
            bevelSegments: 2,  // ui: bevelSegments
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const loader = new THREE.TextureLoader();
        const material = new THREE.MeshBasicMaterial({
            map: loader.load('resources/images/box.jpg'),
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( 0, 8, -6);
        scene.add(mesh);

        const mesh1 = new THREE.Mesh(geometry, material);
        mesh1.position.set( -5, 8, -9);
        scene.add(mesh1);

        const mesh2 = new THREE.Mesh(geometry, material);
        mesh2.position.set( 5, 8, -9);
        scene.add(mesh2);
    }
    {
        const radius = 4;  // ui: radius
        const height = 8;  // ui: height
        const radialSegments = 16;  // ui: radialSegments
        const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( 15, 5, -15);
        scene.add(mesh);
    }
    {
        const radiusTop = 4;  // ui: radiusTop
        const radiusBottom = 4;  // ui: radiusBottom
        const height = 8;  // ui: height
        const radialSegments = 12;  // ui: radialSegments
        const geometry = new THREE.CylinderGeometry(
            radiusTop, radiusBottom, height, radialSegments);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( -15, 5, -15);
        scene.add(mesh);
    }
    {
        const radius = 7;  // ui: radius
        const geometry = new THREE.DodecahedronGeometry(radius);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( -15, 6, 15);
        scene.add(mesh);
    }
    {
        const radius = 7;  // ui: radius
        const geometry = new THREE.IcosahedronGeometry(radius);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( 15, 6, 15);
        scene.add(mesh);
    }
    {
        const radius = 7;  // ui: radius
        const geometry = new THREE.OctahedronGeometry(radius);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( 20, 5, 0);
        scene.add(mesh);
    }
    {
        const radius = 7;  // ui: radius
        const geometry = new THREE.DodecahedronGeometry(radius);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( -20, 6, 0);
        scene.add(mesh);
    }
    {
        const radius = 4;  // ui: radius
        const height = 8;  // ui: height
        const radialSegments = 16;  // ui: radialSegments
        const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( 0, 5, -20);
        scene.add(mesh);
    }
    {
        const radiusTop = 4;  // ui: radiusTop
        const radiusBottom = 4;  // ui: radiusBottom
        const height = 8;  // ui: height
        const radialSegments = 12;  // ui: radialSegments
        const geometry = new THREE.CylinderGeometry(
            radiusTop, radiusBottom, height, radialSegments);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( 0, 5, 20);
        scene.add(mesh);
    }
    {
        const radiusTop = 2;  // ui: radiusTop
        const radiusBottom = 4;  // ui: radiusBottom
        const height = 16;  // ui: height
        const radialSegments = 12;  // ui: radialSegments
        const geometry = new THREE.CylinderGeometry(
            radiusTop, radiusBottom, height, radialSegments);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( 0, 5, 30);
        scene.add(mesh);
    }
    {
        const radius = 7;  // ui: radius
        const widthSegments = 12;  // ui: widthSegments
        const heightSegments = 8;  // ui: heightSegments
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( 15, 20, 15);
        scene.add(mesh);
    }
    {
        const radius = 7;  // ui: radius
        const geometry = new THREE.OctahedronGeometry(radius);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( 15, 20, -15);
        scene.add(mesh);
    }
    {
        const radius = 7;  // ui: radius
        const geometry = new THREE.DodecahedronGeometry(radius);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( -15, 20, -15);
        scene.add(mesh);
    }
    {
        const radius = 4;  // ui: radius
        const height = 8;  // ui: height
        const radialSegments = 16;  // ui: radialSegments
        const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( -15, 20, 15);
        scene.add(mesh);
    }
    //obj
    {
        const mtlLoader = new MTLLoader();
        mtlLoader.load('./resources/objs/ball.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('./resources/objs/ball.obj', (root) => {
                scene.add(root);
            });
        });
    }

    //light
    //ambient
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);
    }
    //direct
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 10, 0);
        light.target.position.set(-5, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }
    //spot
    {
        const color = 0xFFFFFF;
        const intensity = .5;
        const light = new THREE.SpotLight(color, intensity);
        light.position.set(5, 10,5);
        light.target.position.set(5, 0,5);
        scene.add(light);
        scene.add(light.target);
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }
    //camera
    function setScissorForElement(elem) {
        const canvasRect = canvas.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();

        // 计算canvas的尺寸
        const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
        const left = Math.max(0, elemRect.left - canvasRect.left);
        const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
        const top = Math.max(0, elemRect.top - canvasRect.top);

        const width = Math.min(canvasRect.width, right - left);
        const height = Math.min(canvasRect.height, bottom - top);

        // 设置剪函数以仅渲染一部分场景
        const positiveYUpBottom = canvasRect.height - bottom;
        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);

        // 返回aspect
        return width / height;
    }


    function render(time) {
        time *= 0.001;  // 将时间单位变为秒

        cube0.rotation.x = time;
        cube0.rotation.y = time;

        cube.rotation.x = time;
        cube.rotation.y = time;

        rtCubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        renderer.setRenderTarget(renderTarget);
        renderer.render(rtScene, rtCamera);
        renderer.setRenderTarget(null);

        resizeRendererToDisplaySize(renderer);

        // 启用剪刀函数
        renderer.setScissorTest(true);

        // 渲染主视野
        {
            const aspect = setScissorForElement(view1Elem);

            // 用计算出的aspect修改摄像机参数
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
            cameraHelper.update();

            // 来原视野中不要绘制cameraHelper
            cameraHelper.visible = false;

            // 渲染
            renderer.render(scene, camera);
        }

        // 渲染第二台摄像机
        {
            const aspect = setScissorForElement(view2Elem);

            // 调整aspect
            camera2.aspect = aspect;
            camera2.updateProjectionMatrix();

            // 在第二台摄像机中绘制cameraHelper
            cameraHelper.visible = true;

            renderer.render(scene, camera2);
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
