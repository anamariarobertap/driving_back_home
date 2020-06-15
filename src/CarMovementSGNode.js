class CarMovementSGNode extends TransformationSGNode{
    constructor(children) {
        super(mat4.create(),children);
        // order of the elements in the array is irrelevant
        this.movementData = [
            {
                timeInMs: 0,
                position: vec3.fromValues(10,0,0),
                rotation:vec3.fromValues(0,90,0)
            },         {
                timeInMs: 5000,
                position: vec3.fromValues(10,0,60),
                rotation:vec3.fromValues(0,90,0)
            },        {
                timeInMs: 5050,
                position: vec3.fromValues(10,0,60),
                rotation:vec3.fromValues(0,0,0)
            },
            {
                timeInMs: 6000,
                position: vec3.fromValues(10,0,1),
                rotation:vec3.fromValues(0,0,0)
            },
            {
                timeInMs: 6100,
                position: vec3.fromValues(10,0,1),
                rotation:vec3.fromValues(0,180,0)
            },
            {
                timeInMs: 9100,
                position: vec3.fromValues(10,0,1),
                rotation:vec3.fromValues(0,180,0)
            },
            {
                timeInMs: 10100,
                position: vec3.fromValues(10,0,1),
                rotation:vec3.fromValues(0,90,0)
            },
            {
                timeInMs: 13000,
                position: vec3.fromValues(10,0,30),
                rotation:vec3.fromValues(0,90,0)
            },
            {
                timeInMs: 14000,
                position: vec3.fromValues(10,0,32),
                rotation:vec3.fromValues(0,0,0)
            },
            {
                timeInMs: 16000,
                position: vec3.fromValues(-1,0,32),
                rotation:vec3.fromValues(0,0,0)
            },{
                timeInMs: 18000,
                position: vec3.fromValues(-1,0,32),
                rotation:vec3.fromValues(0,0,0)
            },{
                timeInMs: 20000,
                position: vec3.fromValues(-6,0,32),
                rotation:vec3.fromValues(0,0,0)
            },{
                timeInMs: 21000,
                position: vec3.fromValues(-6,0,32),
                rotation:vec3.fromValues(0,-90,0)
            },{
                timeInMs: 22000,
                position: vec3.fromValues(-6,0,20),
                rotation:vec3.fromValues(0,-90,0)
            },{
                timeInMs: 23000,
                position: vec3.fromValues(-6,0,20),
                rotation:vec3.fromValues(5,-90,0)
            },{
                timeInMs: 30000,
                position: vec3.fromValues(-6,5,0),
                rotation:vec3.fromValues(5,-90,0)
            }
        ];

        // sort the array movementData according to the timeInMs in ascending order
        this.movementData.sort(function(a,b){
            return a.timeInMs - b.timeInMs;
        });
    }

    computeCameraInfo(timeInMs){
        if(timeInMs == 0) return this.movementData[0];
        let res = {
            position: vec3.fromValues(0, 0, 0),
        }
        if(timeInMs > this.movementData[this.movementData.length-1].timeInMs) {
             return this.movementData[this.movementData.length - 1];
        }
        else {
            let i = upperBound(this.movementData, function (a, b) {
                return a.timeInMs - b
            }, timeInMs);
            if(i>=this.movementData.length) return this.movementData[this.movementData.length-1];

            let startM = this.movementData[i - 1];
            let endM = this.movementData[i];

            // interpolate between startM and endM linearly
            res.position = linearInterpolation(startM.timeInMs,startM.position,endM.timeInMs,endM.position,timeInMs);
            res.rotation = linearInterpolation(startM.timeInMs,startM.rotation,endM.timeInMs,endM.rotation,timeInMs);
        }
        return res;
    }
    render(context) {
        let timeInMilli = context.timeInMilliseconds;
        if(!timeInMilli){
            timeInMilli = 0;
        }
        let cam = this.computeCameraInfo(timeInMilli);
        let viewMatrix = mat4.create();
        viewMatrix = mat4.translate(mat4.create(), viewMatrix, cam.position);
        viewMatrix = mat4.rotateX(mat4.create(), viewMatrix, glm.deg2rad(cam.rotation[0]));
        viewMatrix = mat4.rotateY(mat4.create(), viewMatrix, glm.deg2rad(cam.rotation[1]));
        viewMatrix = mat4.rotateZ(mat4.create(), viewMatrix, glm.deg2rad(cam.rotation[2]));
        this.matrix = viewMatrix;
        super.render(context);
    }
}