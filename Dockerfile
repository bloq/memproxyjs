FROM node:14-alpine
MAINTAINER Jeff Garzik <jeff@bloq.com>

RUN apk add --no-cache curl

# Create app directory
WORKDIR /usr/src/app
RUN chown node:node /usr/src/app
USER node

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json
# are copied where available (npm@5+).
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]

HEALTHCHECK CMD curl --fail --silent http://localhost:3000
