<p align="center">
  <a href="https://rlujancreations.es" target="blank"><img src="./gitImages/rlujanlogo.png" width="300" alt="RLujanCreations Logo" /></a>
</p>

## Description
Notificator is a backend that allows us managed all our Firebase Cloud Messaging sending notifications to several devices per project in one app.

Includes the following features:
* Swagger OpenAPI documentation
* You can register one project per user/email 
* Authentication and authorization, using JWT and roles
* Features separated by modules like Users, Auth, application, messages, etc.
  * Administration application users. 
* Password recovery via email with templates and temporary token
* Email verification via email with templates and temporary token
* Each application are multi user with roles
* Each application can have multiple channels with a default channel
* The mobile device registers in the app, the SHA of the application being validated as in Firebase and the application ID com.example.app through a Guard
* Send Notification messages
  * Optional Image
  * Optional data in JSON format 

Notificator es un backend que nos permitirá administrar nuestro Firebase Cloud Messaging enviando notificaciones a los distintos dispositivos registrados por proyecto en una app.

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


# Notifications API
1. Clone repositoty
2. ```yarn install```
3. Clone `.env.template` file and rename it to `.env`
4. Configure the environment variables according to our parameters 
5. We can run 
5. Get up database container **-d** flag to open it decoupled from terminal
```
 docker compose up -d
``` 
6. Obtain a Firebase private key file 
   Intro Firebase settings project go to service account, click in Generate new private key 

7. OpenAPI Documentation

```
http://localhost:3010/api/
```

# Production notes
Run this command
```
docker compose -f docker-compose.prod.yaml up -d
```
we also if we want to build only one of the services running the next command
```
docker compose -f docker-compose.prod.yaml build app
```   

## Alternatives
As well with **-f** flag to specifying `docker-compose.dev.yaml` to run only postgres container
```
docker compose -f docker-compose.dev.yaml up
yarn run start:dev

  ``` 
Get app in docker containerwith _Dockerfile_

```
docker container run  \
-dp 3010:3010 \
--name notificator \
name/notificator_app:latest
```

## Standalone
1. Create folder with the docker container name
2. Copy `docker-compose.standalone.yaml` and `.env.prod` files to other empty folder
3. Rename `.env.template` file  it to `.env` 
4. Configure the environment variables according to our parameters 
5. Run command
```
docker compose -f docker-compose.prod.yaml up -d
```

## If error when creating Image
One way to solve it is by eliminating the folder `node_modules` and `yarn.lock` file of the project. 
Now in the `package.json` file delete all **^** of the versions of the dependencies, this so that they install these exact versions.

If we had already raised the project
``` 
docker compose down --volumes
docker compose build
docker compose up

```

### Links
[Implement in-app notifications with NestJS, MySQL, and Firebase](https://blog.logrocket.com/implement-in-app-notifications-nestjs-mysql-firebase)

[TypeORM Docs](https://orkhan.gitbook.io/typeorm/docs)

[Nestjs File upload Docs](https://docs.nestjs.com/techniques/file-upload)

### Other Examples
**Send message to one token**
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

**Create Docker image and push to DockerHub**
```
docker buildx build --platform linux/amd64,linux/arm64 \
-t kmorfo/notificator_app:1.0.0 \
--push .
```

## License

[MIT licensed](LICENSE).
