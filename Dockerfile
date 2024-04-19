# Base image with Node.js and Python installed
FROM node:lts-alpine3.19 as base
# Install Python and make sure build tools are available for node-gyp
RUN apk add --no-cache python3 make g++ \
    # Check if /usr/bin/python exists, if not create a symbolic link
    && if [ ! -f /usr/bin/python ]; then ln -s python3 /usr/bin/python; fi

# Development stage
FROM base as dev
WORKDIR /app
COPY package.json ./
RUN yarn install
CMD [ "yarn","start:dev" ]

# Dependencies with frozen lockfile
FROM base as dev-deps
WORKDIR /app
COPY package.json package.json
RUN yarn install --frozen-lockfile

# Builder stage
FROM base as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Production dependencies
FROM base as prod-deps
WORKDIR /app
COPY package.json package.json
RUN yarn install --prod --frozen-lockfile

# Final production image
FROM base as prod
EXPOSE 3010
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
ENV APP_VERSION=${APP_VERSION}

CMD [ "node", "dist/main.js" ]






