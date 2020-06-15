/**
 * a phong shader implementation
 * Created by Samuel Gratzl on 29.02.2016.
 */
precision mediump float;
uniform float u_alpha;
uniform vec3 u_color;
//entry point again
void main() {
   gl_FragColor = vec4(u_color,u_alpha);
}