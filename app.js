let magos = [];

// Función para guardar la lista de magos en el Web Storage
function guardarDatosEnStorage() {
    let magosJSON = JSON.stringify(magos);
    localStorage.setItem('magos', magosJSON);
}


//Función para que guarde la información agregada
function capturarInformacion() {
    let nombre = document.getElementById("nombre").value;
    let puntaje = parseInt(document.getElementById("puntaje").value);
    let casa = document.getElementById("casa").value;

    if (nombre.trim() === "" || isNaN(puntaje) || casa.trim() === "") {
        dispararError();
    }
    else {
        magos.push({ nombre: nombre, puntaje: puntaje, casa: casa });
        guardarDatosEnStorage();

        document.getElementById("nombre").value = "";
        document.getElementById("puntaje").value = "";
    }
}

function calcularCasaGanadora() {
    let casas = {};

    // Recorrer el array de magos y acumular los puntos por casa
    for (let i = 0; i < magos.length; i++) {
        let mago = magos[i];
        let casa = mago.casa;
        let puntos = mago.puntaje;

        if (casas[casa]) {
            casas[casa] += puntos;
        } else {
            casas[casa] = puntos;
        }
    }

    // Encontrar la casa con mayor cantidad de puntos
    let casaGanadora = "";
    let puntosGanadores = 0;

    for (let casa in casas) {
        let puntos = casas[casa];

        if (puntos > puntosGanadores) {
            casaGanadora = casa;
            puntosGanadores = puntos;
        }
    }
    document.getElementById("resultado").innerText = `Casa ganadora ${casaGanadora} con ${puntosGanadores} puntos`;
    dispararCasaGanadora(casaGanadora, puntosGanadores);
}

function calcularAlumnoMejorPuntaje() {
    let mejorPuntaje = 0;
    let mejorAlumno = "";

    for (let i = 0; i < magos.length; i++) {
        if (magos[i].puntaje > mejorPuntaje) {
            mejorPuntaje = magos[i].puntaje;
            mejorAlumno = magos[i].nombre;
        }
    }

    document.getElementById("resultado").innerText = "Alumno con mayor puntaje obtenido: " + mejorAlumno;
    dispararExito(mejorAlumno, `${mejorPuntaje} puntos`);
    return mejorAlumno;
}

function calcularPromedioPuntaje() {
    let totalPuntaje = 0;
    let cantidadmagos = magos.length;

    for (let i = 0; i < cantidadmagos; i++) {
        totalPuntaje += magos[i].puntaje;
    }

    let promedio = totalPuntaje / cantidadmagos;

    document.getElementById("resultado").innerText = "Promedio de puntaje de las cuatro casas: " + promedio.toFixed(2);
    dispararExito(`El promedio general de las casas es de ${promedio} puntos`);
}

function filtrarMagos() {
    let casaSeleccionada = document.getElementById("buscador").value;
    let magosCasa = [];

    if (casaSeleccionada != "") {
        dispararError();
        return;
    }

    for (let i = 0; i < magos.length; i++) {
        if (magos[i].casa === casaSeleccionada) {
            magosCasa.push(magos[i]);
        }
    }

    let listado = document.getElementById("listado");
    listado.innerHTML = "";

    if (magosCasa.length > 0) {
        for (let i = 0; i < magosCasa.length; i++) {
            let alumno = magosCasa[i].nombre;
            let puntos = magosCasa[i].puntaje;
            let item = document.createElement("p");
            item.innerText = "Mago: " + alumno + " - Puntos: " + puntos;
            listado.appendChild(item);
        }
    }
}


function dispararError() {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes ingresar datos!',
    })
}

function dispararExito(title, text) {
    Swal.fire({
        icon: 'success',
        title: title,
        text: text,
    })
}




function dispararCasaGanadora(casaGanadora, puntosGanadores) {
    let imagenCasaGanadora = "";
    switch (casaGanadora) {
        case 'Gryffindor':
            imagenCasaGanadora = './assets/img/gryffindor.jpg';
            break;
        case 'Hufflepuff':
            imagenCasaGanadora = './assets/img/hufflepuff.jpg';
            break;
        case 'Ravenclaw':
            imagenCasaGanadora = './assets/img/ravenclaw.jpg';
            break;
        case 'Slytherin':
            imagenCasaGanadora = './assets/img/slytherin.jpg';
            break;
        default:
            break;
    }

    Swal.fire({
        imageUrl: imagenCasaGanadora,
        title: casaGanadora,
        text: `Puntos: ${puntosGanadores}`

    })
}