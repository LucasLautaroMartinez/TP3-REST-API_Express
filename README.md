# Visualizador de Juegos — API REST

> Aplicación web fullstack desarrollada como continuación del TP de React. Consiste en un visualizador de videojuegos que permite consultar información mediante una API REST propia desarrollada con Node.js, Express, Prisma ORM y PostgreSQL.

---

## Miembros del Grupo

| Nombre         | Email                                      | Rol                         |
| -------------- | ------------------------------------------ | --------------------------- |
| Marcos Chavez  | <marcos.chavez@est.fi.uncoma.edu.ar>       | Desarrollador Backend       |
| Lucas Martinez | <lucas.martinez@est.fi.uncoma.edu.ar>      | Project Manager / Developer |
| Lautaro Lara   | <lautaronicolas.lara@est.fi.uncoma.edu.ar> | Desarrollador Frontend      |

---

## Arquitectura del Proyecto

```txt
Frontend (React + Vite + Tailwind)
        │
        ▼
Backend API REST (Node.js + Express)
        │
        ▼
Prisma ORM + Prisma PG Adapter
        │
        ▼
PostgreSQL (Neon)
```

---

## Funcionalidades Principales

- API RESTful
- CRUD completo de videojuegos
- Persistencia de datos en PostgreSQL
- Validaciones manuales
- Manejo de errores
- Migraciones con Prisma ORM
- Variables de entorno mediante dotenv
- Descripción de juegos en español, ingles y lengua negra

---

## Tecnologías Utilizadas

| Tecnología   | Descripción                |
| ------------ | -------------------------- |
| Node.js      | Entorno de ejecución       |
| Express.js   | Framework backend          |
| Prisma ORM   | ORM para PostgreSQL        |
| PostgreSQL   | Base de datos relacional   |
| Neon         | Hosting de PostgreSQL      |
| dotenv       | Variables de entorno       |
| cors         | Manejo de CORS             |
| nodemon      | Desarrollo backend         |
| jsonwebtoken | Manejo de token de usuario |
| bcrypt       | Encriptación               |
| Swagger      | Documentación de endpoints |

---

## Modelo de Datos

### Entidad Principal: Game

| Campo       | Tipo     | Descripción                |
| ----------- | -------- | -------------------------- |
| id          | Int      | ID autoincremental         |
| Name        | String   | Nombre del juego           |
| Rating      | Int      | Puntuación (1-5)           |
| Developer   | String   | Desarrolladora             |
| Price       | Float    | Precio en USD              |
| ReleaseDate | DateTime | Fecha de lanzamiento       |
| Image       | String   | URL de la imagen principal |
| Description | String   | Descripción del juego      |
| createdAt   | DateTime | Fecha de creación          |
| updatedAt   | DateTime | Fecha de actualización     |

---

## Endpoints de la API

La aplicación contiene documentación de los endpoints hecha con Swagger, disponible de dos formas:

- **Local:** `http://localhost:PUERTO/api-docs`
- **Deploy (recomendado):** [https://tp-3-rest-api-express-7afz.vercel.app/api-docs](https://tp-3-rest-api-express-7afz.vercel.app/api-docs)

### Game

| Método | Endpoint       | Descripción              |
| ------ | -------------- | ------------------------ |
| GET    | /api/games     | Obtener todos los juegos |
| GET    | /api/games/:id | Obtener juego por ID     |
| POST   | /api/games     | Crear nuevo juego        |
| PUT    | /api/games/:id | Actualizar juego         |
| DELETE | /api/games/:id | Eliminar juego           |

### Favorites

| Método | Endpoint           | Descripción                         |
| ------ | ------------------ | ----------------------------------- |
| GET    | /api/favorites     | Obtener todos los favoritos         |
| POST   | /api/favorites/:id | Añadir favorito por ID de juego     |
| DELETE | /api/favorites/:id | Eliminar favorito según ID de juego |

### User

| Método | Endpoint           | Descripción                     |
| ------ | ------------------ | ------------------------------- |
| POST   | /api/auth/login    | Inicia sesión                   |
| POST   | /api/auth/register | Registra un usuario             |
| POST   | /api/auth/logout   | Cierra sesión                   |
| GET    | /api/auth/me       | Obtiene información del usuario |
| GET    | /api/auth/profile  | Obtiene información del perfil  |

---

## Estructura del Proyecto

```txt
TP3-REST-API_EXPRESS/
├── docker-compose.yml
├── package.json
├── package-lock.json
├── prisma
│   ├── data
│   ├── migrations
│   ├── schema.prisma
│   └── seed.js
├── prisma.config.ts
├── README.md
├── src
│   ├── app.js
│   ├── const
│   ├── controllers
│   ├── index.js
│   ├── middlewares
│   ├── prisma
│   ├── routes
│   ├── services
│   ├── utils
│   └── validations
└── vercel.json
```

---

## Instalación del Proyecto

### Requisitos Previos

- Node.js v18 o superior
- npm
- Cuenta en Neon

### Pasos

**1. Entrar al directorio del proyecto**

```bash
cd TP3-REST-API_EXPRESS
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Configurar variables de entorno**

Crear archivo `.env`:

```env
DATABASE_URL="postgresql://..."
PORT=3000
```

Ademas, se tendrá que definir donde está ubicado el frontend

### Local

```env
FRONTEND_URL="http://localhost:5173"
```

### Deploy

```env
FRONTEND_URL="https://tp-2-react-nine.vercel.app/"
```

**4. Ejecutar migraciones**

```bash
npx prisma migrate dev
```

**5. Generar cliente Prisma**

```bash
npx prisma generate
```

**6. Generar seed** _(opcional)_

```bash
npx prisma db seed
```

**7. Iniciar servidor**

```bash
npm run dev
```

Servidor disponible en:

- **Local:** `http://localhost:3000`
- **Deploy:** `https://tp-3-rest-api-express-7afz.vercel.app`

---

## Variables de Entorno

| Variable     | Descripción              |
| ------------ | ------------------------ |
| DATABASE_URL | Conexión PostgreSQL Neon |
| PORT         | Puerto del servidor      |

---

## Decisiones Técnicas Importantes

- Se utilizó **Prisma ORM** para simplificar la comunicación con PostgreSQL.
- Se eligió **Neon** como proveedor cloud para PostgreSQL por su facilidad de integración y plan gratuito.
- Se mantuvo una **arquitectura modular** separando rutas, controladores, servicios y validaciones.
- Las validaciones fueron implementadas manualmente según requerimientos de la cátedra.
- El frontend fue adaptado para consumir una API REST propia en lugar de datos mockeados.

---

## Deploy

Base de datos PostgreSQL hosteada en **Neon**.

## Frontend

Se puede ver mas información sobre el frontend en: [https://github.com/LautaroLaraFai/TP2-REACT](https://github.com/LautaroLaraFai/TP2-REACT)
