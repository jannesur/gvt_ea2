
const canvas = document.getElementById("webgl-canvas");
const vertexText = document.getElementById("vertex-text");

// WebGL starten
const gl = canvas.getContext("webgl");

if (gl === null) {
    vertexText.textContent =
        "WebGL wird von diesem Browser nicht unterstützt.";
    console.error("WebGL konnte nicht gestartet werden.");
} else {
    drawFox();
}

// Fuchs zeichnen
function drawFox() {

    // Immer zwei Punkte bilden zusammen eine Linie.
    // Jeder Punkt hat eine X- und eine Y-Koordinate.
    const vertices = [

        // Äußere Kopfform und Ohren
        -0.75,  0.20,   -0.85,  0.85,
        -0.85,  0.85,   -0.30,  0.58,
        -0.30,  0.58,    0.00,  0.48,
        0.00,  0.48,    0.30,  0.58,
        0.30,  0.58,    0.85,  0.85,
        0.85,  0.85,    0.75,  0.20,
        -0.75,  0.20,   -0.62, -0.35,
        0.75,  0.20,    0.62, -0.35,
        -0.62, -0.35,    0.00, -0.85,
        0.62, -0.35,    0.00, -0.85,

        // Innenseiten der Ohren
        -0.68,  0.36,   -0.73,  0.66,
        -0.73,  0.66,   -0.40,  0.46,
        -0.40,  0.46,   -0.68,  0.36,
        0.68,  0.36,    0.73,  0.66,
        0.73,  0.66,    0.40,  0.46,
        0.40,  0.46,    0.68,  0.36,

        // Geometrische Linien im oberen Gesicht
        -0.75,  0.20,   -0.38,  0.12,
        -0.38,  0.12,    0.00,  0.30,
        0.00,  0.30,    0.38,  0.12,
        0.38,  0.12,    0.75,  0.20,

        // Seitliche Wangen
        -0.38,  0.12,   -0.62, -0.35,
        0.38,  0.12,    0.62, -0.35,

        // Linien von den Wangen zur Nase
        -0.62, -0.35,   -0.13, -0.48,
        0.62, -0.35,    0.13, -0.48,

        // Linkes Auge
        -0.32, -0.10,   -0.10, -0.14,
        -0.10, -0.14,   -0.21, -0.26,
        -0.21, -0.26,   -0.32, -0.10,

        // Rechtes Auge
        0.32, -0.10,    0.10, -0.14,
        0.10, -0.14,    0.21, -0.26,
        0.21, -0.26,    0.32, -0.10,

        // Nase
        -0.13, -0.48,    0.13, -0.48,
        0.13, -0.48,    0.00, -0.60,
        0.00, -0.60,   -0.13, -0.48,

        // Mund
        0.00, -0.60,    0.00, -0.70,
        0.00, -0.70,   -0.12, -0.75,
        0.00, -0.70,    0.12, -0.75
    ];

    // Vertex-Shader: Position der Punkte festlegen
    const vertexShaderSource = `
        attribute vec2 position;

        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    // Fragment-Shader: Farbe der Linien festlegen
    const fragmentShaderSource = `
        precision mediump float;

        void main() {
            gl_FragColor = vec4(0.13, 0.29, 0.51, 1.0);
        }
    `;

    // Shader erstellen und kompilieren
    function createShader(type, source) {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    const vertexShader = createShader(
        gl.VERTEX_SHADER,
        vertexShaderSource
    );

    const fragmentShader = createShader(
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
    );

    if (vertexShader === null || fragmentShader === null) {
        vertexText.textContent =
            "Fehler beim Erstellen der Shader.";
        return;
    }

    // Shader zu einem Programm verbinden
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        vertexText.textContent =
            "Fehler beim Verbinden der Shader.";
        return;
    }

    gl.useProgram(program);

    // Koordinaten an WebGL übergeben
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );

    // Positionen der Punkte aktivieren
    const position = gl.getAttribLocation(program, "position");

    gl.vertexAttribPointer(
        position, 2, gl.FLOAT, false, 0, 0
    );

    gl.enableVertexAttribArray(position);

    // Zeichenfläche vorbereiten
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.973, 0.980, 0.988, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Anzahl der Vertices berechnen
    const numberOfVertices = vertices.length / 2;

    // Linien zeichnen
    gl.drawArrays(gl.LINES, 0, numberOfVertices);

    // Anzahl der Vertices anzeigen
    vertexText.textContent =
        "Anzahl der Vertices: " + numberOfVertices;

    console.log(
        "Fuchs gezeichnet mit " +
        numberOfVertices +
        " Vertices."
    );
}
