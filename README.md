# todo-react-express
A remake of my frontend todo app into a fully functional web app by implementing a login system and database integration.

## Backend
This is a backend API built with Node.js and Express framework that uses Sqlite database to store and manage data. It is secured with Jwt and Bcrypt for authentication and authorization purposes. With this tech stack, the API is capable of handling various CRUD operations and delivering data to client-side applications in a fast and reliable way.

Platform: Node.js <br/>
Framework: Express <br/>
Database: Sqlite <br/>
Security: Jwt, Bcrypt <br/>

## Frontend
The frontend for this project utilizes React, a powerful JavaScript library known for its speed, scalability, and flexibility. React is combined with Next.js, a framework that adds features like server-side rendering and routing. This combination offers a powerful toolkit for building complex and interactive applications with enhanced performance and SEO capabilities.

Library: React <br/>
Framework: Nextjs

## Docker
Docker is utilized to containerize the project, ensuring portability and reproducibility by encapsulating the application and its dependencies. This approach simplifies deployment and enables seamless execution across various environments.

## Development
To ease local development setup and execution, the project incorporates certain tooling configurations. To install necessary dependencies for the root and run both the front-end and back-end concurrently, a single command can be used.

To set up root tooling, execute:
```
npm install
```

Then, to launch the frontend and backend, execute:
```
npm run build && npm run dev
```

The command `npm run build` is only necessary during the initial setup to install the dependencies for both projects. If you have already completed this step, you can simply run `npm run dev`. For further details, please refer to the package.json file.