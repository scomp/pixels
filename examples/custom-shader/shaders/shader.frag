// IMPORTANT: This shader needs to be compiled out-of-band to SPIR-V
// See: https://github.com/parasyte/pixels/issues/9

// Loosely based on "Gaussian Blur" by mrharicot: https://www.shadertoy.com/view/XdfGDH

#version 450

layout(location = 0) in vec2 v_TexCoord;
layout(location = 0) out vec4 outColor;
layout(set = 0, binding = 0) uniform texture2D t_Color;
layout(set = 0, binding = 1) uniform sampler s_Color;

vec2 SIZE = vec2(400, 300);

void main() {
    vec4 sampledColor = texture(sampler2D(t_Color, s_Color), v_TexCoord.xy);
    if (sampledColor.b == 1.0) {
        outColor = sampledColor;
    } else {
        const int mSize = 11;
        const int kSize = (mSize - 1) / 2;
        float kernel[mSize];
        vec3 final_colour = sampledColor.rgb;

        for (int i = -kSize; i <= kSize; ++i) {
            for (int j = -kSize; j <= kSize; ++j) {
                vec2 point = vec2(float(i), float(j));
                vec2 blurSampleCoord = point / SIZE;
                vec4 color = texture(sampler2D(t_Color, s_Color), v_TexCoord.xy + blurSampleCoord);
                if (color.b == 1.0) {
                    float dist = 1.0 - min(dot(point, point) / (kSize * kSize), 1.0);

                    final_colour += dist / 75.0 * color.rgb;
                }
            }
        }

        outColor = vec4(final_colour, 1.0);
    }
}
