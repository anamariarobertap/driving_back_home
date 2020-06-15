//the OpenGL context
var gl = null,
    rootNode = null,
    rotateLight,
    car1 = null;

var envcubetexture;

// define abbreviations
var cos = Math.cos;
var sin = Math.sin;
var carObj = null; // should be global for animation
var tireAngle = 0;

function init(resources) {
  //create a GL context
  gl = createContext(1024 /*getViewMatrixwidth*/, 1024 /*height*/);
  gl.enable(gl.DEPTH_TEST);
  initCameraControl(gl.canvas);


  let light2 = new LightSGNode();
  light2.uniform = 'u_light2';
  light2.ambient = [0.5, 0.5, 0.5, 1];
  light2.diffuse = [0, 1, 1, 1];
  light2.specular = [0, 1, 1, 1];
  light2.position = [0, 1, 1.5];
  light2.append(sg.drawSphere(0.05));

  
  let light = new LightSGNode();
  light.ambient = [1, 1, 1, 1];
  light.diffuse = [1, 0, 1, 1];
  light.specular = [1, 0, 1, 1];
  light.position = [0, 1, 0.2];
  light.append(sg.drawSphere(0.05));

rotateLight = new TransformationSGNode(mat4.create(), [
  light2]);

  // define different programs
  let program = createProgram(gl, resources.vs, resources.fs);
  let textureProgram = createProgram(gl, resources.text_vs, resources.text_fs);

  let envTexture = createProgram(gl, resources.envmap_vs, resources.envmap_fs);
  // define cg nodes
  carObj = initCar(textureProgram,resources);
  //car1 = new TransformationSGNode(glm.transform({translate:[0.5,0.03,0],scale:[0.03,0.03,0.03]}),
    //  new ShaderSGNode(program, new SetUniformSGNode('u_alpha',1,
      //    new CarMovementSGNode(
        //  new SetUniformSGNode('u_color', [255,255,255],
          //    carObj.rootNode))))
  //);

  car1 = new SetUniformSGNode('u_enableObjectTexture',false,
  new TransformationSGNode(glm.transform({translate:[0.5,0.03,0],scale:[0.03,0.03,0.03]}),
  new CarMovementSGNode(carObj.rootNode)));
  let hut = createHut(textureProgram,resources);

  let heightMapBackface = new ShaderSGNode(textureProgram,
      new MyAdvancedTextureSGNode(resources.groundtexture,0,
          new TransformationSGNode(glm.transform({
            scale:[0.5,0.12,1],translate:[0,0.12,-0.59]
          }),[sg.drawRect(1,1)])));

  let floor = new ShaderSGNode(textureProgram,[
    new SetUniformSGNode('u_color',[255,255,0]),
    new MyAdvancedTextureSGNode(resources.floortexture,0,
        new TransformationSGNode(glm.transform({rotateX:90}),sg.drawRect(10,10)))
  ]);
  


 let skybox = new ShaderSGNode(envTexture, new EnvironmentSGNode(envcubetexture,4,false, new RenderSGNode(makeSphere())));
 let mountainMatrix = glm.transform({scale:[0.5,0.1,0.6],rotateX:10,translate:[0,0.1,0]});
 let mountain = initMountains(gl,resources);

 rootNode = new AnimationSGNode([
  new TransformationSGNode(mountainMatrix,mountain),
  new ShaderSGNode(textureProgram,[
    light,
    rotateLight,
    new TransformationSGNode(glm.transform({scale:[0.01,0.01,0.01],translate:[0.4,0,1]}),hut),
    new TransformationSGNode(glm.transform({scale:[0.01,0.01,0.01],translate:[0.2,0.15,-0.1],rotateX:10}),hut),
    floor,
    car1
  ]),
  heightMapBackface
]);
mountain.append(new TransformationSGNode(mat4.invert(mat4.create(),mountainMatrix,gl,resources),light));
mountain.append(new TransformationSGNode(mat4.invert(mat4.create(),mountainMatrix,gl,resources),rotateLight));


rootNode.append(new ShaderSGNode(textureProgram,light));


rootNode.append(new ShaderSGNode(textureProgram,rotateLight));
}
/**
 * render one frame
 */
