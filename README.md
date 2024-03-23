<p align="center">
  <a href="https://rlujancreations.es" target="blank"><img src="./gitImages/rlujanlogo.png" width="300" alt="RLujanCreations Logo" /></a>
</p>

# I'm working in this project, it doesn't send notifications yet

## Description
Notificator is a backend that allows us managed all our Firebase Cloud Messaging in one app.

Includes the following features:
* Swagger OpenAPI
* You can register one project per user/email 
* Authentication and authorization, using JWT and roles
* Separation of the Users and Auth modules
* Password recovery via email with templates and temporary token
* Each project are multi user with roles
* Each application can be multi channels with a default channel


# Notifications API
1. Clone repositoty
2. ```yarn install```
3. Clone `.env.template` file and rename it to `.env`
4. Configure the environment variables according to our parameters 
5. Get up database container with -d flag to open it decoupled from terminal
```
docker-compose up -d
``` 
## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

### Links
[Implement in-app notifications with NestJS, MySQL, and Firebase](https://blog.logrocket.com/implement-in-app-notifications-nestjs-mysql-firebase)

[TypeORM Docs](https://orkhan.gitbook.io/typeorm/docs)

[https://docs.nestjs.com/techniques/file-upload](Nestjs File upload Docs)