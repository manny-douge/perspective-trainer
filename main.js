var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(5, 8, 13);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x404040);
document.body.appendChild(renderer.domElement);

var timed_interval = null;
var timed_x_interval = null;
var timed_y_interval = null;
var timed_z_interval = null;

var controls = new THREE.OrbitControls(camera, renderer.domElement);
var geom = new THREE.BoxBufferGeometry( 8, 8, 8 );

var material = new THREE.ShaderMaterial({
  uniforms: {
    size: {
      value: new THREE.Vector3(geom.parameters.width, 
                               geom.parameters.height,  
                               geom.parameters.depth).multiplyScalar(0.5)
    },
    thickness: {
    	value: 0.01
    },
    smoothness: {
    	value: 0.02
    }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
});

var params = {
    RandomAngle: random_angle, 
    TimedAngle: timed_random, 
    IncrementalAngle: timed_incremental, 
    Timer: "Not running",
    'custom timer': 5,
    RotateX: rotate_x_timed,
    RotateY: rotate_y_timed,
    RotateZ: rotate_z_timed,
};
var cube = new THREE.Mesh( geom, material );
scene.add( cube );

var gui = new dat.GUI();
gui.add(material.uniforms.thickness, "value", 0.01, 1.0).name("line thickness");
gui.add(params, 'RandomAngle').name("Random angle");
gui.add(params, 'TimedAngle').name("Timed random 30");
gui.add(params, 'IncrementalAngle').name("Timed incre");
gui.add(params, 'custom timer', 0, 60, 1).name("custom timer:");
gui.add(params, 'Timer').name("Time remaining:").listen();
gui.add(params, 'RotateX').name("Rotate X-axis");
gui.add(params, 'RotateY').name("Rotate Y-axis");
gui.add(params, 'RotateZ').name("Rotate Z-axis");
//gui.add(material.uniforms.smoothness, "value", 0.01, 1.0).name("smoothness");

render();

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    //cube.rotation.z += 0.01;
}

function timed_random() {
    timed(random_angle, timed_interval);
}

function timed_incremental() {
    random_angle();
    timed(incremental_angle, timed_interval);
}

function rotate_x_timed() {
    timed(function() {
        cube.rotation.x += 0.1;
    }, timed_x_interval);
}

function rotate_y_timed() {
    timed(function() {
        cube.rotation.y += 0.1;
    }, timed_y_interval);
}

function rotate_z_timed() {
    timed(function() {
        cube.rotation.z += 0.1;
    }, timed_z_interval);
}


function timed(cube_mod, interval) {
    let seconds = params['custom timer'];
    let iters = seconds;
    if(interval) {
        clearInterval(interval);
        interval = null;
    }

    interval = setInterval( function() {
        if(iters == 0) {
            cube_mod();
            iters = seconds;
        }    
        iters--;
        params.Timer = `${iters} seconds left...`;
    }, 1000);
}

function incremental_angle() {
    console.log("Incremen");
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    cube.rotation.z += 0.1;
}

function random_angle() {
console.log(`Default cube ${cube.rotation.x} ${cube.rotation.y}`);
    console.log("Showing random angle");
    //controls.panUp();
    cube.rotation.x = 0;
    cube.rotation.y = 0;
    cube.rotation.z = 0;
    cube.rotation.x =  Math.floor(Math.random() * Math.floor(360));
    cube.rotation.y =  Math.floor(Math.random() * Math.floor(360));
    cube.rotation.z =  Math.floor(Math.random() * Math.floor(360));
}
