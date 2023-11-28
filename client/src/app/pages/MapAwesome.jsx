"use client"
import { MapContainer, Marker, Popup, TileLayer, LayerGroup, Circle, useMapEvents, Polygon, GeoJSON } from "react-leaflet"
import { useState, useEffect } from 'react'
import axios from 'axios';
import { Icon } from "leaflet";
import 'leaflet/dist/leaflet.css';
import URI_SERVER from '../enviroment';
import { AiOutlineSearch } from "react-icons/ai";



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


const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
 iconSize: [38, 38] // size of the icon
});



function SetMarker({ onMarkerClick }) {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click(e) {
      const clickedPosition = e.latlng;
      setPosition(clickedPosition);
      onMarkerClick(clickedPosition);
    },
    locationfound(e) {
      setPosition(e.latlng);
      // map.flyTo(e.latlng, map.getZoom())
    }
  });

  return position ? (
    // Puedes mostrar un marcador en la posición si lo deseas
    <Marker position={position} icon={customIcon}>
        <Popup>Posición: {position.lat}, {position.lng}</Popup>
    </Marker>
  ) : null;
  
}



const categories = [
  'Automotive', 'Arts & Entertainment', 'Active Life','Beauty & Spas', 'Food', 
'Health & Medical',  'Hotels & Travel',  'Local Services', 'Pets', 'Shopping', 'Education', 'Nightlife'
];


