# Visualizador de Juegos - API REST + Frontend React

## Miembros del Grupo

| Nombre         | Email                                                                                       | Rol                         |
| -------------- | ------------------------------------------------------------------------------------------- | --------------------------- |
| Marcos Chavez  | [marcos.chavez@est.fi.uncoma.edu.ar](mailto:marcos.chavez@est.fi.uncoma.edu.ar)             | Desarrollador Backend       |
| Lucas Martinez | [lucas.martinez@est.fi.uncoma.edu.ar](mailto:lucas.martinez@est.fi.uncoma.edu.ar)           | Project Manager / Developer |
| Lautaro Lara   | [lautaronicolas.lara@est.fi.uncoma.edu.ar](mailto:lautaronicolas.lara@est.fi.uncoma.edu.ar) | Desarrollador Frontend      |

---

# Descripcion del Proyecto

Aplicacion web fullstack desarrollada como continuacion del TP de React.

El proyecto consiste en un visualizador de videojuegos que permite consultar informacion mediante una API REST propia desarrollada con Node.js, Express, Prisma ORM y PostgreSQL.

El frontend consume la API para mostrar videojuegos mediante scroll infinito, busquedas y vistas detalladas.

---

# Arquitectura del Proyecto

```txt
Frontend (React + Vite + Tailwind)
        │
        ▼
Backend API REST (Node.js + Express)
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL (Neon)
```

---

# Funcionalidades Principales

## Frontend

* Visualizacion de videojuegos
* Infinite Scroll
* Busqueda por nombre
* Vista detallada de videojuegos
* Responsive Design
* Consumo de API REST propia

## Backend

* API RESTful
* CRUD completo de videojuegos
* Persistencia de datos en PostgreSQL
* Validaciones manuales
* Manejo de errores
* Migraciones con Prisma ORM
* Variables de entorno mediante dotenv

---

# Tecnologias Utilizadas

## Frontend

| Tecnologia      | Descripcion                     |
| --------------- | ------------------------------- |
| React           | Libreria principal              |
| Vite            | Bundler y entorno de desarrollo |
| Tailwind CSS    | Estilizado responsive           |
| React Router    | Navegacion entre paginas        |
| Infinite Scroll | Carga dinamica de juegos        |
| Vercel          | Deploy del frontend             |

## Backend

| Tecnologia | Descripcion              |
| ---------- | ------------------------ |
| Node.js    | Entorno de ejecucion     |
| Express.js | Framework backend        |
| Prisma ORM | ORM para PostgreSQL      |
| PostgreSQL | Base de datos relacional |
| Neon       | Hosting de PostgreSQL    |
| dotenv     | Variables de entorno     |
| cors       | Manejo de CORS           |
| nodemon    | Desarrollo backend       |

---

# Modelo de Datos

## Entidad Principal: Game

| Campo       | Tipo     |
| ----------- | -------- |
| id          | Int      |
| title       | String   |
| rating      | Float    |
| imageUrl    | String   |
| releaseDate | DateTime |
| genre       | String   |
| developer   | String   |
| price       | Float    |

---

# Endpoints de la API

| Metodo | Endpoint       | Descripcion              |
| ------ | -------------- | ------------------------ |
| GET    | /api/games     | Obtener todos los juegos |
| GET    | /api/games/:id | Obtener juego por ID     |
| POST   | /api/games     | Crear nuevo juego        |
| PUT    | /api/games/:id | Actualizar juego         |
| DELETE | /api/games/:id | Eliminar juego           |

---

# Estructura del Proyecto

```txt
backend/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
│
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── prisma/
│   ├── routes/
│   ├── services/
│   ├── validations/
│   ├── app.js
│   └── index.js
│
├── .env
├── package.json
└── README.md
```

---

# Instalacion del Proyecto

## Requisitos Previos

* Node.js v18 o superior
* npm
* Cuenta en Neon

---

# Clonar el repositorio

```bash
git clone https://github.com/LautaroLaraFai/TP2-REACT
```

---

# Backend

## Entrar al directorio backend

```bash
cd backend
```

## Instalar dependencias

```bash
npm install
```

## Configurar variables de entorno

Crear archivo `.env`

```env
DATABASE_URL="postgresql://..."
PORT=3000
```

## Ejecutar migraciones

```bash
npx prisma migrate dev
```

## Generar cliente Prisma

```bash
npx prisma generate
```

## Iniciar servidor

```bash
npm run dev
```

Servidor disponible en:

```txt
http://localhost:3000
```

---

# Frontend

## Entrar al directorio frontend

```bash
cd frontend
```

## Instalar dependencias

```bash
npm install
```

## Iniciar aplicacion

```bash
npm run dev
```

Frontend disponible en:

```txt
http://localhost:5173
```

---

# Variables de Entorno

## Backend

| Variable     | Descripcion              |
| ------------ | ------------------------ |
| DATABASE_URL | Conexion PostgreSQL Neon |
| PORT         | Puerto del servidor      |

---

# Decisiones Tecnicas Importantes

* Se utilizo Prisma ORM para simplificar la comunicacion con PostgreSQL.
* Se eligio Neon como proveedor cloud para PostgreSQL por su facilidad de integracion y plan gratuito.
* Se mantuvo una arquitectura modular separando rutas, controladores, servicios y validaciones.
* Las validaciones fueron implementadas manualmente segun requerimientos de la catedra.
* El frontend fue adaptado para consumir una API REST propia en lugar de datos mockeados.

---

# Deploy

## Frontend

Deploy realizado mediante Vercel.

## Base de Datos

Base de datos PostgreSQL hosteada en Neon.
