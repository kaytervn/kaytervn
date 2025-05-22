<h1 align="center"> Online Courses Website </h1>

This MERN Stack project involves the development of a website that offers online courses, incorporating knowledge of object-oriented system design through UML specification, project management, and iterative development. Additionally, the product implements a security method using token encryption and password hashing.

| Project Name                  | Online Courses Website                                                                    |
| :---------------------------- | :---------------------------------------------------------------------------------------- |
| **Subject**                   | Object-Oriented Software Engineering                                                      |
| **Start Date**                | 03/2024                                                                                   |
| **End Date**                  | 05/2024                                                                                   |
| **Team Size**                 | 4                                                                                         |
| **Documentation**             | [PDF](https://drive.google.com/file/d/1w_m2uK-vjerwkcEc-ViiEUOURG5R3gJ3/view?usp=sharing) |
| **Project Management Docs**   | [PDF](https://drive.google.com/file/d/11O4lJ1eoXsb5Kx8TqpkbnMqXIVqOM_8n/view?usp=sharing) |
| **Live Website**              | [LINK](https://online-courses-web.onrender.com/)                                          |
| **Development Process**       | Iterative, Incremental Frameworks                                                         |
| **Unified Modeling Language** | Use Case Diagram, Class Diagram, Sequence Diagram, Collaboration Diagram                  |

<h2>Technologies Applied</h2>

|                                 | Technology                        |
| :------------------------------ | :-------------------------------- |
| **UX/UI - Client Side**         | NodeJS, Vite & ReactJS, Bootstrap |
| **API Endpoints - Server Side** | NodeJS, ExpressJS                 |
| **Database**                    | MongoDB                           |
| **Cloud Storage**               | Cloudinary                        |
| **Code Editor**                 | VSCode                            |
| **Source Control**              | Git, Github                       |
| **Deployment**                  | Render, MongoDB Atlas             |
| **UML Diagrams**                | Draw.io, PlantUML                 |

<h2>API Endpoints</h2>

<details>
<summary>USER ENDPOINTS</summary>

| Endpoint                               | Method | Description                                                            |
| -------------------------------------- | ------ | ---------------------------------------------------------------------- |
| `/api/users/register`                  | POST   | Register a new user                                                    |
| `/api/users/register-app-user`         | POST   | Register a new app user                                                |
| `/api/users/register/instructor`       | POST   | Register a new instructor (requires authentication)                    |
| `/api/users/otp-authentication`        | POST   | Authenticate user with OTP                                             |
| `/api/users/login`                     | POST   | Login user                                                             |
| `/api/users/login-app-user`            | POST   | Login app user                                                         |
| `/api/users/forgot-password`           | POST   | Request password reset                                                 |
| `/api/users/reset-password/:id/:token` | POST   | Reset password with specific ID and token                              |
| `/api/users`                           | GET    | Get current user information (requires authentication)                 |
| `/api/users/update-profile`            | PUT    | Update user profile information (requires authentication, file upload) |
| `/api/users/update-profile-picture`    | PUT    | Update user profile picture (requires authentication, file upload)     |
| `/api/users/change-password`           | PUT    | Change user password (requires authentication)                         |
| `/api/users/change-password-app-user`  | PUT    | Change app user password (requires authentication)                     |
| `/api/users/change-app-user-name`      | PUT    | Change app user name (requires authentication)                         |
| `/api/users/get-list-users/:role`      | GET    | Get list of users by role (requires authentication)                    |
| `/api/users/:id`                       | GET    | Get user information by ID                                             |
| `/api/users/change-user-status/:id`    | PUT    | Change user status by ID (requires authentication)                     |

</details>

<details>
<summary>COURSE ENDPOINTS</summary>

| Endpoint                                     | Method | Description                                                               |
| -------------------------------------------- | ------ | ------------------------------------------------------------------------- |
| `/api/courses/create-course`                 | POST   | Instructor creates a new course (requires authentication, file upload)    |
| `/api/courses/update-course-intro/:id`       | PUT    | Update course introduction (requires authentication, file upload)         |
| `/api/courses/delete-course/:id`             | DELETE | Delete a course (requires authentication)                                 |
| `/api/courses/user-courses`                  | GET    | Get a list of courses created by the instructor (requires authentication) |
| `/api/courses/search-user-courses`           | POST   | Search for courses created by the instructor (requires authentication)    |
| `/api/courses/search-courses`                | POST   | Search for all courses                                                    |
| `/api/courses/change-course-visibility/:id`  | PUT    | Change the visibility status of a course (requires authentication)        |
| `/api/courses/change-course-status/:id`      | PUT    | Change the status of a course (requires authentication)                   |
| `/api/courses/all`                           | GET    | Get all courses                                                           |
| `/api/courses/getNewestCourse`               | GET    | Get the newest course                                                     |
| `/api/courses/getBestSellerCourse`           | GET    | Get the best-selling course                                               |
| `/api/courses/find_course/:str`              | GET    | Find a course by string                                                   |
| `/api/courses/get_course/:id`                | GET    | Get detailed information of a course                                      |
| `/api/courses/get-courses-by-instructor/:id` | GET    | Get a list of courses by instructor ID (requires authentication)          |
| `/api/courses/get-courses-by-student/:id`    | GET    | Get a list of courses by student ID (requires authentication)             |

</details>

<details>
<summary>REVIEW ENDPOINTS</summary>

| Endpoint                                          | Method | Description                                                                |
| ------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| `/api/reviews/create_review/:courseId`            | POST   | Create a review for a course (requires authentication)                     |
| `/api/reviews/get-review-course/:courseId`        | GET    | Get reviews for a course                                                   |
| `/api/reviews/get-my-review-for-course/:courseId` | GET    | Get the authenticated user's review for a course (requires authentication) |

</details>

<details>
<summary>LESSON ENDPOINTS</summary>

| Endpoint                          | Method | Description                                   |
| --------------------------------- | ------ | --------------------------------------------- |
| `/api/lessons/get-course-lessons` | POST   | Get lessons for a course                      |
| `/api/lessons/delete-lesson/:id`  | DELETE | Delete a lesson (requires authentication)     |
| `/api/lessons/update-lesson/:id`  | PUT    | Update a lesson (requires authentication)     |
| `/api/lessons/create-lesson`      | POST   | Create a new lesson (requires authentication) |
| `/api/lessons/get-lesson/:id`     | GET    | Get a specific lesson                         |

</details>

<details>
<summary>DOCUMENT ENDPOINTS</summary>

| Endpoint                              | Method | Description                                                  |
| ------------------------------------- | ------ | ------------------------------------------------------------ |
| `/api/documents/get-lesson-documents` | POST   | Get documents for a lesson                                   |
| `/api/documents/create-document`      | POST   | Create a new document (requires authentication, file upload) |
| `/api/documents/delete-document/:id`  | DELETE | Delete a document (requires authentication)                  |

</details>

<details>
<summary>COMMENT ENDPOINTS</summary>

| Endpoint                            | Method | Description                                    |
| ----------------------------------- | ------ | ---------------------------------------------- |
| `/api/comments/get-lesson-comments` | POST   | Get comments for a lesson                      |
| `/api/comments/create-comment`      | POST   | Create a new comment (requires authentication) |

</details>

<details>
<summary>CART ENDPOINTS</summary>

| Endpoint                                      | Method | Description                                        |
| --------------------------------------------- | ------ | -------------------------------------------------- |
| `/api/carts/addToCart`                        | POST   | Add a course to the cart (requires authentication) |
| `/api/carts/removeFromCart/:cartId/:courseId` | DELETE | Remove a course from the cart                      |
| `/api/carts/clearCart`                        | DELETE | Clear the cart (requires authentication)           |
| `/api/carts/getCart`                          | GET    | Get the cart (requires authentication)             |

</details>

<details>
<summary>INVOICE ENDPOINTS</summary>

| Endpoint                                     | Method | Description                                                                      |
| -------------------------------------------- | ------ | -------------------------------------------------------------------------------- |
| `/api/invoices/my_invoice`                   | GET    | Get the authenticated user's invoices (requires authentication)                  |
| `/api/invoices/checkout`                     | POST   | Checkout and generate an invoice (requires authentication)                       |
| `/api/invoices/my_course`                    | GET    | Get the authenticated user's courses (requires authentication)                   |
| `/api/invoices/my_course/searchByName/:str`  | GET    | Search the authenticated user's courses by name (requires authentication)        |
| `/api/invoices/my_course/searchByTopic/:str` | GET    | Search the authenticated user's courses by topic (requires authentication)       |
| `/api/invoices/my_course/searchByTimeUpdate` | GET    | Search the authenticated user's courses by update time (requires authentication) |

</details>

<details>
<summary>INVOICE ITEM ENDPOINTS</summary>

| Endpoint                                   | Method | Description                                                                                      |
| ------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------ |
| `/api/invoiceItems/all-courses`            | GET    | Get statistics for all courses (requires authentication for admin)                               |
| `/api/invoiceItems/all-courses/instructor` | GET    | Get statistics for all courses created by the authenticated instructor (requires authentication) |

</details>

## Preview

![GIF](https://github.com/kaytervn/Online-Courses-Web/blob/trong-deploy/preview.gif)

