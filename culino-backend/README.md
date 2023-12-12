# Read Me

## Start the database
Open the `docker-compose.yaml` file inside the `culino` folder. Start the command for the mongodb-database which is `docker-compose up -d mongodb-database`. But you can also start it inside Intellij: Click the arrow next to `mongodb-database`.

### Initial DB setup
For the initialisation of the DB please also start the `mongo-express`container. 

1. Open [http://localhost:8081](http://localhost:8081) to see Mongo-Express.
2. Create a database with the name `culino_db`
3. Create a collection with the name `roles`
4. Then insert the following JSON via the button `New Document`
```
[
   { name: "ROLE_USER" },
   { name: "ROLE_MODERATOR" },
   { name: "ROLE_ADMIN" },
]
```

## Start the backend
The command `mvn spring-boot:run` will start the Spring Boot Application

### Create moderator and admin account

For creating a moderator or admin user please send a request via a POST request in Postman `localhost:8080/api/auth/signup`. 

#### For a moderator please add this body

```
{
    "username": "moderator",
    "email": "mod@mail.com",
    "password": "12345678",
    "roles": ["user", "mod"]
}
```

#### For an admin please add this body

```
{
    "username": "admin",
    "email": "admin@mail.com",
    "password": "12345678",
    "roles": ["user", "admin"]
}
```

Afterward you can start the frontend and use the application as you want.

## Start the frontend
The command `npm start` runs the app on [http://localhost:8081](http://localhost:8081)

---

**Tutorials used for backend**

Auth:
- [Spring Boot JWT Authentication with MongoDB](https://www.bezkoder.com/spring-boot-jwt-auth-mongodb/#Spring_Boot_JWT_Authentication_with_MongoDB_example)

CRUD:
- [React + Spring Boot + MongoDB CRUD](https://www.bezkoder.com/react-spring-boot-mongodb/)

**Tutorials used for frontend**

Auth:
- [React Hooks JWT Authentication](https://www.bezkoder.com/react-hooks-jwt-auth/)

CRUD:
- [React + Spring Boot + MongoDB CRUD](https://www.bezkoder.com/react-spring-boot-mongodb/)
- [React Hooks CRUD with Axios](https://www.bezkoder.com/react-hooks-crud-axios-api/)

**Image-related tutorials**

- [React Image Upload with Preview (Hooks)](https://www.bezkoder.com/react-image-upload-preview-hooks/)
- [Spring Boot File Upload](https://www.bezkoder.com/spring-boot-file-upload/)
- [Spring Boot Delete File](https://www.bezkoder.com/spring-boot-delete-file/)


