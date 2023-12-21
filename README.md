# KindredApp
Kindred
Where Artists Connect and Create

Welcome to Kindred, an artist-friendly platform created as a safe space for users to share their artwork and engage in discussions on various art-related topics. With a deliberate avoidance of likes or popularity metrics, Kindred alleviates the apprehension artists often feel when sharing their work, welcoming art in any medium and aiming to create a diverse and inclusive community.

Technical Details
Kindred combines a powerful backend built with Flask and SQLAlchemy with a responsive front-end designed using React. The application leverages advanced features such as React Context for state management, React Router for navigation, Formik and Yup for form handling, Bcrypt for secure password handling, and .env for environment configuration. Additional functionalities include Snackbars for notifications, useOutletContext for component communication, CORS for resource sharing, and Session for maintaining user state.

New Feature: Cloudinary Integration
We've integrated Cloudinary API in our Upload feature, allowing users' artwork to be saved securely and efficiently in the cloud.


Installation and Starting the Application
To start Kindred:
Fork and clone this repository and clone it to your local machine. The open it in your favorite code editor. 

Backend Setup:

Install Python Packages:
Navigate to the backend directory: cd server
Install the necessary Python packages: pipenv install
Activate the virtual environment: pipenv shell

Environment Configuration:
 Run 'touch .env' in the main directory to create a new '.env' file.
 Open the '.env' file and insert the following: 
   FLASK_RUN_PORT=5555
   APP_SECRET =
Enter Flask shell: 'flask shell'
Run 'import secrets' followed by 'secrets.token_hex(32)'. Copy the output code.
Paste the code after 'APP_SECRET=' in the .env file and exit the shell with Ctrl-D.

Database Setup:

Navigate to the server directory: 'cd server'
Run 'flask db init', 'flask db migrate -m "initial migration", and 'flask db upgrade' to create and configure the database.

Start the Backend Server:
Run 'python app.py' to start the Flask server

Frontend Setup:

Frontend Environment Configuration:

In a second terminal window, navigate to the client directory: 'cd client'.
Create a '.env' file in the client directory for Cloudinary configuration.
    'REACT_APP_CLOUDINARY_URL=your_cloudinary-url'
 Replace 'your_cloudinary_url' with your actual Cloudinary URL.
 
Install and Start Frontend:

Navigate to the frontend directory: cd client
Install the necessary Node packages: npm install
Start the React application: npm start
Access the application in your web browser at localhost:3000


Install and Start Frontend:

Navigate to the frontend directory: cd client
Install the necessary Node packages: npm install
Start the React application: npm start
Access the application in your web browser at localhost:3000

Using the Application

Initial Experiance and Home Page
  Landing on the Home Page: Upon opening Kindred, you are greeted with the home page showcasing artwork and discussion posts by other users.
  Exploring Content: Click on 'View One' to see individual discussion posts in detail. Navigate back to the home page to continue exploring.
  
Signing Up
  Registration Process: To interact further, sign up by providing an email, username, bio and password.
  Post-Registration: After signing up, you're directed to the upload page, where you can make your first post.
  
Making a Post
  Creating Art Posts: Choose Artwork to upload artwork. Fill in a title, select an image from your files and picking a tag.
  Creating Discussion Posts: Choose to make a discussion post by entering a title, body text and picking a tag.
  Post Submission: Upon submission, you'll be redirected to your profile, where you can view your posts and profile information.
  
Profile Management
  Profile Features: Change your password or delete your account from your profile page.
  Managing Own Content: On your profile, you have the option to edit or delete your artwork and discussion posts
  Navigating Back to Home: Click on the 'Kindred' name to return to the home page.
  
Additional Features
  About Page: Learn about Kindred's rules and the creators information on the About page.
  Search Functionality: Use the search bar to find users, artworks, and discussion posts by name or tag.
  Interacting with Posts: When logged in, comment on and delete your comments on discussion posts. 

//add loom video or pictures here!

API Routes and Endpoints
Kindred's API provided various endpoints to interact with the application:

  User Endpoints:
  - '/users':Retrieves a list of users
  - '/users/<int:user_id>': GET, PATCH or DELETE a specific user by ID
    
 Artwork Endpoints:
  -'/artworks': GET all artworks and POST new artwork by users
  -'/artworks/<int:artwork_id>': GET specific information about an artwork piece, PATCH update artwork details, DELETE remove an artwork form from platform

 Discussion Post Endpoints:
   -'/discussion-posts': GET all discussion posts made by users, POST new discussion post by users
   -'/discussion-posts/int:post_id>': GET specific discussion posts, PATCH edit title of discussion post, DELETE a discussion post
   
 Login/Logout Endpoints:
   -'/login': Handle user authentication for login
   -'/logout': Handle user logout
   
 Sign up Endpoint:
   -'/register': Allow new users to register on Kindred
   
 Comment Endpoints:
   -'/discussion-post/<int:post_id>/comments': GET all comments associated with specific discussion post, POST allow users to add a new comment 
   -'/comments/int:<int:comment_id>': DELETE a specific comment from a discussion post by the user who made the comment
   
 Tag Endpoints:
   -'/tags': GET list of tags available on Kindred each tag can be associated with artworks and discussion posts
   
 Search Endpoints:
   -'/search': Conducts a comprehensive search across the platform.
 
Database Models

  Kindred uses several models to manage its data:
  
  User: Manages user data including username, email, bio, artworks and discussion posts.
  Artwork: Represents artworks with titles, image URLS and associated tags
  Discussion Post: Handles discussion posts with titles, bodies and related comments
  Tag: Used for categorizing tags for filtering tags for artworks and discussion posts
  Comment: Manages comments on discussion posts
  Artwork Tag: An association table for Artwork and Tag for tag management
  Post Tag: An association table for Discussion Post and Tag for tag management

Future Enhancements

  We plan to introduce features like artist following, collaboration requests, messaging, and a monthly newsletter that highlights a charity.

Acknowledgments 

  This project was completed by me, Reilly Wentz, as a culmination of the skills I acquired from the Flatiron curriculum and my personal research. 
I would like to extend my deepest gratitude to my fellow cohort members for their support and camaraderie throughout this journey. A special thank you to my instructors Morgan Vanyperen and Matteo Piccini, for their invaluable guidance and patience in helping me troubleshoot and debug various challenges. Their expertise and encouragement were pivotal in the successful completion of Kindred and my time at Flatiron. 
