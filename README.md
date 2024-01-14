# PROYECTO VIAWEB 🧳
Este proyecto contine un servidor web con React y dos microservicios desarrollados con Node.js y FaastApi.
Cada microservicios es independiente y se encarga de tareas especificas.
A continuación, se proporciona una descripción:

## Microservicio Viajes 🛩️

### Descripción:
Este microservicio esta desarrollado en Node.js y utiliza una base de datos MongoDB. Se encarga de gestionar inforomación relacionada a los viajes.

### Instalación ⚙️
- Asegúrate de tener Node.js y MongoDB instalados en tu sistema.
- Clona este repositorio o descomprime el archivo del proyecto.
- Navega al directorio del proyecto y ejecuta npm install para instalar las dependencias.

### Ejecución ▶️
Para iniciar MongoDB, ejecuta 

	mongod --dbpath data/db
 
Luego, inicia el servidor del microservicio

	node main.js
 
### Documentación API 📖
El microservicio incluye documentación de la API generada con Swagger, que puedes acceder una vez que el servidor esté en ejecución.

## Microservicio Autentificacion 🪪

### Descripción:
Este microservicio está desarrollado en FastAPI y utiliza una base de datos MySQL. Se encarga de la autenticación de usuarios.

### Instalación ⚙️
- Asegúrate de tener Python, MySQL y FastAPI instalados en tu sistema.
- Clona este repositorio o descomprime el archivo del proyecto.
- Navega al directorio del proyecto y ejecuta pip install -r requirements.txt para instalar las dependencias.

### Ejecución ▶️
Activa el entorno virtual 

	myenv\Scripts\activate
 
Navega a la carpeta 'app' con

	cd app
 
Inicia el servidor 

	uvicorn main:app --reload
 
### Documentación API 📖
El microservicio incluye documentación de la API generada con Swagger, que puedes acceder en la ruta '/docs' una vez que el servidor esté en funcionamiento.


	https//:localhost:8000/docs

## Frontend en React💻

### Descripción:
Este proyecto de frontend está desarrollado en React y se encarga de la interfaz de usuario para interactuar con los microservicios.

### Instalación ⚙️
- Asegúrate de tener Node.js instalado en tu sistema.
- Clona este repositorio o descomprime el archivo del proyecto.
- Navega al directorio del proyecto y ejecuta npm install para instalar las dependencias.
- 
### Ejecución ▶️
Inicia la aplicación React con (Esto abrirá la aplicación en tu navegador )

	npm start


 

 
