FROM node:20 as builder

# Install global package
RUN npm i -g tsx tsc

WORKDIR /app

COPY package*.json ./

# Install production dependencies.
RUN yarn

COPY . .

# Run the web service on container startup.
CMD [ "yarn", "start" ]
