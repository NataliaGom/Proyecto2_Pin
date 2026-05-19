# Proyecto2

Aplicación web inspirada en Pinterest para publicar y descubrir imágenes. Permite a los usuarios crear, editar y eliminar *pins* propios, explorar fotos externas de Unsplash y guardarlas como pins propios.

**Integrantes:** Natalia Gómez Álvarez · André Herrera Cataño · Sergio García Ávila

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [API Reference](#api-reference)
- [Autenticación de usuario](#autenticación-de-usuario)
- [Caché en el frontend](#caché-en-el-frontend)

---

## Descripción general

Proyecto2_Pin es una aplicación full-stack de tipo Pinterest con las siguientes capacidades:

- **Feed propio:** listado paginado de todos los pins registrados en la base de datos.
- **CRUD completo:** cualquier usuario puede crear pins; solo el autor puede editarlos o eliminarlos.
- **Sección Discovery:** el backend consulta la API de Unsplash y expone una versión transformada de sus fotos; el frontend puede guardar cualquiera de ellas como pin con un solo clic.
- **Caché local:** el hook `usePosts` almacena en `localStorage` el feed del usuario activo y solo pide al servidor los posts más nuevos en visitas subsecuentes, reduciendo carga en el backend.

---

## Arquitectura

```
┌─────────────────────────────┐
│        Frontend (React)     │
│   Vite · Bootstrap 5.3      │
│   Puerto 5173 (dev)         │
└────────────┬────────────────┘
             │ HTTP / JSON  (X-User-Id header)
             ▼
┌─────────────────────────────┐
│        Backend (FastAPI)    │
│   Python · psycopg2         │
│   Puerto 8000               │
└─────┬───────────────┬───────┘
      │               │
      ▼               ▼
┌──────────┐   ┌────────────────┐
│PostgreSQL│   │  Unsplash API  │
│(DATABASE │   │  (terceros)    │
│   _URL)  │   └────────────────┘
└──────────┘
```

El frontend nunca llama directamente a Unsplash: toda petición pasa por `/api/discovery`, donde el backend normaliza y simplifica la respuesta antes de devolverla.

---

## Tecnologías

### Backend
| Librería | Uso |
|---|---|
| FastAPI 0.136 | Framework web y validación de rutas |
| Pydantic v2 | Esquemas de validación de datos |
| psycopg2-binary | Conexión a PostgreSQL (sin ORM) |
| httpx | Cliente HTTP asíncrono para Unsplash |
| python-dotenv | Carga de variables de entorno |
| uvicorn | Servidor ASGI |

### Frontend
| Librería | Uso |
|---|---|
| React 19 | UI con componentes funcionales y hooks |
| Vite 8 | Bundler y servidor de desarrollo |
| Bootstrap 5.3 + Bootstrap Icons | Estilos y componentes visuales |

---

## Estructura del proyecto

```
Proyecto2_Pin-main/
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py          # Entrypoint FastAPI, CORS, startup
│       ├── config.py        # Variables de entorno con lru_cache
│       ├── database.py      # Conexión psycopg2 e init_db()
│       ├── schemas.py       # Modelos Pydantic (PostCreate, PostOut, etc.)
│       ├── utils.py         # Helpers: get_user_id, serialización, paginación
│       └── routers/
│           ├── posts.py     # CRUD de posts (/api/posts)
│           └── discovery.py # Proxy Unsplash (/api/discovery)
└── frontend/
    └── proyecto2_pin/
        ├── index.html
        ├── vite.config.js
        ├── package.json
        └── src/
            ├── main.jsx
            ├── App.jsx              # Orquestador principal
            ├── api/
            │   └── client.js        # apiFetch (agrega X-User-Id automáticamente)
            ├── hooks/
            │   ├── useCurrentUser.js  # Gestión del usuario en sessionStorage
            │   ├── usePosts.js        # CRUD + caché local
            │   └── useDiscovery.js    # Carga de fotos Unsplash
            ├── components/
            │   ├── Navbar.jsx
            │   ├── UserForm.jsx
            │   ├── PostForm.jsx
            │   ├── PinGrid.jsx
            │   ├── PinCard.jsx
            │   ├── Pagination.jsx
            │   ├── DiscoverySection.jsx
            │   ├── PostDetailModal.jsx
            │   ├── EditPostModal.jsx
            │   └── DeletePostModal.jsx
            └── styles/
                └── custom.css
```

---

## Requisitos previos

- **Python** ≥ 3.11
- **Node.js** ≥ 18 y npm
- Una instancia de **PostgreSQL** accesible (local o en la nube)
- Una **API key de Unsplash** (cuenta gratuita en [unsplash.com/developers](https://unsplash.com/developers))

---

## Variables de entorno

### Backend — archivo `backend/.env`

```env
DATABASE_URL=postgresql://usuario:contraseña@host:5432/nombre_db
UNSPLASH_ACCESS_KEY=tu_access_key_de_unsplash
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend — archivo `frontend/proyecto2_pin/.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

Si `VITE_API_BASE_URL` no está definido, el cliente apunta a `http://localhost:8000` por defecto.

---

## Instalación y ejecución local

### 1. Backend

```bash
cd backend

# Crear entorno virtual e instalar dependencias
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env             # editar con tus credenciales

# Ejecutar
uvicorn app.main:app --reload
```

La API queda disponible en `http://localhost:8000`.  
Documentación interactiva: `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend/proyecto2_pin

npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

---

## API Reference

Todos los endpoints requieren el header `X-User-Id: <identificador>`.

### Posts — `/api/posts`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/posts` | Lista posts paginados. Params: `page`, `page_size` (1-48), `min_date` (ISO 8601) |
| `GET` | `/api/posts/{id}` | Detalle de un post |
| `POST` | `/api/posts` | Crear post. Body: `title`, `image_url`, `description?`, `tags?` |
| `PATCH` | `/api/posts/{id}` | Actualización parcial (solo el autor) |
| `PUT` | `/api/posts/{id}` | Reemplazo completo (solo el autor) |
| `DELETE` | `/api/posts/{id}` | Eliminar post (solo el autor) |

**Ejemplo de body para POST/PUT:**

```json
{
  "title": "Interiores minimalistas",
  "description": "Espacios con luz natural",
  "image_url": "https://images.unsplash.com/...",
  "tags": ["interiores", "minimalismo"]
}
```

**Respuesta de lista (`GET /api/posts`):**

```json
{
  "items": [ ...posts ],
  "pagination": {
    "page": 1,
    "page_size": 12,
    "total": 58,
    "total_pages": 5
  },
  "min_date": null
}
```

Cada post incluye el campo `can_edit: bool` que indica si el usuario activo es el autor.

### Discovery — `/api/discovery`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/discovery` | Fotos de Unsplash transformadas. Params: `page`, `per_page` (1-30) |

**Ejemplo de ítem en la respuesta:**

```json
{
  "external_id": "abc123",
  "title": "Playa al atardecer",
  "image_url": "https://images.unsplash.com/photo-...",
  "thumb_url": "https://images.unsplash.com/photo-...&w=400",
  "author_name": "Jane Doe",
  "author_url": "https://unsplash.com/@janedoe",
  "width": 5000,
  "height": 3333,
  "color": "#d4a96a",
  "source": "unsplash"
}
```

### Endpoints de salud

| Ruta | Descripción |
|---|---|
| `GET /` | Verifica que el servidor esté corriendo |
| `GET /api/health` | Health check (`{"status": "ok"}`) |

---

## Autenticación de usuario

El proyecto no implementa un sistema de autenticación tradicional. En su lugar, el usuario ingresa un identificador libre (cualquier string) en el formulario inicial. Este valor se almacena en `sessionStorage` bajo la clave `pin_minimal_user` y se adjunta automáticamente en el header `X-User-Id` de cada petición.

El backend valida que el header esté presente; si falta, devuelve `400 Bad Request`. La propiedad `can_edit` de cada post se calcula comparando `user_id` del post con el `X-User-Id` del request, garantizando que solo el autor pueda modificar o eliminar sus pins.

---

## Caché en el frontend

El hook `usePosts` implementa una estrategia de caché en `localStorage` para mejorar la experiencia de usuario:

1. En la primera carga, trae todos los posts del servidor y los almacena en `localStorage` junto con un timestamp.
2. En cargas posteriores (misma página 1), envía el parámetro `min_date` con el timestamp guardado, de modo que el servidor solo devuelve posts modificados desde entonces.
3. Los posts frescos se fusionan con el caché local usando `mergePosts`, que deduplica por `id` y ordena por `updated_at` descendente.
4. Cualquier operación de escritura (crear, editar, eliminar) invalida el caché para forzar una recarga limpia.
