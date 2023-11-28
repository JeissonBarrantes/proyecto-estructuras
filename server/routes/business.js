const express = require("express");
const businessSchema = require("../models/business");
const router = express.Router();
const compatibility = require("../data/valoraciones");

const categories = [
  'Automotive', 'Arts & Entertainment', 'Active Life','Beauty & Spas', 'Food', 
'Health & Medical',  'Hotels & Travel',  'Local Services', 'Pets', 'Shopping', 'Education', 'Nightlife'
];


let coincidencias;

async function obtenerCategoriasDeYelp() {
  try {
    const respuesta = await axios.get('https://api.yelp.com/categorias'); // Reemplaza con la URL real de la API de Yelp
    return respuesta.data;
  } catch (error) {
    console.error('Error al obtener categorías de Yelp', error);
    return [];
  }
}

function procesarDescripcion(description, categoriasDisponibles) {
  const palabrasClave = categoriasDisponibles.flatMap(categoria => categoria.split(' '));

  return palabrasClave.filter(palabra => description.includes(palabra));
}

//Post para adquirir categorias y la base del model para mongodb

router.post('/business/categorie', async (req, res) => {

  const { description } = req.body;

  // Obtener categorías de Yelp
  const categoriasDeYelp = await obtenerCategoriasDeYelp();

  // Procesar la descripción
  coincidencias = procesarDescripcion(description, categoriasDeYelp);

  res.json({ coincidencias });
});


router.post('/business/save', async (req, res) => {
  const { description } = req.body;

  // Obtener categorías de Yelp
  const categoriasDeYelp = await obtenerCategoriasDeYelp();

  // Procesar la descripción
  const coincidencias = procesarDescripcion(description, categoriasDeYelp);

  // Crear un nuevo objeto de negocio con las coincidencias como categorías
  const nuevoNegocio = new businessSchema({
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    location: {
      type: "Point",
      coordinates: [lng, lat] // Importante: MongoDB espera [longitud, latitud]
    },
    // ... otros campos
    categories: coincidencias.join(', '), // Convertir el array en una cadena separada por comas
  });

  // Guardar el nuevo negocio en la base de datos
  try {
    const negocioGuardado = await nuevoNegocio.save();
    res.json({ mensaje: 'Negocio creado exitosamente', negocio: negocioGuardado });
  } catch (error) {
    console.error('Error al guardar el negocio', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});



//Consulta principal a la base de datos
router.get('/business/data', async (req, res) => {
  
  try {
    // Obtén los parámetros de latitud, longitud, radio, categorías, estrellas, número de revisiones y estrellas mínimas desde la consulta
    const { latitud, longitud, radio, numRevisiones, estrellasMinimas } = req.query;

    // Convierte las coordenadas a números
    const lat = parseFloat(latitud);
    const lon = parseFloat(longitud);

    // Convierte el radio a metros (si es necesario)
    const radioKM = parseFloat(radio)/1000; // Suponiendo que radio es en kilómetros
    
    const resultado = await businessSchema.find({
      $and: [
        {
          "location": {
            $geoWithin: {
              $centerSphere: [[lon, lat], radioKM / 6371] // 6371 es el radio de la Tierra en kilómetros
            }
          }
        },
        {
          review_count: {
            $exists: true,
            $gte: numRevisiones ? parseInt(numRevisiones) : 0
          }
        }
      ]
    });

    /* const resultado = await businessSchema.find({
    $and:[
      {
        "location": {
          "$nearSphere":{
            "$geometry":{
              "type":"Point",
              "coordinates":[
                  lon,
                  lat
              ]
            },
            "$minDistance":1,
            "$maxDistance":radioMetros
          }
        }
      }, 
      {
        review_count: {
          $exists: true, // Asegura que el campo review_count exista en los documentos
          $gte: numRevisiones ? parseInt(numRevisiones) : 0 // Filtra por el número mínimo de revisiones si se proporciona
        }
      }
    ]
    }); */


// Inicializa un objeto para almacenar la cantidad por categoría
const cantidadPorCategoria = {};

// Crear un conjunto para rastrear las categorías ya procesadas
const categoriasProcesadas = new Set();

// Iterar sobre los resultados
for (const item of categories) {
  // Obtener la lista de categorías del elemento actual

  const categoriasItem = (item ?? '').split(',').map(categoria => categoria.trim()).filter(Boolean);

  // Iterar sobre las categorías del elemento actual
  for (const categoria of categoriasItem) {
    // Verificar si la categoría ya ha sido procesada
    if (!categoriasProcesadas.has(categoria)) {
      // Contar las apariciones de la categoría y almacenar el resultado
      const count = resultado.filter(item => (item.categories ?? '').split(',').map(c => c.trim()).includes(categoria)).length;
      cantidadPorCategoria[categoria] = count;

      // Marcar la categoría como procesada
      categoriasProcesadas.add(categoria);
    }
  }
}

// Encuentra la categoría con el máximo conteo
const categorias = Object.keys(cantidadPorCategoria);
const categoriaMasFrecuente = categorias.length > 0
  ? categorias.reduce((a, b) => cantidadPorCategoria[a] > cantidadPorCategoria[b] ? a : b)
  : null;

console.log('Categoría más frecuente:', categoriaMasFrecuente);

// Verificar si la categoría más frecuente existe antes de acceder a compatibilidad.compatibilidad
if (categoriaMasFrecuente !== null) {
  /* console.log(compatibility[categoriaMasFrecuente]); */

  // Filtra el resultado original por la categoría más frecuente
  const resultadoFiltrado = resultado.filter(item => {
    const categoriasItem = (item.categories ?? '').split(',').map(c => c.trim());
    return categoriasItem.includes(categoriaMasFrecuente);
  });
  
  const businessStar = [];
  for (const elemento of resultadoFiltrado) {
    if (elemento.stars > 3.5 && elemento.review_count > 50) {

      businessStar.push(elemento)
      
    }
  }

//Consulta negocios cercanos

  const businessNear = await businessSchema.find({
      $and: [
        {
          "location": {
            $geoWithin: {
              $centerSphere: [[lon, lat], (radioKM - (radioKM/3)) / 6371] // 6371 es el radio de la Tierra en kilómetros
            }
          }
        },
        {
          "_id": { $in: businessStar.map((elemento) => elemento._id) }
        }
      ]
    });

    console.log(businessNear)

  
  
/*   console.log('Resultado Filtrado:', resultadoFiltrado); */
const compatibilityZone = (compatibility[categoriaMasFrecuente]);
// Puedes almacenar estos resultados o pasarlos a otra parte del backend según tus necesidades
 const resultadosFinales = {
  resultado,
  compatibilityZone,
  resultadoFiltrado,
  categoriaMasFrecuente,
  cantidadPorCategoria,
  }; 
/* console.log(resultado); */
/* console.log(resultado[0].latitude);
console.log(resultado[0].longitude); */




 res.json(resultadosFinales);
} else {
  res.json("No se encuentran negocios.");
}

} catch (error) {
 console.error('Error al obtener datos:', error);
 res.status(500).json({ message: 'Error interno del servidor' });
}

});

 // update a user
/*   router.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const {name, age} = req.body;
    businessSchema
    .updateOne({_id: id}, { $set: {name, age}})
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
 }); */


/*  // delete a user
 router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    businessSchema
    .deleteOne({ _id: id})
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
 }); */
 

module.exports = router;