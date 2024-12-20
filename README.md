# GroupTraveExpenseSplitter-Back-end
Back-end: 
Group Travel Expenses Splitter frontend: 
The App built as to help users enjoy their trips with family and friend without calculate the amount of money spent. Whether it's a weekend getaway, a family vacation, or a work trip, it's important to keep track of who paid for what and ensure that everyone contributes fairly.A Group Travel Expenses Splitter is a handy tool that helps simplify this process. It allows you to easily divide up costs, record who paid for each item, and calculate how much each person owes or is owed. This way, you can focus on enjoying your trip instead of stressing over finances!
 This is a back-end API for managing trips, including creating trips, adding participants, and managing bills associated with each trip.

Tech Used: 
* Node.js: JavaScript runtime for building the server-side application.
* Express:Web framework for Node.js to build the API.
* MongoDB: NoSQL database for storing trip, participant, and bill information.
* Mongoose:ODM (Object Data Modeling) library for MongoDB and Node.js
Prerequisites: 
* JWT Authentication (for user authentication and session management)
* MongoDB (locally or through MongoDB Atlas)
* Postman (optional for testing API endpoints)

Middleware
The  middleware folder contains custom middleware functions that are used to handle various tasks such as authentication, error handling, and data validation. These middleware are applied to specific routes or globally.

Models
The models folder contains Mongoose schemas that define the structure of the data stored in MongoDB. Each schema corresponds to a collection in the database. User.js: Defines the schema for user data, including email, password, and role.

Controllers
The controllers folder contains the logic for handling requests and interacting with the models. Each controller is responsible for managing a specific set of operations related to a resource (e.g., user authentication, trip management, participant management).  authController.js: Handles user login and registration. It validates input, creates new users, and generates JWT tokens for authenticated users.
