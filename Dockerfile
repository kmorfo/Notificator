# Initialize the project by loading the necessary libraries
FROM node:lts-alpine3.19 as dev
WORKDIR /app
COPY package.json ./
RUN yarn install
CMD [ "yarn","start:dev" ]


#    --frozen-lockfile to freeze the versions used and do not change
FROM node:lts-alpine3.19 as dev-deps
WORKDIR /app
COPY package.json package.json
RUN yarn install --frozen-lockfile

# Copy node_modules folder of the previous stage and run build
FROM node:lts-alpine3.19 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
# RUN yarn test
RUN yarn build

#  Create production dependencies --prod
FROM node:lts-alpine3.19 as prod-deps
WORKDIR /app
COPY package.json package.json
RUN yarn install --prod --frozen-lockfile

# We copy everything necessary for the image to work and launch it
FROM node:lts-alpine3.19 as prod
EXPOSE 3010
WORKDIR /app
ENV APP_VERSION=${APP_VERSION}
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD [ "node","dist/main.js"]







