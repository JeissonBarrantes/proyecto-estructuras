const yelp = require('yelp-fusion');
require("dotenv").config();

const searchRequest = {
    location: 'New York City',
    limit: 1, // Limita la respuesta a un solo resultado para simplificar la demostración
};

const client = yelp.client(process.env.API_KEY_VALUE);

client.search(searchRequest).then(response => {
    const firstResult = response.jsonBody.businesses[0];
    if (firstResult) {
        const businessInfo = {
            Name: firstResult.name,
            Address: firstResult.location.address1,
            Rating: firstResult.rating,
            Reviews: firstResult.review_count,
        };
        const prettyJson = JSON.stringify(businessInfo, null, 4);
        console.log(prettyJson);
    } else {
        console.log('No se encontraron negocios.');
    }
}).catch(e => {
    console.error('Error al realizar la búsqueda en la API de Yelp:', e);
});