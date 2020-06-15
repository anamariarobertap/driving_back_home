/**
 * a phong shader implementation
 * Created by Samuel Gratzl on 29.02.2016.
 */

attribute vec3 a_position;
uniform mat4 u_modelView;
uniform mat4 u_projection;

//like a C program main is the main function
void main() {
  vec4 pos_extended = vec4(a_position,1);
  gl_Position = u_projection * u_modelView * pos_extended;
}