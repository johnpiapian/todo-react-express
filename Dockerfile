FROM node:18-alpine

# create app directory and copy source code
WORKDIR /app
COPY . .

# install dependencies and run production build
RUN npm install
CMD npm run prod

# port
EXPOSE 3000-8080