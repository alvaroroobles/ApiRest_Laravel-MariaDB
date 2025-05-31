# ApiRest_Laravel-MariaDB

Este proyecto es una API RESTful desarrollada con Laravel y una base de datos MariaDB para la empresa Grupo Trevenque. El repositorio incluye tecnologías y buenas prácticas para el desarrollo backend y frontend, así como herramientas para facilitar la ejecución y despliegue.

## Tecnologías Utilizadas

- **Laravel (PHP):** Framework backend principal para la construcción de la API REST.
- **MariaDB:** Sistema de gestión de bases de datos relacional utilizado para almacenar la información de la aplicación.
- **JavaScript:** Utilizado en el frontend y para scripts interactivos (fetch/AJAX para las rutas Laravel).
- **Blade:** Motor de plantillas de Laravel para la generación de vistas dinámicas.
- **CSS:** Para el estilo y diseño de las vistas.
- **Docker:** El repositorio incluye un `Dockerfile` y un `dockercompose` para facilitar la creación de contenedores y la configuración del entorno.

## Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/alvaroroobles/ApiRest_Laravel-MariaDB.git
   cd ApiRest_Laravel-MariaDB
   ```
2. **Ejecutar con Docker:**
   Si prefieres usar Docker, puedes construir y levantar los servicios con:
   ```bash
   docker-compose up --build
   ```

## Uso

Una vez instalado y configurado, puedes ejecutar el servidor de desarrollo de Laravel:
La API estará disponible en [http://localhost:8000](http://localhost:8000).

## Estructura del Proyecto

- `app/` - Código fuente principal de Laravel.
- `resources/views/` - Vistas Blade.
- `public/` - Archivos públicos (CSS, JS, imágenes).
- `database/` - Migraciones y seeds.
- `Dockerfile` y `docker-compose.yml` - Archivos de configuración para Docker.
- `Peticiones POST` - Los puntos clicados en el mapa se almacenan en la tabla points

Hecho por [alvaroroobles](https://github.com/alvaroroobles)
