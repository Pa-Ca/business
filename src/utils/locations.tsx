const locations = [
  "13 de septiembre",
  "18 de octubre",
  "23 de enero",
  "Acosta Carles",
  "Alta Florida",
  "Alta Vista",
  "Altagracia",
  "Altamira",
  "Alto Hatillo",
  "Alto Prado",
  "Altos de Irapa",
  "Antímano",
  "Artigas",
  "Barrio Andrés Bello",
  "Barrio Bello Campo",
  "Barrio Bucaral",
  "Barrio El Amparo",
  "Barrio El Cafetal",
  "Barrio El Eraso",
  "Barrio Guzmán Blanco",
  "Barrio Hoyo de la Puerta",
  "Barrio La Castellana",
  "Barrio La Ceiba",
  "Barrio La Cruz de Chacao",
  "Barrio La Lucha",
  "Barrio La Manguera",
  "Barrio Las Malvilas",
  "Barrio Los Sin Techo",
  "Barrio Niño Jesús",
  "Barrio Nuevo Callejon",
  "Barrio Obrero",
  "Barrio Parate Bueno",
  "Barrio Pedregal",
  "Barrio San José",
  "Barrio San Miguel",
  "Barrio Santa Rosa",
  "Barrio Sucre",
  "Barrio Villa Zoila",
  "Bella Vista",
  "Bello Campo",
  "Bello Monte",
  "Boleíta Norte",
  "Boleíta Sur",
  "Boquerón",
  "Brisas de Petare",
  "Brisas de Propatria",
  "Bucaral",
  "Buena Vista",
  "Buenos Aires",
  "Camino de los Españoles",
  "Campo Alegre",
  "Campo Claro",
  "Campo Rico",
  "Carapa",
  "Carapita",
  "Caribe",
  "Caricuao",
  "Casalta",
  "Catedral",
  "Catia",
  "Caurimare",
  "Caño Amarillo",
  "Cementerio",
  "Cerro Verde",
  "Chacao",
  "Chapellin",
  "Chapellín",
  "Chuao",
  "Ciudad Tamanaco",
  "Ciudad Tiuna",
  "Ciudad Universitaria (parte de la Urb Valle Abajo)",
  "Coche",
  "Colinas de Bello Monte",
  "Colinas de La California",
  "Colinas de Santa Mónica",
  "Colinas de Vista Alegre",
  "Colinas de las Acacias",
  "Colinas de los Chaguaramos",
  "Cotiza",
  "Country Club",
  "Cristo es La Puerta",
  "Cumbres de Curumo",
  "Cutira",
  "El Algodonal",
  "El Amparo",
  "El Atlántico",
  "El Bosque",
  "El Cafetal",
  "El Cardonal",
  "El Cigarral",
  "El Conde",
  "El Dorado",
  "El Dorado (de Chacao)",
  "El Dorado (de Sucre)",
  "El Guamal",
  "El Guayabao",
  "El Hatillo",
  "El Limón",
  "El Llanito",
  "El Manguito",
  "El Marqués",
  "El Panteón",
  "El Paraíso",
  "El Pedregal",
  "El Peñón",
  "El Pinar",
  "El Placer",
  "El Polvorín",
  "El Refugio",
  "El Retiro",
  "El Rosal",
  "El Sifón",
  "El Silencio",
  "El Triángulo",
  "El Valle",
  "El Volcán",
  "Estado Leal",
  "Federico Quiroz",
  "Foro Libertador",
  "Fuerte Tiuna",
  "González Cabrera",
  "Gramoven",
  "Guaicaipuro",
  "Guaicay",
  "Horizonte",
  "Hornos de Cal",
  "Hoyo de la Puerta",
  "Hoyo de las Delicias",
  "Jardín Botánico",
  "José Gregorio Hernández",
  "Juan Pablo II",
  "Juan XXIII",
  "La Baranda",
  "La Bonita",
  "La Boyera",
  "La Cabaña",
  "La California Norte",
  "La California Oeste",
  "La California Sur",
  "La Campiña",
  "La Candelaria",
  "La Carlota",
  "La Castellana",
  "La Ceiba",
  "La Charneca",
  "La Ciudadela",
  "La Colina",
  "La Colmena",
  "La Cortada",
  "La Floresta",
  "La Florida",
  "La Guairita",
  "La Hoyada",
  "La Lagunita",
  "La Lucha",
  "La Moran",
  "La Pastora",
  "La Paz",
  "La Pericosa",
  "La Rinconada",
  "La Silsa",
  "La Tahona",
  "La Trinidad",
  "La Unión",
  "La Urbina",
  "La Vega",
  "La Yaguara",
  "Las Acacias",
  "Las Adjuntas",
  "Las Casitas",
  "Las Delicias de Sabana Grande",
  "Las Escaleras de la 1 a la 7",
  "Las Fuentes",
  "Las Lomas",
  "Las Luces",
  "Las Marías",
  "Las Mercedes",
  "Las Palmas",
  "Las Torres",
  "Las Tunitas",
  "Lebrún",
  "Loira",
  "Loma Larga",
  "Lomas de La Lagunita",
  "Lomas de La Trinidad",
  "Lomas de Los Chorros",
  "Lomas de Urdaneta",
  "Lomas del Mirador",
  "Lomas del Ávila",
  "Los Campitos",
  "Los Caobos/Plaza Venezuela",
  "Los Cedros",
  "Los Cerritos",
  "Los Chaguaramos",
  "Los Chorros",
  "Los Cortijos",
  "Los Dos Caminos",
  "Los Eucaliptos",
  "Los Frailes",
  "Los Geranios",
  "Los Haticos",
  "Los Laureles",
  "Los Magallanes",
  "Los Mangos",
  "Los Mecedores",
  "Los Naranjos",
  "Los Nísperos",
  "Los Nísperos 2",
  "Los Palos Grandes",
  "Los Paraparos",
  "Los Pasajes",
  "Los Pinos",
  "Los Pomelos",
  "Los Robles",
  "Los Rosales",
  "Los Ruíces",
  "Los Samanes",
  "Los Totumo",
  "Los Álamos",
  "Luis Felipe",
  "Luis Hurtado Higuera",
  "Lídice",
  "Macaracuay",
  "Macarao",
  "Mamera",
  "Manicomio",
  "Manzanares",
  "Mario Briceño Iragorry",
  "Maripérez",
  "Miranda",
  "Montalbán",
  "Monte Alto",
  "Montecristo",
  "Monterrey",
  "Mulatal",
  "Niño Jesús",
  "Nueva Caracas",
  "Nuevo Horizonte",
  "Olivett",
  "Oropeza Castillo",
  "Pajaritos",
  "Palo Verde",
  "Paseo Los Próceres",
  "Petare",
  "Plan de Manzano",
  "Prados de María",
  "Prados del Este",
  "Propatria",
  "Pérez Bonalde",
  "Quebrada Honda",
  "Quebradita",
  "Quinta Crespo",
  "Roca Tarpeya",
  "Ruperto Lugo",
  "Sabana Grande",
  "Sabana Grande (de La Bandera)",
  "Sabana del Blanco",
  "San Agustín del Norte",
  "San Agustín del Sur",
  "San Antonio (de La Bandera)",
  "San Antonio de Sabana Grande",
  "San Bernardino",
  "San José",
  "San Juan",
  "San Luis",
  "San Marino",
  "San Martín",
  "San Miguel",
  "San Rafael",
  "San Román",
  "Sans-Souci",
  "Santa Ana",
  "Santa Cecilia",
  "Santa Clara",
  "Santa Eduvigis",
  "Santa Fe",
  "Santa Inés",
  "Santa María",
  "Santa Mónica",
  "Santa Paula",
  "Santa Rosa",
  "Santa Rosa de Lima",
  "Santa Rosalía",
  "Santa Sofía",
  "Santa Teresa",
  "Sartanejas",
  "Sebucán",
  "Simón Bolívar",
  "Simón Rodríguez",
  "Sin Ley",
  "Sorocaima",
  "Tacagua Vieja Tamanaquito",
  "Terrazas de Caricuao",
  "Terrazas de Guaicaipuro",
  "Terrazas de Las Acacias",
  "Terrazas del Club Hípico",
  "Terrazas del Ávila",
  "Tienda Honda",
  "Unión",
  "Urb Cultura",
  "Urdaneta",
  "Valle Abajo",
  "Valle Arriba",
  "Vista Al Mar",
  "Vista Alegre",
  "Vista Hermosa",
  "Washington",
  "Zona Industrial de La Yaguara",
];
const sorted = locations.sort();
const result = sorted.map((item) => ({
  label: item,
  value: item,
}));

export default result;
