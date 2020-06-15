/*
* Returns the linear interpolation of the x and y values.
* The parameter can be either vec3 objects or numbers.
 */
function linearInterpolation(x1,y1,x2,y2,x){
    if(typeof y1 == 'number'){
        return y1 + (x-x1)*(y2-y1)/(x2-x1);
    }else {
        let scale = (x - x1) / (x2 - x1);
        let diff = vec3.sub(vec3.create(), y2, y1);
        diff = vec3.scale(vec3.create(), diff, scale);
        return vec3.add(vec3.create(), diff, y1);
    }
}

/*
* Returns the largest index i for a given array arr, comperator and a value val, which has the property,
* that compare(arr[i],val) is true. If there is not such an index, the function will return the length of the array.
* The comperator should be a function, which gets an element of the array and the value val.
* It should return a negative value, if the first parameter is less then the second
* It should return a positive value, if the first parameter is greather then the second
* It should return zero, if the first parameter is equal to the second
 */
function upperBound(arr, comperator, val){
    let i = 0; // i represents the lower bound index of the time => used to be frame independent
    while(i<arr.length && comperator(arr[i],val) < 0){
        i++;
    }
    return i;
}