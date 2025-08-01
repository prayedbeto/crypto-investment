# Crypto Investment Platform

Una plataforma para inversión en criptomonedas con backend en Express y frontend en React/Vite/Tailwind CSS.

## 🚀 Estructura del Proyecto

```
crypto-investment/
├── backend/          # API REST con Express
├── frontend/         # Aplicación React con Vite y Tailwind CSS
└── README.md         # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Headless UI** - Componentes de UI accesibles
- **Heroicons** - Iconos

## 📋 Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd crypto-investment
```

### 2. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp env.example .env

# Iniciar el servidor de desarrollo
npm run dev
```

### 3. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp env.example .env

# Iniciar el servidor de desarrollo
npm run dev
```

## 🚀 Uso

### Backend
- **Puerto**: 3001
- **URL**: http://localhost:3001
- **API**: http://localhost:3001/api

### Frontend
- **Puerto**: 5173
- **URL**: http://localhost:5173

## 📚 API Endpoints

### Salud de la API
- `GET /api/health` - Verificar estado de la API
- `GET /` - Información general de la API

## 📁 Estructura de Archivos

### Backend
```
backend/
├── src/
│   ├── controllers/     # Controladores de la API
│   ├── routes/          # Rutas de la API
│   └── app.js           # Aplicación principal
├── env.example          # Variables de entorno de ejemplo
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/           # Páginas de la aplicación
│   ├── services/        # Servicios de API
│   └── App.jsx          # Componente principal
├── env.example          # Variables de entorno de ejemplo
└── package.json
```

## 🧪 Scripts Disponibles

### Backend
```bash
npm run dev          # Iniciar servidor de desarrollo
npm start            # Iniciar servidor de producción
```

### Frontend
```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build de producción
```

### Proyecto Completo
```bash
npm run install:all  # Instalar dependencias de ambos proyectos
npm run dev          # Iniciar ambos proyectos simultáneamente
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno Backend (.env)
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Variables de Entorno Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🚀 Despliegue

### Backend
1. Configurar variables de entorno para producción
2. Configurar PM2 o similar para gestión de procesos
3. Configurar nginx como proxy reverso

### Frontend
1. Ejecutar `npm run build`
2. Servir los archivos estáticos con nginx o similar
3. Configurar el proxy para las peticiones de API

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio. 