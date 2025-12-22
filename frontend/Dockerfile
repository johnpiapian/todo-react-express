FROM node:18-alpine

# create app directory and copy source code
WORKDIR /app/frontend
COPY . /app/frontend

# install dependencies and run production build
RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]