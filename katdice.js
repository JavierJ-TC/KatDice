Hooks.once('diceSoNiceReady', (dice3d) => {

    // --- 1. DEFINICIÓN DEL SHADER (GLSL) ---
    
    // Este es el contenido de tu 'vert-3d.glsl.txt'
    const vertexShaderCode = `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    // Este es el contenido de tu 'frag-dots.glsl.txt' ADAPTADO para dados
    const fragmentShaderCode = `
        varying vec2 vUv;        // Coordenadas de la textura del dado
        varying vec3 vNormal;    // Normal de la superficie
        uniform float u_time;    // Tiempo para la animación
        uniform vec3 color1;     // Color de los puntos
        uniform vec3 color2;     // Color del fondo

        // Función random del archivo original
        float random (in float x) {
            return fract(sin(x)*1e4);
        }

        // Función random 2D del archivo original
        float random (in vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
        }

        void main() {
            // Usamos vUv en lugar de gl_FragCoord para que el dibujo siga al dado
            vec2 st = vUv;
            
            // Escala del patrón (10.0 hace que haya 10 filas/columnas de puntos)
            st *= 10.0; 

            // Lógica original de movimiento del archivo frag-dots
            vec2 ipos = floor(st);
            vec2 fpos = fract(st);

            vec2 vel = vec2(u_time * 2.0 * max(grid, 0.0)); // Velocidad
            vel *= vec2(-1.0, 0.0) * random(1.0 + ipos.y); // Dirección aleatoria por fila

            vec2 offset = vec2(0.1, 0.0);

            vec3 color = vec3(0.0);
            
            // Animación de los puntos
            color = vec3(step(0.3, length(1.0 - fpos - offset + vel * 0.25))); 

            // Mezclamos tus dos colores elegidos
            // Si el valor es blanco (punto), usa color1, si es negro (fondo), usa color2
            vec3 finalColor = mix(color1, color2, color.r);

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    // --- 2. REGISTRO DEL SHADER EN DICE SO NICE ---
    dice3d.addShader("DotsShader", {
        name: "Puntos Animados",
        vertex: vertexShaderCode,
        fragment: fragmentShaderCode,
        uniforms: {
            u_time: { type: "f", value: 0 },         // DSN actualiza esto automáticamente
            color1: { type: "c", value: "#ff0000" }, // Color Puntos (Rojo por defecto)
            color2: { type: "c", value: "#000000" }  // Color Fondo (Negro por defecto)
        }
    });

    // --- 3. REGISTRO DEL SISTEMA (Tu código) ---
    dice3d.addSystem({id: "feldice", name: "Fel Dices"}, false);

    // --- 4. REGISTRO DEL PRESET ---
    dice3d.addDicePreset({
        type: "d20",
        labels: "",
        modelFile: "modules/feldice/fel_d20.glb",
        system: "feldice",
        appearance: {
            material: "DotsShader" // <--- Aquí aplicamos el shader nuevo
        }
    });
});