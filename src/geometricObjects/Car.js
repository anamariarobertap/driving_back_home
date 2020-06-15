/*
* Returns two sg nodes, which represents a car.
* The resources parameter should contain the carTireFront property.
* The structure contains the following properties: rootNode, tireTransformation
* rootNode represents a sg node, which contains the whole car.
* The tireTransformation sg node is above all tires.
* This sg node can be used for rotating the tire for instance.
 */
function initCar(textureProgram,resources){
    let rectSGNode = sg.draw(makeRect(1,1));
   //let tireRotationTrans = new TransformationSGNode(mat4.create());

    // ---------- Start Tire ---------- //
    let tireRadius = 0.2;
    // tire is defined as TransformationSGNode to allow afterwards rotation over the time
    let tire = new TransformationSGNode(mat4.create(),
        new TransformationSGNode(glm.scale(tireRadius,tireRadius,0.1),sg.draw(initRegularOctagonalPrism())));

    let frontTires = new TransformationSGNode(glm.translate(-1+tireRadius+0.1,0,0),[
        new TransformationSGNode(glm.translate(0,0,1-tireRadius),tire),
        new TransformationSGNode(glm.translate(0,0,-1+tireRadius),tire),
    ]);
    let backTires = new TransformationSGNode(glm.transform({translate:[1-tireRadius-0.1,0,0]}),[
        new TransformationSGNode(glm.transform({translate:[0,0,1-tireRadius]}),tire),
        new TransformationSGNode(glm.transform({translate:[0,0,-1+tireRadius]}),tire),
    ]);

    let tires = new ShaderSGNode(textureProgram,
        new AdvancedTextureSGNode(resources.carTireFront,
            new TransformationSGNode(glm.translate(0,-1+tireRadius,0),[
                frontTires,backTires
            ]))
        );

    let floor = new TransformationSGNode(glm.transform({
        translate:[0,-1 + 2*tireRadius+0.005,0],
        rotateX:90}
        ),rectSGNode);

    let leftRect = new TransformationSGNode(glm.transform({
        translate:[-1,(-1+2*tireRadius)+(0.2),0],
        scale:[1,0.2,1],
        rotateY:90}),rectSGNode);


    let windShieldLength = 0.3;
    let windShieldAngleInDegree = 30;
    let windShieldAngle = glm.deg2rad(windShieldAngleInDegree); // in rad
    let windShieldxComponent = cos(windShieldAngle)*windShieldLength;
    let windShieldyComponent = sin(windShieldAngle)*windShieldLength;

    let windShield = new TransformationSGNode(glm.transform({
            translate:[-1+windShieldxComponent,(-1+2*tireRadius+0.4)-(-windShieldyComponent),0],
            rotateZ:windShieldAngleInDegree
    }),
        new TransformationSGNode(glm.rotateX(90),
            new SetUniformSGNode("u_color",[255,255,255],
                new SetUniformSGNode("u_alpha",0.8,
                    new TransformationSGNode(glm.scale(windShieldLength,1,1),rectSGNode))))
        );


    let roof = new TransformationSGNode(glm.transform({
        translate:[windShieldxComponent,-1+2*tireRadius+0.4+2*windShieldyComponent,0],
        rotateX:90
    }),sg.draw(makeRect(1-windShieldxComponent,1)));
    let face = sg.draw(makeRect(1-windShieldxComponent,0.2+windShieldyComponent));


    let leftRightSide = new TransformationSGNode(
        glm.translate(windShieldxComponent,-1+2*tireRadius+(0.2+windShieldyComponent),0),[
        new TransformationSGNode(glm.translate(0,0,-1),face),
        new TransformationSGNode(glm.translate(0,0,1),face),
        new TransformationSGNode(glm.transform({
            translate:[1-windShieldxComponent,0,0],rotateY:90,scale:[1,0.2+windShieldyComponent,1]}
            ),rectSGNode)]);


    let root = sg.root();
    root.children.push(floor);
    root.children.push(leftRightSide);
    root.children.push(roof);
    root.children.push(tires);
    root.children.push(leftRect);
    root.children.push(windShield);

    return {
        rootNode : new TransformationSGNode(glm.transform({scale:[1,1,0.7]}),root),
        tireTransformation: tire
    };
}