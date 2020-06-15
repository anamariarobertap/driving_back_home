class AnimationSGNode extends TransformationSGNode{
    constructor(children,animationFinished) {
        super(mat4.create(),children);
        this.animationFinished = animationFinished;
        // order of the elements in the array is irrelevant
        this.movementData = [
            {
                timeInMs: 0,
                position: vec3.fromValues(0,0,0),
                angle: {
                    yaw : 0,
                    pitch : 0
                }
            },
            {
                timeInMs: 3000,
                position: vec3.fromValues(0,0,-5),
                angle: {
                    yaw : 20,
                    pitch : 0
                }
            },
            {
                timeInMs: 6000,
                position: vec3.fromValues(0,0,-1),
                angle: {
                    yaw : 90,
                    pitch : 0
                }
            },
            {
                timeInMs: 8000,
                position: vec3.fromValues(0,0,-1),
                angle: {
                    yaw : 90,
                    pitch : -10
                }
            },
            {
                timeInMs: 16000,
                position: vec3.fromValues(0,0,0),
                angle: {
                    yaw : 360,
                    pitch : 0
                }
            },
            {
                timeInMs: 30000,
                position: vec3.fromValues(0,0,0),
                angle: {
                    yaw : 0,
                    pitch : 0
                }
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
            position: vec3.fromValues(0,0,0),
            angle: {
                yaw : 0,
                pitch : 0
            }
        };
            let i = upperBound(this.movementData, function (a, b) {
                return a.timeInMs - b
            }, timeInMs);
            if(i>=this.movementData.length) return this.movementData[this.movementData.length-1];

            let startM = this.movementData[i - 1];
            let endM = this.movementData[i];

            // interpolate between startM and endM linearly
            res.position = linearInterpolation(startM.timeInMs,startM.position,endM.timeInMs,endM.position,timeInMs);
            res.angle.pitch = linearInterpolation(startM.timeInMs,startM.angle.pitch,endM.timeInMs,endM.angle.pitch,timeInMs);
            res.angle.yaw = linearInterpolation(startM.timeInMs,startM.angle.yaw,endM.timeInMs,endM.angle.yaw,timeInMs);

        return res;
    }
    render(context) {
        let timeInMilli = context.timeInMilliseconds;
        if(!timeInMilli){
            timeInMilli = 0;
        }
        let cam = this.computeCameraInfo(timeInMilli);
        let viewMatrix = mat4.create();
        viewMatrix = mat4.translate(mat4.create(), viewMatrix, vec3.negate(vec3.create(), cam.position));
        viewMatrix = mat4.rotateX(mat4.create(), viewMatrix, glm.deg2rad(-cam.angle.pitch));
        viewMatrix = mat4.rotateY(mat4.create(), viewMatrix, glm.deg2rad(-cam.angle.yaw));
        this.matrix = viewMatrix;
        super.render(context);
    }
}