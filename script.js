const materias = JSON.parse(localStorage.getItem("materias_aprobadas") || "[]");

const data = {
    "Primer semestre": [
        { nombre: "Álgebra", creditos: 8, requisitos: [] },
        { nombre: "Cálculo y geometría analítica", creditos: 12, requisitos: [] },
        { nombre: "Química", creditos: 10, requisitos: [] },
        { nombre: "Física experimental", creditos: 10, requisitos: [] },
        { nombre: "Introducción a la ingeniería mecánica", creditos: 6, requisitos: [] },
        { nombre: "Igualdad de género en ingeniería", creditos: 0, requisitos: [] }
    ],
    "Segundo semestre": [
        { nombre: "Álgebra lineal", creditos: 8, requisitos: ["Álgebra"] },
        { nombre: "Cálculo integral", creditos: 8, requisitos: ["Cálculo y geometría analítica"] },
        { nombre: "Estática", creditos: 8, requisitos: ["Cálculo y geometría analítica"] },
        { nombre: "Fundamentos de programación", creditos: 10, requisitos: [] },
        { nombre: "Dibujo mecánico e industrial", creditos: 6, requisitos: [] },
        { nombre: "Redacción y exposición de temas de ingeniería", creditos: 6, requisitos: [] }
    ],
    "Tercer semestre": [
        { nombre: "Probabilidad", creditos: 8, requisitos: ["Álgebra lineal"] },
        { nombre: "Cálculo vectorial", creditos: 8, requisitos: ["Cálculo integral"] },
        { nombre: "Ecuaciones diferenciales", creditos: 8, requisitos: ["Cálculo integral"] },
        { nombre: "Cinemática y dinámica", creditos: 8, requisitos: ["Estática"] },
        { nombre: "Manufactura I", creditos: 8, requisitos: [] },
        { nombre: "Cultura y comunicación", creditos: 2, requisitos: [] }
    ],
    "Cuarto semestre": [
        { nombre: "Estadística", creditos: 8, requisitos: ["Probabilidad"] },
        { nombre: "Electricidad y magnetismo", creditos: 10, requisitos: ["Cálculo vectorial"] },
        { nombre: "Materiales I", creditos: 10, requisitos: ["Química"] },
        { nombre: "Termodinámica", creditos: 10, requisitos: [] },
        { nombre: "Optativas de ciencias sociales y humanidades", creditos: 6, requisitos: [] }
    ],
    "Quinto semestre": [
        { nombre: "Análisis de circuitos", creditos: 10, requisitos: [] },
        { nombre: "Elementos de mecánica del medio continuo", creditos: 8, requisitos: ["Cálculo vectorial"] },
        { nombre: "Análisis numérico", creditos: 8, requisitos: ["Ecuaciones diferenciales"] },
        { nombre: "Materiales II", creditos: 10, requisitos: ["Materiales I"] },
        { nombre: "Termodinámica aplicada", creditos: 8, requisitos: ["Termodinámica"] },
        { nombre: "Sistemas de conversión de energía térmica", creditos: 2, requisitos: ["Termodinámica"] }
    ],
    "Sexto semestre": [
        { nombre: "Mecánica de sólidos", creditos: 8, requisitos: [] },
        { nombre: "Modelado de sistemas físicos", creditos: 8, requisitos: [] },
        { nombre: "Manufactura II", creditos: 10, requisitos: ["Manufactura I"] },
        { nombre: "Mecánica de fluidos I", creditos: 10, requisitos: ["Termodinámica aplicada" "Sistemas de conversión de energía térmica"] },
        { nombre: "Introducción a la economía", creditos: 8, requisitos: [] }
    ],
    "Séptimo semestre": [
        { nombre: "Electrónica básica", creditos: 10, requisitos: ["Análisis de circuitos"] },
        { nombre: "Mecanismos", creditos: 8, requisitos: [] },
        { nombre: "Ética profesional", creditos: 6, requisitos: [] },
        { nombre: "Ingeniería económica", creditos: 8, requisitos: [] },
        { nombre: "Mecánica de fluidos II", creditos: 10, requisitos: ["Elementos de mecánica del medio continuo"] }
    ],
    "Octavo semestre": [
        { nombre: "Diseño de elementos de máquinas", creditos: 8, requisitos: ["Mecánica de sólidos"] },
        { nombre: "Dinámica de maquinaria", creditos: 10, requisitos: ["Mecanismos"] },
        { nombre: "Instrumentación y control", creditos: 8, requisitos: [] },
        { nombre: "Transferencia de calor", creditos: 10, requisitos: [] },
        { nombre: "Recursos y necesidades de México", creditos: 8, requisitos: [] },
    ]
};

function crearMalla() {
    const contenedor = document.getElementById("malla");
    let totalCreditos = 0;

    Object.entries(data).forEach(([semestre, ramos], idx) => {
        const columna = document.createElement("div");
        columna.className = "semestre";
        const titulo = document.createElement("h2");
        titulo.textContent = semestre;
        columna.appendChild(titulo);

        ramos.forEach(ramo => {
            const div = document.createElement("div");
            div.className = "ramo";
            div.textContent = `${ramo.nombre} (${ramo.creditos} cr)`;
            div.dataset.nombre = ramo.nombre;
            div.dataset.requisitos = JSON.stringify(ramo.requisitos);

            if (materias.includes(ramo.nombre)) {
                div.classList.add("aprobado");
                totalCreditos += ramo.creditos;
            } else if (ramo.requisitos.some(r => !materias.includes(r))) {
                div.classList.add("locked");
            }

            div.addEventListener("click", () => {
                if (div.classList.contains("locked")) return;

                if (div.classList.toggle("aprobado")) {
                    materias.push(ramo.nombre);
                } else {
                    const i = materias.indexOf(ramo.nombre);
                    if (i >= 0) materias.splice(i, 1);
                }

                localStorage.setItem("materias_aprobadas", JSON.stringify(materias));
                location.reload();
            });

            columna.appendChild(div);
        });

        contenedor.appendChild(columna);
    });

    document.getElementById("creditos-total").textContent = totalCreditos;

    // Resaltar bloque móvil
    let rezago = Object.entries(data).findIndex(([_, ramos]) =>
        ramos.some(r => !materias.includes(r.nombre))
    );
    for (let i = rezago; i < rezago + 3; i++) {
        const col = contenedor.children[i];
        if (col) col.querySelectorAll(".ramo").forEach(r => r.classList.add("bloque-activo"));
    }
}

crearMalla();