export default function MapAwesome() {

 // Estado para almacenar la opción seleccionada
 const [selectedCategory, setSelectedCategory] = useState('');
 const [calculatedValue, setCalculatedValue] = useState(null);
 // Manejar cambios en la opción seleccionada
 const handleSelectCategory = (event) => {
   const selectedValue = event.target.value;
   console.log(selectedValue)
   setSelectedCategory(selectedValue);

 };

 
  
    const [inputValue, setInputValue] = useState("");
    const [selected, setSelected] = useState("");
    const [open, setOpen] = useState(false);
  
  
  const [position, setPosition] = useState(null);
  const [lastPosition, setLastPosition] = useState(null);
 // GET DATA API
  const [data, setData] = useState([]);

      //SET MARKER
    
      
      const handleMarkerClick = async (position) => {
        console.log('Posición del clic en el marcador:', position);
         
        try {
          setPosition([position.lat,position.lng])
          setLastPosition([position.lat,position.lng])
          const response =  await axios.get(URI_SERVER.URI_SERVER, {params: {
          latitud: position.lat ,
          longitud: position.lng,
          radio: radio,
         numRevisiones: 0,
    
        }})
          


          console.log('Respuesta del backend:', response.data);
          setData(response.data)
          // Puedes manejar la respuesta del backend según tus necesidades
        } catch (error) {
          console.error('Error al enviar la información al backend:', error);
          // Puedes manejar el error según tus necesidades
        }
        
          
      };
      
      const coordenadas = [];

      if (data["resultado"] && Array.isArray(data["resultado"]) && data["resultado"].length > 0) {
        data["resultado"].forEach(marker => {
          if (marker && marker.location && marker.location.coordinates) {
            coordenadas.push(marker.location.coordinates);
          }
          
        });
      } else {
        console.error("Data, its 'resultado' property, or the array at index 0 is undefined or empty.");
      }
      const sameCategory = [];
      if (data["resultadoFiltrado"] && Array.isArray(data["resultadoFiltrado"]) && data["resultadoFiltrado"].length > 0) {
        data["resultadoFiltrado"].forEach(marker => {
          if (marker && marker.location && marker.location.coordinates) {
            sameCategory.push(marker.location.coordinates);
          }
          
        });
      } else {
        console.error("Data, its 'resultado' property, or the array at index 0 is undefined or empty.");
      }

          // Itera sobre los demás elementos en data y agrega sus coordenadas al estado de markers
          
      

        // DOT QUERIES IN FRONTED
        const [radio, setRadio] = useState(150);


        useEffect(() => {
          
          // Esta función se ejecutará cuando `radio` cambie, pero no inmediatamente.
          const temporizador = setTimeout(() => {
            // Realizar la llamada al backend con el valor actualizado de `radio`.
           
            consultarBackend();
          }, 2000); // Puedes ajustar el tiempo de espera según tus necesidades.
      
          // Limpiar el temporizador si `radio` cambia antes de que expire el tiempo.
          return () => clearTimeout(temporizador);
        }, [radio]);

        

          const consultarBackend = async () => {
            try {
             
           
              const response = await axios.get(URI_SERVER.URI_SERVER, {
                params: {
                  latitud: lastPosition[0],
                  longitud: lastPosition[1],
                  radio: radio,
                  numRevisiones: 0,
                },
              });
              
              console.log('Respuesta del backend:', response.data);
              setData(response.data);
            } catch (error) {
              console.error('Error al enviar la información al backend:', error);
            }
          };
          const manejarCambioRadio = async (evento) => {
            setRadio(evento.target.value);
    
          };
        
      // Datos del formulario

      const [businessName, setBusinessName] = useState('');
      const [description, setDescription] = useState('');




      
      const enviarDatosAlBackend = async () => {
        try {
          // Aquí debes reemplazar 'URL_DEL_BACKEND' con la URL real de tu backend
          
          // const response = await axios.post("http://localhost:5000/estructura-405315/us-central1/api/v1/business/categorie", {
            const response = await axios.post("https://us-central1-estructura-405315.cloudfunctions.net/api/v1/business/categorie", {
            businessName,
            description,
            selectedCategory
          });
    
          console.log('Respuesta del backend:', response.data);
           
          // Puedes realizar acciones adicionales después de enviar los datos al backend
        } catch (error) {
          console.error('Error al enviar datos al backend:', error);
        }
      };

      const handleSubmit = (event) => {
        event.preventDefault(); // Evita que la página se recargue al enviar el formulario
    
        // Aquí puedes realizar acciones con la información del formulario
        console.log('Nombre del negocio:', businessName);
        console.log('Descripción:', description);
        console.log('Category:', selectedCategory)
        enviarDatosAlBackend();
      };


      const categoyMost = data["categoriaMasFrecuente"]
      let categoryMost;
      if(coordenadas.length == 0){
       categoryMost = "No se encontraron negocios"
      }
      {
        categoryMost = categoyMost;
      }
      
     
      let colorOptions = { color: 'green', fillColor: 'green' }
      if(categoryMost === selectedCategory){
         colorOptions = { color: 'green', fillColor: 'green' }
      }{
        colorOptions = { color: 'red', fillColor: 'red' }
      }


    const center = [53.5460453, -113.4991693]

    

      const resultIcon = new Icon({
         iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
        //iconUrl: require("./icons/placeholder.png"),
        iconSize: [10, 10] // size of the icon
      });
      const filtertIcon = new Icon({
        iconUrl: "https://ucarecdn.com/34a70075-5197-46eb-af63-0a50d9656db5/-/preview/500x500/-/quality/smart/-/format/auto/",
       //iconUrl: require("./icons/placeholder.png"),
       iconSize: [10, 10] // size of the icon
     });
    /*  const compatibilidad = (data["compatibilityZone"]) */

     if( coordenadas.length > 0 && categoyMost !== undefined && selectedCategory !== undefined){
      // console.log(compatibilidad)

      if (compatibilidad[categoyMost][selectedCategory] !== calculatedValue ){
        setCalculatedValue(compatibilidad[categoyMost][selectedCategory])
      }

     }
     
      
  return (
    <>
      
      <div className="flex ">
          <div className="">
            <div className=" ">
    <form onSubmit={handleSubmit}>
      <div className="ml-5 mr-5 space-y-0 h-87 w-70 box-content">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Basic Information</h2>
          <p className="mt-0 text-sm leading-6 text-gray-600">
          This information will help us to provide you with greater viability for your business.
          </p>

          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="Business Name" className="block text-sm font-medium leading-6 text-gray-900">
                Business name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                  <input
                    type="text"
                    name="business"
                    id="business"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="name"
                    value={businessName}
                    defaultValue={''}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-72 font-medium h-80">
      <div className="absolute inset-y-80">
        
                
 <div>
      <label htmlFor="dropdown">Selecciona una opción:</label>
      <select id="dropdown" value={selectedCategory} onChange={handleSelectCategory}>
        {categories.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
          
        ))}
      </select>
    </div>
    <p>Compatibilidad con la Zona: {calculatedValue * 100}%</p>


      <ul
        className={`bg-white mt-2 overflow-y-auto ${
          open ? "max-h-60" : "max-h-0"
        } `}
      >
        <div className="flex items-center px-2 sticky top-0 bg-white">
          <AiOutlineSearch size={18} className="text-gray-700" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toLowerCase())}
            placeholder="Enter category name"
            className="placeholder:text-gray-700 p-2 outline-none"
          />
        </div>
        {categories.map((category) => (
          <li
            key={category}
            className={`p-2 text-sm hover:bg-sky-600 hover:text-white
            ${
              category.toLowerCase() === selected.toLowerCase() &&
              "bg-sky-600 text-white"
            }
            ${
              category.toLowerCase().startsWith(inputValue)
                ? "block"
                : "hidden"
            }`}
            onClick={() => {
              if (category.toLowerCase() !== selected.toLowerCase()) {
                setSelected(category);
                setOpen(false);
                setInputValue("");
              }
            }}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  </div>
  </div> 

            <div className="col-span-full absolute inset-y-1/4	">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={2}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600"> A brief description of your business.</p>
            </div>
          </div>
        </div>
      </div>
      
        </form>
        
        <div className="flex ">
          <div>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Distancia maxima: 50m
          </p> 
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Distancia maxima: 1000m
          </p> 
          </div>
          <div className="">
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Distancia radial en metros : {radio}
          </p> 
            <input
                  type="range"
                  min="50"
                  max="1000"
                  value={radio}
                  onChange={manejarCambioRadio}
                />
          </div>
    

    </div>
      </div>
            
    </div>
    <div className="bg-white w-100 space-y-2">
         <p> Numero de negocios cercanos: {coordenadas.length}</p>
         <p> Negocios de igual categoria: {sameCategory.length}</p>
         <p>Categoria más frecuente: {categoryMost}</p>
         
    

        </div>
          <MapContainer center={center} zoom={15} >
            <TileLayer 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=WHkJoqOvDDlwqyDDYdqi"
              
            />
            
           
             <SetMarker onMarkerClick={handleMarkerClick} />
            <LayerGroup>
              {position != null && (
              <Circle
                center={[position[0], position[1]]}
                pathOptions={colorOptions}
                radius={radio}
              />)}
            </LayerGroup>
            

            {
              coordenadas.length > 0 && (
                data["resultado"].map( marker => (
                <Marker key={marker} position={[marker.location.coordinates[1], marker.location.coordinates[0]]} icon={resultIcon}>
                  <Popup>{marker.name}</Popup>
                </Marker>
                ))
                
              )
            }
            {
              sameCategory.length > 0 && (
                data["resultadoFiltrado"].map( marker => (
                <Marker key={marker} position={[marker.location.coordinates[1], marker.location.coordinates[0]]} icon={filtertIcon}>
                  <Popup>{marker.name}</Popup>
                </Marker>
                ))
                
              )
            }
        </MapContainer>
      </div>
      
    </>
  )
}
