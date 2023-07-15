FROM node:18-alpine

# create app directory and copy source code
WORKDIR /app/backend
COPY . /app/backend

# install dependencies and run production build
RUN npm install
CMD npm run start

# port
EXPOSE 3000