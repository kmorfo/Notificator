<p align="center">
  <a href="https://rlujancreations.es" target="blank"><img src="./gitImages/rlujanlogo.png" width="300" alt="RLujanCreations Logo" /></a>
</p>

<a href="README_ES.md" target="blank">This doc in Spanish</a>

## Description
Notificator is an API Rest backend that allows us to manage all our Firebase Cloud Messaging projects sending notifications to several devices per project in one app.

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


# Notificator API
1. Clone repositoty
2. ```yarn install```
3. Clone `.env.template` file and rename it to `.env`
4. Configure the environment variables according to our parameters 
5. Get up database container **-d** flag to open it decoupled from terminal
```
 docker compose -f docker-compose.dev.yaml -d up 
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
docker compose -f docker-compose.prod.yaml -d up 
```
we also if we want to build only one of the services running the next command
```
docker compose -f docker-compose.prod.yaml build app
```   

## Alternatives
With the `docker-compose.yaml` file we can create the application in a docker container, launching the container with the database in turn.
```
docker compose -f docker-compose.dev.yaml up
yarn run start:dev

  ``` 
Get app in docker container with _Dockerfile_

```
docker container run  \
-dp 3010:3010 \
--name notificator \
kmorfo/notificator_app:latest
```

## Standalone
1. Create folder with the docker container name
2. Copy `docker-compose.standalone.yaml` and `.env.template` files to the empty folder
3. Rename `.env.template` file  it to `.env` 
4. Configure the environment variables according to our parameters 
5. Run command
```
docker compose -f docker-compose.standalone.yaml up -d
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
**Sending a notification to a single device token**
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
