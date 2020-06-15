/*
* Returns a model with the vertices, texture coordinates and the indices.
* X,Z coordinate range(-1 to 1)
* The y coordinate will be taken 1:1 by the height parameter.
* Important: The normal vector will be empty. Consider this fact.
* The normals will be loaded afterwards from a json file.
 */
function initMesh(meshSize,height){
    let vertices = [];
    let indices = [];
    let texture = [];

    // --------------------- start computing vertex coordinates ---------------------
    let cellSize = 2/meshSize;
    for (let i = 0; i < meshSize; i++) {
        for (let j = 0; j < meshSize; j++) {
            // do the following for each cell in the mesh: push vertices and texture coordinates
            vertices.push(cellSize * j - 1); // x - coordinate
            vertices.push(height[i * meshSize + j]); // y - coordinate
            vertices.push(cellSize * i - 1); // z - coordinate
            texture.push(j/meshSize); // x - texture coordinate
            texture.push(i/meshSize); // y - texture coordinate
        }
    }
    // --------------------- end computing vertex coordinates ---------------------


    // --------------------- start computing indices ---------------------
    for (let row = 0; row < meshSize-1; row++) {
        for (let col = 0; col < meshSize-1; col++) {
            // do the following for each cell: add indices for the rectangle in counterclockwise direction
            let vertexIndex = col + row * meshSize; // index to the left upper vertex of the cell
            // add first triangle
            indices.push(vertexIndex+1); // right upper
            indices.push(vertexIndex); // left upper
            indices.push(vertexIndex+meshSize); // left bottom

            // add second triangle
            indices.push(vertexIndex+1); // right upper
            indices.push(vertexIndex+meshSize); // left bottom
            indices.push(vertexIndex+meshSize+1); // right bottom
        }
    }
    // --------------------- end computing indices ---------------------


    return {
        position: vertices,
        index: indices,
        texture: texture,
        normal: []
    };
}