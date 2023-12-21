# KindredApp
Kindred
Where Artists Connect and Create

Welcome to Kindred, an artist-friendly platform created as a safe space for users to share their artwork and engage in discussions on various art-related topics. With a deliberate avoidance of likes or popularity metrics, Kindred alleviates the apprehension artists often feel when sharing their work, welcoming art in any medium and aiming to create a diverse and inclusive community.

Technical Details
Kindred combines a powerful backend built with Flask and SQLAlchemy with a responsive front-end designed using React. The application leverages advanced features such as React Context for state management, React Router for navigation, Formik and Yup for form handling, Bcrypt for secure password handling, and .env for environment configuration. Additional functionalities include Snackbars for notifications, useOutletContext for component communication, CORS for resource sharing, and Session for maintaining user state.

New Feature: Cloudinary Integration
We've integrated Cloudinary API in our Upload feature, allowing users' artwork to be saved securely and efficiently in the cloud.

Installation and Setup
(Provide detailed steps here)

Starting the Application
To start Kindred:

Backend Setup:

Navigate to the backend directory: cd server
Install the necessary Python packages: pipenv install
Activate the virtual environment: pipenv shell
Set up the database: flask db upgrade
Start the Flask server: flask run

Frontend Setup:
Navigate to the frontend directory: cd client
Install the necessary Node packages: npm install
Start the React application: npm start
Access the application in your web browser at localhost:3000

Using the Application
(Description of how to use the app, register, post artwork, etc.)
//add more here

API Routes and Endpoints
(Description of API routes with methods, parameters, and responses)
//add more here

Database Models
(Descriptions of User, Artwork, DiscussionPost, Tag, Comment, ArtworkTag, PostTag models)
//add more here

Future Enhancements
We plan to introduce features like artist following, collaboration requests, messaging, and a monthly newsletter that highlights a charity.

