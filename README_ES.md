<p align="center">
  <a href="https://rlujancreations.es" target="blank"><img src="./gitImages/rlujanlogo.png" width="300" alt="RLujanCreations Logo" /></a>
</p>

<a href="README.md" target="blank">Este documento en Inglés</a>

## Description
Notificator es un backend API Rest que nos permitirá administrar nuestro Firebase Cloud Messaging enviando notificaciones a los distintos dispositivos registrados por proyecto en una app.

Incluye las siguientes características:
* Documentación con Swagger OpenAPI
* Se puede registrar un proyecto por usuario/email
* Autentificación y autorización utilizando JWT y roles.
* Características separadas por módulos como Auth, Users, application, messages, etc.
  * Administración de los usuarios de cada aplicación.
* Recuperación de contraseña vía email con plantillas y token temporal.
* Verificación de email vía email con plantillas y token temporal.
* Cada aplicación puede tener múltiples usuarios con roles
* Cada aplicación puede tener múltiples canales con una canal 'default'
*	El dispositivo móvil se registra en la app siendo validado el SHA de la aplicación como en Firebase y el ID de la aplicación com.example.app a través de un Guard
* Envío de notificaciones
  * Imagen opcional
  * Extra data opcional en formato JSON 
* Programar el envío notificaciones 

# Notificator API
1. Clonar repositorio
2. ```yarn install```
3. Clonar el archivo `.env.template` y renombrarlo a `.env`
4. Configurar las variables de entorno del archivo .env según nuestras necesidades
5. Correr el contenedor con la base de datos, añadiendo el flag **-f** podemos indicar el archivo docker-compose.yaml que queramos y **-d** se abrirá desacoplada terminal
```
 docker compose -f docker-compose.dev.yaml -d up 
``` 
6. Obtener un archivo de clave privada de Firebase 
   Dentro de la Firebase, en configuración de proyecto nos dirigimos a cuentas de servicio y hacemos click en generar nueva clave privada

7. Documentación OpenAPI

```
http://localhost:3010/api/
```

# Notas para producción
Ejecutar el comando 
```
docker compose -f docker-compose.prod.yaml -d up 
```
De la misma forma podemos indicar si queremos construir tan solo uno de los servicios especificándolo
```
docker compose -f docker-compose.prod.yaml build app
```   

## Alternativas
Con el archivo `docker-compose.yaml` podemos crear la aplicación en un contenedor docker, lanzando a su vez el contenedor con la base de datos.
```
docker compose -f docker-compose.dev.yaml up
yarn run start:dev

``` 
Obtener la app en un contenedor docker _Dockerfile_

```
docker container run  \
-dp 3010:3010 \
--name notificator \
kmorfo/notificator_app:latest
```

## Correr la aplicación de forma autónoma dentro de un contenedor
1. Crear una nueva carpeta con el nombre que tendra el contenedor
2. Copiar el archivo `docker-compose.standalone.yaml` y `.env.template` a la carpeta
3. Renombrar el archivo `.env.template` a `.env` 
4. Configurar las variables de entorno segun nuestras necesidades
5. Ejecutar el comando
```
docker compose -f docker-compose.standalone.yaml up -d
```

## Solución a posibles errores al crear la imagen
Una forma de solventarlo es eliminando los `node_modules` y el `yarn.lock` del proyecto. Ahora en el archivo `package.json` eliminar todos los **^** de las versiones de las dependencias, esto para que instalen estas versiones exactas.

Si ya habíamos levantado el proyecto
``` 
docker compose down --volumes
docker compose build
docker compose up

```

### Links
[Ejemplo para implementar un servidor NestJS, MySQL, and Firebase](https://blog.logrocket.com/implement-in-app-notifications-nestjs-mysql-firebase)

[Documentación TypeORM](https://orkhan.gitbook.io/typeorm/docs)

[Documentación Nestjs subida de archivos](https://docs.nestjs.com/techniques/file-upload)

### Other Examples
**Envío de una notificación a un solo token de dispositivo**
```
await firebase
  .messaging()
  .send({
    notification: {
      "title": "title",
      "body": "body"
    },
    token: token,
    android: { priority: 'normal' },
  }).then((response) => {
        console.log(response + ' messages were sent successfully');
      })
  .catch((error: any) => {
    console.error(error);
  });

```

**Creación de la imagen Docker y subirla a DockerHub**
```
docker buildx build --platform linux/amd64,linux/arm64 \
-t kmorfo/notificator_app:1.1.1 \
--push .
```

## License

[MIT licensed](LICENSE).
