function initMap(heightMapImage,heightMapNormals,size){
    let height = [];
    let canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    let context = canvas.getContext('2d');
    context.drawImage(heightMapImage,0,0);
    let pixel = context.getImageData(0, 0, size, size).data;
    for (let i = 0; i < size*size*4; i += 4) { // 4 -> r,g,b,alpha
        let sum = pixel[i]+pixel[i+1]+pixel[i+2];
        height.push(sum/1000);
    }

    let m = initMesh(size,height);
    m.normal = heightMapNormals;
    return m;
}

function initMountains(gl,resources){
    return new ShaderSGNode(createProgram(gl, resources.mountain_vs, resources.mountain_fs),[
        new MaterialSGNode([
        new MyAdvancedTextureSGNode(resources.mountain,1,
            new MyAdvancedTextureSGNode(resources.alpha_map,2,
            new MyAdvancedTextureSGNode(resources.groundtexture,0,sg.draw(initMap(resources.heightmap,resources.mountain_normal,256)))))
            ])
    ]);
}