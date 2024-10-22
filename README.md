# node-crud-api

This is a study project.
My task is to implement simple CRUD API using in-memory database underneath.
The whole project is in `develop` branch

Note that the file .env.template has been added.
Although this is a training project and no secret information is stored in .env, let's play by the rules right away. In general, just rename .env.template to .env and enter the `port` value (hint - `4000`)

## Features

- Create, retrieve, update, and delete users
- Horizontal scaling using Node.js Cluster API
- JSON file storage for user data
- Simple and lightweight implementation

## Getting Started

1. Clone the Repository

git clone https://github.com/yourusername/user-management-api.git
cd user-management-api 2. Install Dependencies
Run the following command to install the necessary dependencies:

bash
Copy code
npm install 3. Create a .env File
Create a .env file in the root directory of the project and define the following environment variable:

plaintext
Copy code
PORT=4000 4. Run the Application
To start the application with a single instance:

Copy code
npm run start
To start multiple instances using horizontal scaling:

bash
Copy code
npm run start:multi 5. Using the API
The API is available at http://localhost:4000/api/users.

Endpoints
Create a User (POST)
URL: /api/users
Body:

json
Copy code
{
"username": "Peter",
"age": 301,
"hobbies": ["rider", "gaming"]
}
Get All Users (GET)
URL: /api/users

Get a User by ID (GET)
URL: /api/users/:id

Update a User (PUT)
URL: /api/users/:id
Body:

json
Copy code
{
"username": "Updated Name",
"age": 25,
"hobbies": ["hobby1", "hobby2"]
}
Delete a User (DELETE)
URL: /api/users/:id

6. Notes
   The users.json file is used to store user data. The file will be created in the /db directory automatically when the first user is created.
   Each time the server starts, it loads the existing user data from users.json.
   The users.json file will be deleted when the server stops.
7. Testing the API
   You can use tools like Postman or curl to test the API endpoints. Here's how to test the API using Postman:

Create a User:

Select POST method and enter the URL http://localhost:4000/api/users.
In the body, select raw and set the type to JSON, then input the user data.
Get All Users:

Select GET method and enter the URL http://localhost:4000/api/users.
Get a User by ID:

Select GET method and enter the URL http://localhost:4000/api/users/{userId} (replace {userId} with the actual user ID).
Update a User:

Select PUT method and enter the URL http://localhost:4000/api/users/{userId}.
In the body, provide the updated user data in JSON format.
Delete a User:

Select DELETE method and enter the URL http://localhost:4000/api/users/{userId}.
