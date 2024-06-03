const formulario = document.querySelector("#formulario");
const container = document.querySelector("#container");
const resultado = document.querySelector("#resultado");

window.addEventListener('load', () => {
  formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
  e.preventDefault();
  const ciudad = document.querySelector('#ciudad').value;
  const pais = document.querySelector('#pais').value;
  console.log("Buscando clima...");
  
  if (pais === "" || ciudad === "") {
    mostrarError("Ambos campos son obligatorios");
    return;
  } else {
    console.log(pais);
    console.log(ciudad);
  }
  consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
  let alerta = document.createElement('div');
  alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
  
  alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block">${mensaje}</span>
  `;
  
  container.appendChild(alerta);
  
  setTimeout(() => {
    alerta.remove();
  }, 5000);
}

function consultarAPI(ciudad, pais) {
  const appId = '70b869dad88fa9bc91529e05fab4cde8';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

  fetch(url)
    .then(respuesta => {
      if (!respuesta.ok) {
        throw new Error("Error al consultar la API");
      }
      return respuesta.json();
    })
    .then(datos => {
      console.log(datos);
      if (datos.cod === "404") {
        mostrarError("Ciudad no encontrada");
        return;
      }
      mostrarClima(datos);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function mostrarClima(datos) {
  const { main: { temp, temp_max, temp_min } } = datos;

  const centigrados = kelvinACentigrados(temp);
  const maxCentigrados = kelvinACentigrados(temp_max);
  const minCentigrados = kelvinACentigrados(temp_min);

  console.log(`Temp: ${centigrados}°C, Max: ${maxCentigrados}°C, Min: ${minCentigrados}°C`);

  resultado.innerHTML = '';

  const tempActual = document.createElement('p');
  tempActual.innerHTML = `${centigrados} &#8451;`;
  tempActual.classList.add('font-bold', 'text-xl', 'text-center');

  const tempMax = document.createElement('p');
  tempMax.innerHTML = `Max: ${maxCentigrados} &#8451;`;
  tempMax.classList.add('font-bold', 'text-xl', 'text-center');

  const tempMin = document.createElement('p');
  tempMin.innerHTML = `Min: ${minCentigrados} &#8451;`;
  tempMin.classList.add('font-bold', 'text-xl', 'text-center');

  const resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('text-center', 'text-white',);

  resultadoDiv.appendChild(tempActual);
  resultadoDiv.appendChild(tempMax);
  resultadoDiv.appendChild(tempMin);

  resultado.appendChild(resultadoDiv);
}

function kelvinACentigrados(grados) {
  return parseInt(grados - 273.15);
}
