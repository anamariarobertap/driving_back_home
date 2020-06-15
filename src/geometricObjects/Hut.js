
function createHut(textureProgram,resources)
{
    //this root will be used instead of rootNode -> Aram
    //const root = new ShaderSGNode(program);
    //texture Shader Node
    const root2 = new ShaderSGNode(textureProgram);

//create the hut

    {
        let hutRoot = new SGNode();

        let hutCube1 = new MaterialSGNode ([ new MyAdvancedTextureSGNode (resources.walltexture,0,new RenderSGNode (makeCube()))]);

        hutCube1.ambient = [1, 1, 0, 1];
        hutCube1.diffuse = [1, 1, 1, 1];
        hutCube1.specular = [1, 1, 1, 1];
        hutCube1.shininess = 100;

        let hutCube2 = new MaterialSGNode ([ new MyAdvancedTextureSGNode (resources.walltexture,0,new RenderSGNode (makeCube()))]);

        let hutCube1RoofLeft = new MaterialSGNode([new MyAdvancedTextureSGNode(resources.rooftexture,0, new RenderSGNode(makeRect()))]);
        let hutCube1RoofRight = new MaterialSGNode([new MyAdvancedTextureSGNode(resources.rooftexture,0, new RenderSGNode(makeRect()))]);
        let hutCube2RoofLeft = new MaterialSGNode([new MyAdvancedTextureSGNode(resources.rooftexture,0, new RenderSGNode(makeRect()))]);
        let hutCube2RoofRight = new MaterialSGNode([new MyAdvancedTextureSGNode(resources.rooftexture,0, new RenderSGNode(makeRect()))]);
        let rect1 = new MaterialSGNode([new MyAdvancedTextureSGNode(resources.rooftexture,0, new RenderSGNode(makeRect()))]);
        let rect2 = new MaterialSGNode([new MyAdvancedTextureSGNode(resources.rooftexture,0, new RenderSGNode(makeRect()))]);


        hutRoot.append(new TransformationSGNode(glm.transform({translate: [0,0,0], scale: [2,1,1]}), [hutCube1]));
        hutRoot.append(new TransformationSGNode(glm.transform({translate: [-3,1,0], scale: [1,2,1]}), [hutCube2]));
        hutRoot.append(new TransformationSGNode(glm.transform({translate: [-3.5,3.5,0], rotateY:45,rotateX:90,scale: [0.7,1,1]}), [hutCube1RoofLeft]));
        hutRoot.append(new TransformationSGNode(glm.transform({translate: [-2.5,3.5,0],rotateY:135,rotateX:90,scale: [0.7,1,1]}), [hutCube1RoofRight]));
        hutRoot.append(new TransformationSGNode(glm.transform({translate: [0.0,1.5,-.5],rotateX:45, rotateY:180,scale: [2,0.7,1]}), [hutCube2RoofLeft]));
        hutRoot.append(new TransformationSGNode(glm.transform({ translate: [0.0,1.5,.5],rotateX:135, rotateY:180,scale: [2,0.7,1]}), [hutCube2RoofRight]));
        hutRoot.append(new TransformationSGNode(glm.transform({translate: [-3,3.0,1.0],rotateX:0, rotateY:0, rotateZ:135,scale:0.7}), [rect1]));
        hutRoot.append(new TransformationSGNode(glm.transform({ translate: [-3,3.0,-0.98],rotateX:0, rotateY:180, rotateZ:45,scale:0.7}), [rect2]));

        root2.append(new TransformationSGNode(glm.transform({ translate: [10,5,-10],rotateY:180, scale: 2.5}),[hutRoot]));
    }
    
    return root2;

}