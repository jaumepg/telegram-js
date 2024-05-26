const axios = require('axios');
const { Client } = require('@googlemaps/google-maps-services-js');
class GeocodingService {
    /*static async getCoordinates(address) {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    key: "AIzaSyAjqtye4NkSp_kap1qUMZBDOL9nj3Ln_Ho"
                }
            });

            if (response.data.status !== 'OK') {
                return null;
            }
            return {address: response.data.results[0].formatted_address, location:response.data.results[0].geometry.location }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            return null;
        }
    }*/
    static async getCoordinates(address) {
        const client = new Client({});
        const response = await client.geocode({
            params: {
                address: address,
                key: 'AIzaSyAjqtye4NkSp_kap1qUMZBDOL9nj3Ln_Ho',  // Reemplaza con tu API key de Google Maps
            },
            timeout: 1000,  // Tiempo de espera para la solicitud
        })

        if (response.data.status === 'OK') {
            // Dirección encontrada y válida
            const result = response.data.results[0];
            console.log('Dirección válida:', result.formatted_address);
            return {address: result.formatted_address, location:result.geometry.location }
        } else {
            console.log('Dirección no válida:', response.data.status);
            return null;
        }
    }
}

module.exports = GeocodingService;
