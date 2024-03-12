<p align="center">
  <a href="https://rlujancreations.es" target="blank"><img src="./gitImages/rlujanlogo.png" width="300" alt="RLujanCreations Logo" /></a>
</p>

## Description


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