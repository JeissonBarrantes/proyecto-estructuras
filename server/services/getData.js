const Business = require('../models/business'); 

const ciudadBuscada = 'San Francisco'; // Reemplaza con la ciudad que estás buscando


// Obtener datos específicos para predicciones en una ciudad específica
Business.find({ city: ciudadBuscada }, 'name latitude longitude description review_count categories rating')
  .exec()
  .then(users => {
    // Procesar los datos como lo necesites
    users.forEach((user) => {
      console.log(`Nombre: ${user.name}, Latitud: ${user.latitude}, Longitud: ${user.longitude}, Descripción: ${user.description}, Cantidad de revisiones: ${user.review_count}, Categorías: ${user.categories.join(', ')}, Calificación: ${user.rating}`);
      // Realiza predicciones u otras operaciones aquí
    });
  })
  .catch(err => {
    console.error('Error al obtener usuarios:', err);
  });
