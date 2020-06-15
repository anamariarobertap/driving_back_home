/**
 * a phong shader implementation with texture support
 */
precision mediump float;

/**
 * definition of a material structure containing common properties
 */
struct Material {
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	vec4 emission;
	float shininess;
};

/**
 * definition of the light properties related to material properties
 */
struct Light {
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
};

//illumination related variables
uniform Material u_material;
uniform Light u_light;
varying vec3 v_normalVec;
varying vec3 v_eyeVec;
varying vec3 v_lightVec;
uniform Light u_light2;
varying vec3 v_light2Vec;

//texture related variables
uniform bool u_enableObjectTexture;
varying vec2 v_texCoord;

uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;
uniform float u_wobbleTime;

vec4 calculateSimplePointLight(Light light, Material material, vec3 lightVec, vec3 normalVec, vec3 eyeVec, vec4 textureColor) {
	// You can find all built-in functions (min, max, clamp, reflect, normalize, etc.)
	// and variables (gl_FragCoord, gl_Position) in the OpenGL Shading Language Specification:
	// https://www.khronos.org/registry/OpenGL/specs/gl/GLSLangSpec.4.60.html#built-in-functions
	lightVec = normalize(lightVec);
	normalVec = normalize(normalVec);
	eyeVec = normalize(eyeVec);

	//compute diffuse term
	float diffuse = max(dot(normalVec,lightVec),0.0);

	//compute specular term
	vec3 reflectVec = reflect(-lightVec,normalVec);
	float spec = pow( max( dot(reflectVec, eyeVec), 0.0) , material.shininess);


    if (u_enableObjectTexture){
    material.diffuse = textureColor;
    material.ambient = textureColor;
	//Note: an alternative to replacing the material color is to multiply it with the texture color
}

	vec4 c_amb  = clamp(light.ambient * material.ambient, 0.0, 1.0);
	vec4 c_diff = clamp(diffuse * light.diffuse * material.diffuse, 0.0, 1.0);
	vec4 c_spec = clamp(spec * light.specular * material.specular, 0.0, 1.0);
	vec4 c_em   = material.emission;

  return c_amb + c_diff + c_spec + c_em;
}

void main (void) {
   vec4 color0 = texture2D(u_tex0, v_texCoord); // wall texture
    vec4 color1 = texture2D(u_tex1, v_texCoord); // mountain texture
    vec4 color2 = texture2D(u_tex2, v_texCoord); // alpha map

    //  Grauwert = 0,299 × Rotanteil + 0,587 × Grünanteil + 0,114 × Blauanteil
    float grayVal = 1.0 - (0.299 * color2.x + 0.587 * color2.y + 0.114 * color2.z);
    float invGrayVal = 1.0-grayVal;


    vec4 textureColor = vec4(
    grayVal*color0.r + invGrayVal * color1.r,
    grayVal*color0.g + invGrayVal * color1.g,
    grayVal*color0.b + invGrayVal * color1.b,
    1
    );



	gl_FragColor = calculateSimplePointLight(u_light, u_material, v_lightVec, v_normalVec, v_eyeVec, textureColor)
+ calculateSimplePointLight(u_light2, u_material, v_light2Vec, v_normalVec, v_eyeVec, textureColor);
}