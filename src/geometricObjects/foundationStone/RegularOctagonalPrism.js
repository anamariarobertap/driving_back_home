/*
* Creates a model for an regular octagon.
 */
function initRegularOctagonalPrism(){
    // --------------------- start computing vertices ---------------------
    // the formula bellow can be very easily derived from pythagoras
    // compute the side length of the regular octagon in such a way, that the width and the height are 2
    let octagonSideLength = 2/(2/Math.sqrt(2)+1);
    let m = octagonSideLength/Math.sqrt(2);
    function getHexagonVertices(z){
        return [
            0,0,z, // 0 - middle point
            1,-octagonSideLength/2,z, // 1 right bottom
            1,octagonSideLength/2,z, // 2 right top
            1-m,1,z, // 3 top
            -1+m,1,z, // 4 top
            -1,1-m,z, // 5 left
            -1,-1+m,z, // 6 left
            -1+m,-1,z, // 7 bottom
            1-m,-1,z, // 8 bottom
        ];
    }
    function getHexagonIndices(offs){
        let arr = [
            0,1,2,
            0,2,3,
            0,3,4,
            0,4,5,
            0,5,6,
            0,6,7,
            0,7,8,
            0,8,1
        ];
        for(let i=0;i<arr.length;i++)
            arr[i] += offs;
        return arr;
    }
    function getTextureCoords(){
        let arr = [
            0.5,0.5, // 0
            1,1-(-octagonSideLength/2+1)/2, // 1
            1,1-(octagonSideLength/2+1)/2, // 2
            (2-m)/2,1-1, // 3
            m/2,1-1, // 4
            0,1-(2-m)/2, // 5
            0,1-m/2, // 6
            m/2,1-0, // 7
            (2-m)/2,1-0, // 8
        ];
        return arr;
    }

    // front octagon
    let vertices = getHexagonVertices(-1); // add front face vertices
    let indices = getHexagonIndices(0);
    let textures = getTextureCoords();


    let backIndexStart = vertices.length/3;
    // back octagon
    vertices = vertices.concat(getHexagonVertices(1));
    indices = indices.concat(getHexagonIndices(backIndexStart));
    textures = textures.concat(getTextureCoords());

    // sides
    // generate vertices
    let frontIndexStart = vertices.length/3;
    let tmp = getHexagonVertices(1);
    tmp.shift();tmp.shift();tmp.shift();
    vertices = vertices.concat(tmp);
    backIndexStart = vertices.length/3;
    tmp = getHexagonVertices(-1);
    tmp.shift();tmp.shift();tmp.shift();
    vertices = vertices.concat(tmp);
    for(let i = 0;i<8;i++){
        let nextIndex = (i+1)%8;
        indices = indices.concat(
            [
                i+frontIndexStart,backIndexStart+i,frontIndexStart+nextIndex,
                backIndexStart+i,backIndexStart+nextIndex,frontIndexStart+nextIndex
            ]
        );
    }
    for(let i=0;i<6*8;i++){
        textures.push(1);
        textures.push(1);
    }

    // normals
    let normals = [];

    // add front face normals
    for (let i=0;i<9;i++) // 8 points plus middle point => 9
        normals.push(0);normals.push(0);normals.push(1);

    // add back face normals
    for (let i=0;i<9;i++) // 8 points plus middle point => 9
        normals.push(0);normals.push(0);normals.push(-1);

    // sidebar normals
    let alpha = -Math.PI / 4;
    for (let i=0;i<8;i++){ // only 8 points without middle point => 8
        normals.push(cos(alpha));normals.push(sin(alpha));normals.push(0);
        alpha += Math.PI / 4;
    }
    alpha = -Math.PI / 4;
    for (let i=0;i<8;i++){ // only 8 points without middle point => 8
        normals.push(cos(alpha));normals.push(sin(alpha));normals.push(0);
        alpha += Math.PI / 4;
    }
    return {
        position: vertices,
        texture:textures,
        index: indices,
        normal:normals
    };
}