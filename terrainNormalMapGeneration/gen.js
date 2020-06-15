let terrainHeightMapImage = new Image;
terrainHeightMapImage.src = '../img/heightmap.jpg';
terrainHeightMapImage.onload = function() {
    gen();
};

var canvas;
var accuracy = 3;

function computeAndPrintNormalsVectors(vertices, indices){
    var normals = [];
    vertices.forEach(() => normals.push(vec3.create()));

    for (let i = 0; i < indices.length; i++) {
        let vertexA = vec3.normalize(vec3.create(),vec3.sub(vec3.create(),vertices[indices[i][1]],vertices[indices[i][0]]));
        let vertexB = vec3.normalize(vec3.create(),vec3.sub(vec3.create(),vertices[indices[i][2]],vertices[indices[i][0]]));
        let triangleNormal =  vec3.cross(vec3.create(),vertexA,vertexB);
        normals[indices[i][0]] = vec3.add(vec3.create(),normals[indices[i][0]],triangleNormal);
        normals[indices[i][1]] = vec3.add(vec3.create(),normals[indices[i][1]],triangleNormal);
        normals[indices[i][2]] = vec3.add(vec3.create(),normals[indices[i][2]],triangleNormal);
    }
    for (let i = 0; i < normals.length; i++) {
        normals[i] = vec3.normalize(vec3.create(), normals[i]);
    }
    let res = [];
    for (let i = 0; i < normals.length; i++) {
        res.push(Number.parseFloat(normals[i][0].toFixed(accuracy)));
        res.push(Number.parseFloat(normals[i][1].toFixed(accuracy)));
        res.push(Number.parseFloat(normals[i][2].toFixed(accuracy)));
    }
    console.log(JSON.stringify(res));
}
function gen(){
    let meshSize = 256;
    let vertices = [];
    let indices = [];
    let height = [];

// --------------------- start reading the z values from the image ---------------------
    let canvas = document.createElement('canvas');
    canvas.width = terrainHeightMapImage.width;
    canvas.height = terrainHeightMapImage.height;
    let context = canvas.getContext('2d');
    context.drawImage(terrainHeightMapImage,0,0);
    let pixel = context.getImageData(0, 0, terrainHeightMapImage.width, terrainHeightMapImage.height).data;
    for (let i = 0; i < terrainHeightMapImage.width*terrainHeightMapImage.height*4; i += 4) {
        let sum = pixel[i]+pixel[i+1]+pixel[i+2];
        height.push(sum/1000);
    }
// --------------------- end reading the z values from the image ---------------------

// --------------------- start computing vertex coordinates ---------------------
    let cellSize = 2/meshSize;
    for (let i = 0; i < meshSize; i++) {
        for (let j = 0; j < meshSize; j++) {
            // x and y starts from -1 => therefore the x coordinate is 1 subtracted from cellSize * i
            vertices.push([cellSize * i - 1,height[i * meshSize + j],cellSize * j - 1]);
        }
    }
// --------------------- end computing vertex coordinates ---------------------

// --------------------- start computing indices ---------------------
    for (let row = 0; row < meshSize-1; row++) {
        for (let col = 0; col < meshSize-1; col++) {
            let vertexIndex = col + row*meshSize;
            indices.push([vertexIndex+1,vertexIndex,vertexIndex+meshSize]);
            indices.push([vertexIndex+1,vertexIndex+meshSize,vertexIndex+meshSize+1]);
        }
    }
// --------------------- end computing indices ---------------------
    computeAndPrintNormalsVectors(vertices,indices);
}