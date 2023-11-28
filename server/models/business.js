const mongoose = require("mongoose");

const businessSchema = mongoose.Schema({
    business_id: {
        type: String,
        unique: true,
        minlength: 22,
        maxlength: 22,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    location: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true,
          },
        coordinates: [Number]
      },

    latitude: {
        type: Number,
        required: true
    },

    longitude: {
        type: Number,
        required: true
    },

    stars: {
        type: Number,
        required: true
       
    },

    review_count: {
        type: Number,
        required: true
    },

    attributes: {
        RestaurantsTakeOut: {
            type: Boolean,
            
        },
        BusinessParking: {
            garage: Boolean,
            street: Boolean,
            validated: Boolean,
            lot: Boolean,
            valet: Boolean
        }
    },

    categories: {
        type: String,
        required: true
    },
    
    reviews: {
        type: Array
    }

});

module.exports = mongoose.model('Business', businessSchema);