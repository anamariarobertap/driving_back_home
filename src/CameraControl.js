const mouse = {
    position: vec2.fromValues(0,0),
    leftButtonDown: false
};

let camera = {"animationEnabled":false,"position":{"0":0,"1":0,"2":19.400035858154297},"angle":{"yaw":38.199999999999996,"pitch":-12.999999999999993}};

function clamp(x, min, max){
    if (x < min) return min;
    if (x > max) return max;
    return x;
}


function toPos(event,canvas) {
    const rect = canvas.getBoundingClientRect();
    return vec2.fromValues(
        event.clientX - rect.left,
        event.clientY - rect.top);
}

function getViewMatrix(){
    let viewMatrix = mat4.create();
    viewMatrix = mat4.translate(mat4.create(), viewMatrix, vec3.negate(vec3.create(), camera.position));
    viewMatrix = mat4.rotateX(mat4.create(), viewMatrix, glm.deg2rad(-camera.angle.pitch));
    viewMatrix = mat4.rotateY(mat4.create(), viewMatrix, glm.deg2rad(-camera.angle.yaw));
    return viewMatrix;
}

function initCameraControl(canvas) {
    canvas.addEventListener('mousedown', function (event) {
        mouse.position = toPos(event,canvas);
        mouse.leftButtonDown = event.button === 0;
    });
    canvas.addEventListener('mousemove', function (event) {
        const newMousePos = toPos(event,canvas);
        const oldMousePos = mouse.position;
        const delta = vec2.subtract(vec2.create(),newMousePos,oldMousePos);

        if (mouse.leftButtonDown) {
            camera.angle.pitch -= 0.2 * delta[1];
            camera.angle.yaw -= 0.2 * delta[0];
            camera.angle.pitch = clamp(camera.angle.pitch,-178,-0.4);
        }
        mouse.position = newMousePos;
    });
    canvas.addEventListener('mouseup', function (event) {
        mouse.position = toPos(event,canvas);
        mouse.leftButtonDown = false;
    });
    document.addEventListener('keypress', function(event){
        let k = event.key.toUpperCase();
        //  W/S control forward and backward, while A/D control strafing left and right.
        // source: https://en.wikipedia.org/wiki/Arrow_keys#WASD_keys
        let diff = vec3.fromValues(0,0,0);
        if(k == "W"){
            diff = vec4.fromValues(0,0,-1,0);
        }
        if(k=="A"){
            diff = vec4.fromValues(-1,0,0,0);
        }
        if(k=="S"){
            diff = vec4.fromValues(0,0,1,0);
        }
        if(k=="D"){
            diff = vec4.fromValues(1,0,0,0);
        }
        diff = vec3.scale(vec3.create(),diff,0.1);
        camera.position = vec3.add(vec3.create(),camera.position,diff);
    });
}