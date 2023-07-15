FROM node:18-alpine

# create app directory and copy source code
WORKDIR /app/frontend
COPY . /app/frontend

# install dependencies and run production build
RUN npm install
CMD npm run build && npm run start

# port
EXPOSE 3000