function render(timeInMilliseconds) {
  // check for resize of browser window and adjust canvas sizes
  checkForWindowResize(gl);

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  gl.clearColor(0.9, 0.9, 0.9, 1.0);
  //clear the buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const context = createSGContext(gl);
  context.timeInMilliseconds = timeInMilliseconds;

  context.viewMatrix = getViewMatrix();
  context.sceneMatrix = glm.scale(5,5,5);



  carObj.tireTransformation.setMatrix(glm.rotateZ(tireAngle));

  rotateLight.setMatrix(glm.rotateY(tireAngle));


  context.invViewMatrix = mat4.invert(mat4.create(), context.viewMatrix);
  
  
  rootNode.render(context);


  //request another call as soon as possible
  requestAnimationFrame(render);

  if(timeInMilliseconds) {
      tireAngle = timeInMilliseconds / 10;
  }
}


//load the shader resources using a utility function
loadResources({
  vs: './src/shader/single.vs.glsl',
  fs: './src/shader/single.fs.glsl',
  text_vs: './src/shader/texture.vs.glsl',
  text_fs: './src/shader/texture.fs.glsl',
  carTireFront: './img/CarTire.jpg',
  mountain : './img/mountain.jpg',
  heightmap : './img/heightmap.jpg',
  mountain_normal : './img/mountain_normal.png',
  mountain_vs: './src/shader/mountains.vs.glsl',
  mountain_fs: './src/shader/mountains.fs.glsl',
  walltexture: './img/wall_texture2.jpg',
  rooftexture: './img/roof_texture2.jpg',
  groundtexture: './img/ground.jpg',
  heightmap_normals: 'heightmap_normals.json',
  env_pos_x: './img/posX.jpg',
  env_neg_x: './img/negX.jpg',
  env_pos_y: './img/posY.jpg',
  env_neg_y: './img/negY.jpg',
  env_pos_z: './img/posZ.jpg',
  env_neg_z: './img/negZ.jpg',
  envmap_vs: './src/shader/envmap.vs.glsl',
  envmap_fs: './src/shader/envmap.fs.glsl',
  alpha_map: './img/alpha_map.jpg',
  floortexture: './img/floor.jpg'
}).then(function (resources /*an object containing our keys with the loaded resources*/) {
  init(resources);
  //render one frame
  render();
});

function initCubeMap(resources) {
  //create the texture
  envcubetexture = gl.createTexture();
  //define some texture unit we want to work on
  gl.activeTexture(gl.TEXTURE0);
  //bind the texture to the texture unit
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, envcubetexture);
  //set sampling parameters
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.MIRRORED_REPEAT); //will be available in WebGL 2
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  //set correct image for each side of the cube map
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);//flipping required for our skybox, otherwise images don't fit together
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, resources.env_pos_x);
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, resources.env_neg_x);
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, resources.env_pos_y);
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, resources.env_neg_y);
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, resources.env_pos_z);
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, resources.env_neg_z);
  //generate mipmaps (optional)
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  //unbind the texture again
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}

//a scene graph node for setting environment mapping parameters
class EnvironmentSGNode extends SGNode {

  constructor(envtexture, textureunit, doReflect , children ) {
      super(children);
      this.envtexture = envtexture;
      this.textureunit = textureunit;
      this.doReflect = doReflect;
  }

  render(context)
  {
    //set additional shader parameters
    let invView3x3 = mat3.fromMat4(mat3.create(), context.invViewMatrix); //reduce to 3x3 matrix since we only process direction vectors (ignore translation)
    gl.uniformMatrix3fv(gl.getUniformLocation(context.shader, 'u_invView'), false, invView3x3);
    gl.uniform1i(gl.getUniformLocation(context.shader, 'u_texCube'), this.textureunit);
    gl.uniform1i(gl.getUniformLocation(context.shader, 'u_useReflection'), this.doReflect)

    //activate and bind texture
    gl.activeTexture(gl.TEXTURE0 + this.textureunit);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.envtexture);

    //render children
    super.render(context);

    //clean up
    gl.activeTexture(gl.TEXTURE0 + this.textureunit);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  }
}