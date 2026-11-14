# Noted — Red social de notas

Aplicación web Full Stack donde los usuarios publican notas, con su nombre o de forma anónima, las etiquetan, comentan, votan y guardan en favoritos.

Es el proyecto final del bootcamp **Full Stack Software Developer de 4Geeks Academy** (agosto – septiembre de 2025), desarrollado por un equipo de 4 personas.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

---

## Funcionalidades

- Registro e inicio de sesión con **JWT**, y también con **Google**.
- Publicar notas con o sin identidad (modo anónimo).
- Etiquetas (tags) y búsqueda de notas.
- Comentarios: crear, editar y eliminar los propios.
- Votos **like / dislike** con contador.
- Ordenar las notas por **más votadas**, **más comentadas** o **más recientes**.
- Favoritos: guardar y quitar notas.
- Perfil de usuario con biografía, foto y notas guardadas.

## Tecnologías

| Capa | Tecnologías |
| --- | --- |
| Frontend | React 18, React Router, Context API + useReducer, Bootstrap / React-Bootstrap, Vite |
| Backend | Python, Flask, Flask-JWT-Extended, Flask-Bcrypt, Flask-CORS |
| Base de datos | PostgreSQL, SQLAlchemy, Flask-Migrate (Alembic) |
| Otros | Cloudinary (imágenes de perfil), Google OAuth |

La API REST tiene 28 endpoints en `src/api/routes.py`.

## Mi aporte

Trabajé en el frontend y en el backend:

- **Comentarios (CRUD completo):** endpoints en Flask para crear, editar y eliminar comentarios, con la relación correcta con el usuario autor, e integración en React.
- **Sistema de votos like / dislike:** modelo `Votes`, migración de base de datos, endpoints de voto y de conteo, y botones en la interfaz.
- **Ordenación de notas:** por más votadas, más comentadas y más recientes.
- **Perfil de usuario:** página con las notas guardadas del usuario.
- **Estilos:** rediseño de las vistas de Inicio y Detalle de nota con CSS y Bootstrap.

## Equipo

- Diego Amorin
- Diego Undreiner
- Eduardo Fereda
- Paulo Maracara

## Cómo ejecutarlo en local

Requisitos: Python 3.13, Pipenv, Node.js 20+ y PostgreSQL.

1. Clona el repositorio y crea el archivo `.env` a partir de `.env.example`. Ajusta `DATABASE_URL` a tu base de datos PostgreSQL.
2. Backend:

   ```bash
   pipenv install
   pipenv run upgrade   # aplica las migraciones
   pipenv run start     # API en http://localhost:3001
   ```

3. Frontend, en otra terminal:

   ```bash
   npm install
   npm run start
   ```

## Estado

Proyecto académico terminado. No tiene una demo desplegada por ahora.
