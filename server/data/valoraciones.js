/* const puntajesPorCategoria = {
    'Automotive': 1,
    'Arts & Entertainment': 7,
    'Active Life': 5,
    'Beauty & Spas': 5,
    'Health & Medical': 1,
    'Hotels & Travel': 16,
    'Local Services': 20,
    'Nightlife': 7,
    'Pets': 21,
    'Shopping': 3,
  };

  const categories = [
    'Automotive', 'Arts & Entertainment', 'Active Life',
    'Beauty & Spas', 
    'Health & Medical',  'Hotels & Travel',  'Local Services', 
    'Nightlife', 'Pets', 'Shopping'
  ]; */
  
  const compatibilidad = {
    'Automotive': {
      'Arts & Entertainment': 4,
      'Active Life': 0.6,
      'Beauty & Spas': 0.1,
      'Health & Medical': 0.2,
      'Hotels & Travel': 0.5,
      'Local Services': 0.7,
      'Nightlife': 0.6,
      'Pets': 0.5,
      'Shopping': 0.8,
      'Food': 0.5
    },
    'Arts & Entertainment': {
      'Automotive': 0.4,
      'Active Life': 0.8,
      'Beauty & Spas': 0.6,
      'Health & Medical': 0.7,
      'Hotels & Travel': 0.8,
      'Local Services': 0.9,
      'Nightlife': 0.5,
      'Pets': 0.2,
      'Shopping': 0.1,
      'Food': 0.5
    },
    'Active Life': {
      'Automotive': 0.5,
      'Arts & Entertainment': 0.3,
      'Beauty & Spas': 0.3,
      'Health & Medical': 0.5,
      'Hotels & Travel': 0.3,
      'Local Services': 0.5,
      'Nightlife': 0.4,
      'Pets': 0.5,
      'Shopping': 0.8,
      'Food': 0.4
    },
    'Beauty & Spas': {
      'Automotive': 0.1,
      'Arts & Entertainment': 0.6,
      'Active Life': 0.8,
      'Health & Medical': 0.7,
      'Hotels & Travel': 0.9,
      'Local Services': 0.7,
      'Nightlife': 0.5,
      'Pets': 0.1,
      'Shopping': 0.8,
      'Food': 0.4
    },
    'Health & Medical': {
      'Automotive': 0.1,
      'Arts & Entertainment': 0.7,
      'Active Life': 0.8,
      'Beauty & Spas': 0.5,
      'Hotels & Travel': 0.8,
      'Local Services': 0.8,
      'Nightlife': 0.1,
      'Pets': 0.3,
      'Shopping': 0.4,
      'Food': 0.7
    },
    'Hotels & Travel': {
      'Automotive': 0.5,
      'Arts & Entertainment': 0.8,
      'Active Life': 0.5,
      'Beauty & Spas': 0.6,
      'Health & Medical': 0.4,
      'Local Services': 0.5,
      'Nightlife': 0.7,
      'Pets': 0.6,
      'Shopping': 0.8,
      'Food': 0.8
    },
    'Local Services': {
      'Automotive': 0.8,
      'Arts & Entertainment': 0.2,
      'Active Life': 0.5,
      'Beauty & Spas': 0.3,
      'Health & Medical': 0.7,
      'Hotels & Travel': 0.8,
      'Nightlife': 0.2,
      'Pets': 0.5,
      'Shopping': 0.7,
      'Food': 0.4
    },
    'Nightlife': {
      'Automotive': 0.1,
      'Arts & Entertainment': 0.4,
      'Active Life': 0.4,
      'Beauty & Spas': 0.3,
      'Health & Medical': 0.5,
      'Hotels & Travel': 0.8,
      'Local Services': 0.7,
      'Pets': 0.2,
      'Shopping': 0.2,
      'Food': 0.1
    },
    'Pets': {
      'Automotive': 0.2,
      'Arts & Entertainment': 0.2,
      'Active Life': 0.5,
      'Beauty & Spas': 0.3,
      'Health & Medical': 0.7,
      'Hotels & Travel': 0.4,
      'Local Services': 0.5,
      'Nightlife': 0.2,
      'Shopping': 0.8,
      'Food': 0.6
    },
    'Shopping': {
      'Automotive': 0.3,
      'Arts & Entertainment': 0.5,
      'Active Life': 0.2,
      'Beauty & Spas': 0.7,
      'Health & Medical': 0.3,
      'Hotels & Travel': 0.9,
      'Local Services': 0.5,
      'Nightlife': 0.4,
      'Pets': 0.7,
      'Food': 0.9,
    },
    'Food': {
      'Automotive': 0.1,
      'Arts & Entertainment': 0.8,
      'Active Life': 0.4,
      'Beauty & Spas': 0.6,
      'Health & Medical': 0.4,
      'Hotels & Travel': 0.9,
      'Local Services': 0.6,
      'Nightlife': 0.9,
      'Pets': 0.2,

    },
  };
  
  module.exports = compatibilidad;
  