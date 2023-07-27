const apiUrl = 'https://hp-api.onrender.com/api/characters/students';

function fillSelectWithData(data) {
    const selectElement = document.getElementById('selectData');

    // Iterar sobre los datos y crear las opciones para el select
    data.forEach(item => {
        const option = document.createElement('option');
        option.textContent = item.name; // Suponiendo que el objeto tiene una propiedad "name"
        option.value = item.name; // Suponiendo que el objeto tiene una propiedad "id"
        selectElement.appendChild(option);
    });
}
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        fillSelectWithData(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });


const agregarBtn = document.getElementById('agregarBtn');
agregarBtn.addEventListener('click', capturarInformacion);

const casaGanadoraBtn = document.getElementById('casaGanadoraBtn');
casaGanadoraBtn.addEventListener('click', calcularCasaGanadora);

const mejorAlumnoBtn = document.getElementById('mejorAlumnoBtn');
mejorAlumnoBtn.addEventListener('click', calcularAlumnoMejorPuntaje);

const promedioCasasBtn = document.getElementById('promedioCasasBtn');
promedioCasasBtn.addEventListener('click', calcularPromedioPuntaje);

const filtrarMagosBtn = document.getElementById('filtrarMagosBtn');
filtrarMagosBtn.addEventListener('click', filtrarMagos);

let magos = [];

function guardarDatosEnStorage() {
    let magosJSON = JSON.stringify(magos);
    localStorage.setItem('magos', magosJSON);
}

function capturarInformacion() {
    let nombre = document.getElementById("selectData").value;
    let puntaje = parseInt(document.getElementById("puntaje").value);
    let casa = document.getElementById("casa").value;

    if (nombre.trim() === "" || isNaN(puntaje) || casa.trim() === "") {
        dispararError();
    }
    else {
        magos.push({ nombre: nombre, puntaje: puntaje, casa: casa });
        guardarDatosEnStorage();

        document.getElementById("puntaje").value = "";

        mostrarMagosEnTabla(); 
    }
}


function calcularCasaGanadora() {
    let casas = {};

    
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

    if (casaSeleccionada === "") {
        dispararError();
        return;
    }

    const magosJson = localStorage.getItem('magos');
    const magosStorage = JSON.parse(magosJson);
    for (let i = 0; i < magosStorage.length; i++) {
        if (magosStorage[i].casa === casaSeleccionada) {
            magosCasa.push(magosStorage[i]);
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


function mostrarMagosEnTabla() {
    let tabla = document.getElementById('tablaMagos');
    tabla.innerHTML = '';

    for (let i = 0; i < magos.length; i++) {
        let mago = magos[i];
        let row = tabla.insertRow();
        let cellNombre = row.insertCell(0);
        let cellPuntaje = row.insertCell(1);
        let cellCasa = row.insertCell(2);

        cellNombre.innerHTML = mago.nombre;
        cellPuntaje.innerHTML = mago.puntaje;
        cellCasa.innerHTML = mago.casa;
    }
}
