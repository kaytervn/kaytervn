<h2>Food App API</h2>

<h3>Users API</h3>

| Request         | Method | URL                                                              | Body Type | Arguments               |
| --------------- | ------ | ---------------------------------------------------------------- | --------- | ----------------------- |
| Get user        | GET    | https://food-app-api-demo.onrender.com/api/users/:id             | N/A       | N/A                     |
| Login           | POST   | https://food-app-api-demo.onrender.com/api/users/login           | raw JSON  | email, password         |
| Register        | POST   | https://food-app-api-demo.onrender.com/api/users/                | raw JSON  | name, email, password   |
| Update user     | PUT    | https://food-app-api-demo.onrender.com/api/users/:id             | form-data | image (file)            |
| Forget Password | POST   | https://food-app-api-demo.onrender.com/api/users/forget-password | raw JSON  | email                   |
| Reset Password  | POST   | https://food-app-api-demo.onrender.com/api/users/reset-password  | raw JSON  | email, newPassword, otp |

<h3>Foods API</h3>

| Request                  | Method | URL                                                     | Body Type | Arguments                               |
| ------------------------ | ------ | ------------------------------------------------------- | --------- | --------------------------------------- |
| Get food                 | GET    | https://food-app-api-demo.onrender.com/api/foods/:id    | N/A       | N/A                                     |
| Get foods                | GET    | https://food-app-api-demo.onrender.com/api/foods/       | N/A       | N/A                                     |
| Get foods (lazy loading) | POST   | https://food-app-api-demo.onrender.com/api/foods/layzy  | raw JSON  | page, limit                             |
| Create food              | POST   | https://food-app-api-demo.onrender.com/api/foods/       | form-data | image (file), title, price, description |
| Delete food              | DELETE | https://food-app-api-demo.onrender.com/api/foods/:id    | N/A       | N/A                                     |
| Search foods             | POST   | https://food-app-api-demo.onrender.com/api/foods/search | raw JSON  | title                                   |
