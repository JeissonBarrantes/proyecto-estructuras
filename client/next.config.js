
const path = require('path');


/** @type {import('next').NextConfig} */

const nextConfig = {

        patterns: [
          {
            from: 'node_modules/leaflet/dist/images',
            to: path.resolve(__dirname, 'public', 'leaflet', 'images')
          },
        ],
      
    
}

module.exports = nextConfig;