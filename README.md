<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Practica_3 - Computación en la Nube

[![NestJS](https://img.shields.io/badge/NestJS-8E8E93?logo=nestjs&logoColor=red)](https://nestjs.com/)
[![Docker](https://img.shields.io/badge/Docker-blue?logo=docker&logoColor=white)](https://www.docker.com/)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)

## Descripción

Este proyecto es una práctica de la asignatura **Computación en la Nube** que implementa un backend con el framework **NestJS**, utilizando **Docker** para la virtualización de la aplicación y la base de datos **PostgreSQL**. Está diseñado para ser fácilmente ejecutado en cualquier entorno local mediante **Docker Compose**.

### Integrantes:
- **Bryant**
- **Oriana**
- **Guillermo**

## Características principales

- **Framework**: NestJS (TypeScript)
- **Base de datos**: PostgreSQL
- **Containerización**: Docker y Docker Compose para facilitar la ejecución
- **Configuración**: Variables de entorno gestionadas mediante un archivo `.env`

---

## Pre-requisitos

### Clonar el repositorio:

```
git clone <URL_DEL_REPOSITORIO>
```

Crear el archivo .env

A continuación, copia y pega este contenido para crear tu archivo .env. Esto es importante, ya que el proyecto lo requiere para conectarse a la base de datos:

```

#App Port
PORT=3000

#enviroment
NODE_ENV=development

#postgres
PG_HOST=localhost
PG_DB_NAME=postgres_practica_3
PG_DB_USER=practica_3
PG_DB_PASSWORD=my_scret_password
PG_DB_PORT=26258
```
Instalación de dependencias (opcional si no usas Docker):
```
npm install
```
¿Cómo ejecutar el proyecto?

Este proyecto se ejecuta principalmente con Docker y Docker Compose. Sigue estos pasos:

    Ejecuta Docker Compose:

    Para construir y ejecutar los contenedores de la aplicación y la base de datos, usa el siguiente comando (con el flag -d si deseas ejecutarlo en segundo plano):

    bash
```
docker-compose up --build -d
```
Acceso a la aplicación:

Una vez que los contenedores están corriendo, la aplicación estará disponible en:


http://localhost:3800

Si deseas verificar que todo está funcionando correctamente, puedes acceder al siguiente endpoint de estado:


    http://localhost:3800/api/v1/status

    Base de datos:
        Base de datos: PostgreSQL
        Host: localhost
        Puerto: 26258
        Usuario: practica_3
        Contraseña: my_scret_password
        Nombre de la base de datos: postgres_practica_3

Comandos útiles
Modo de desarrollo
```
npm run dev
```
Modo de producción
```
npm run start:prod
```
Arquitectura y herramientas utilizadas

    NestJS: Un framework progresivo para aplicaciones backend en Node.js.
    PostgreSQL: Base de datos relacional, en este caso ejecutada en su propio contenedor Docker.
    Docker & Docker Compose: Para aislar y ejecutar la aplicación y la base de datos en contenedores.
    TypeScript: Lenguaje usado para escribir el código, proporcionando una experiencia de desarrollo robusta y tipada.

Enlaces útiles

    Documentación oficial de NestJS: https://nestjs.com
    Documentación oficial de Docker: https://www.docker.com/
    Documentación oficial de PostgreSQL: https://www.postgresql.org/


