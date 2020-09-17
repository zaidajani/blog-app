# Blog app

this is a blog application with authentication and authorization, using the jsonWebToken or jwt.

# There are two destinations in the architecture of the app.

- views or client side
- the CRUD side (create, read, update, delete)

---

views can be directly accessed by going to localhost:4000, but to apply crud operations in the database, you need to interact with the API through postman or some other service.

---

# The endpoints.

     there are 7 endpoints in this application.
        1. /
        2. /articles/name-of-the-article
        3. post /admin/post/ ->  post a new article
        4. post /admin/new  -> post a new admin
        5. delete /admin/post/id-of-the-post -> delete particular article.
        6. put /admin/post/id-of-the-post -> edit article
        7. post /auth -> authenticate user

# Setup

install all the packages by executing `npm install`
then, head over to `localhost:4000/`
