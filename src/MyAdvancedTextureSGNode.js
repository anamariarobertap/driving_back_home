/*
* A more advanced texture sg node.
* With this class, the textureunit can/must also be set in the constructor.
* From the fragement shader the texture will be stored in "u_tex" + textureunit
* This class will also set the u_enableObjectTexture uniform to true in the rendering process.
 */
class MyAdvancedTextureSGNode extends SGNode {
    constructor(image,textureunit, children ) {
        super(children);
        this.image = image;
        this.textureunit = textureunit;
        this.uniform = 'u_tex'+textureunit;
        this.textureId = -1;
    }

    init(gl) {
        this.textureId = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.textureId);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter || gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter || gl.LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS || gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT || gl.REPEAT);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    render(context) {
        if (this.textureId < 0) {
            this.init(context.gl);
        }
        //set additional shader parameters
        gl.uniform1i(gl.getUniformLocation(context.shader, 'u_enableObjectTexture'), 1);
        gl.uniform1i(gl.getUniformLocation(context.shader, this.uniform), this.textureunit);

        //activate and bind texture
        gl.activeTexture(gl.TEXTURE0 + this.textureunit);
        gl.bindTexture(gl.TEXTURE_2D, this.textureId);

        //render children
        super.render(context);

        //clean up
        gl.activeTexture(gl.TEXTURE0 + this.textureunit);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}