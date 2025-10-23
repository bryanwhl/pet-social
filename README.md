# Pet Social

A comprehensive social media platform designed specifically for pet owners to connect, share experiences, and organize meetups with fellow pet owners in a community-like setting.

## 🐾 About

Pet Social is a full-stack web application that serves as a social media platform for pet owners. It allows users to create profiles for their pets, share posts, connect with other pet owners, organize playgroups, and access pet-related services. Think of it as Facebook for pet owners!

## ✨ Features

### Social Features
- **User Authentication** - Secure login/signup with JWT tokens
- **Pet Profiles** - Create detailed profiles for your pets with photos and information
- **Posts & Feed** - Share photos, videos, and updates about your pets
- **Comments & Likes** - Interact with other users' content
- **Friend System** - Send/accept friend requests and build your pet owner network
- **Real-time Chat** - Direct messaging with other pet owners
- **Notifications** - Stay updated on likes, comments, and friend requests

### Community Features
- **Playgroups** - Organize and join local pet meetups
- **Interactive Maps** - Location-based features for finding nearby events
- **Pet Services** - Browse and book veterinary appointments and pet services
- **Shopping** - Pet accessories and products marketplace

### Technical Features
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Real-time Updates** - Live notifications and messaging using WebSocket subscriptions
- **Image Upload** - Upload and manage pet photos and videos
- **Advanced Search** - Find users, pets, and playgroups easily

## 🛠 Tech Stack

### Frontend
- **React** 17.0.2 - Modern JavaScript library for building user interfaces
- **Material-UI** 4.11.4 - React component library for consistent design
- **Apollo Client** 3.3.21 - GraphQL client for state management and API calls
- **React Router** 5.2.0 - Client-side routing for single-page application

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** 4.17.1 - Web application framework for Node.js
- **Apollo Server** 2.25.2 - GraphQL server implementation
- **GraphQL** 15.5.1 - Query language and runtime for APIs

### Database
- **MongoDB** 3.6.9 - NoSQL document database
- **Mongoose** 5.13.2 - Object Data Modeling (ODM) library for MongoDB

### Authentication & Security
- **JSON Web Tokens (JWT)** - Secure user authentication
- **bcrypt** 5.0.1 - Password hashing for secure storage
- **CORS** - Cross-Origin Resource Sharing configuration

### Real-time Features
- **GraphQL Subscriptions** - Real-time updates for chat and notifications
- **WebSocket** - Bidirectional communication for live features

### Additional Technologies
- **Google Maps API** - Location services for playgroups
- **File Upload** - Image and video handling with GraphQL Upload
- **Material-UI Pickers** - Date and time selection components

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (local installation or MongoDB Atlas account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bryanwhl/pet-social.git
   cd pet-social
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the `server` directory with the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/pet-social
   JWT_SECRET=your-secret-key-here
   ```

   For production, use MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pet-social
   JWT_SECRET=your-production-secret-key
   ```

### Running the Application

1. **Start the server** (from the root directory)
   ```bash
   npm run dev
   ```
   The GraphQL server will start on `http://localhost:4000`
   
   GraphQL Playground will be available at `http://localhost:4000/graphql`

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm start
   ```
   The React application will start on `http://localhost:3000`

3. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## 📱 Usage

### Getting Started with Pet Social

1. **Create an Account**
   - Sign up with your email, username, and basic information
   - Choose between regular user or business account types

2. **Set Up Your Profile**
   - Add a profile picture and bio
   - Configure your privacy and notification settings

3. **Add Your Pets**
   - Create profiles for each of your pets
   - Add photos, breed information, and other details
   - Invite other family members as co-owners

4. **Start Socializing**
   - Create posts about your pets with photos and videos
   - Like and comment on other users' posts
   - Send friend requests to connect with other pet owners

5. **Join or Create Playgroups**
   - Browse local pet meetups and events
   - Create your own playgroups for specific activities
   - Use the interactive map to find nearby events

6. **Explore Services**
   - Browse veterinary clinics and pet services
   - Book appointments directly through the platform
   - Shop for pet accessories and supplies

## 🧪 Testing

Run the test suite to ensure everything is working correctly:

```bash
# Run server tests
npm test

# Run client tests
cd client
npm test
```

## 📂 Project Structure

```
pet-social/
├── client/                 # React frontend application
│   ├── public/            # Static files and assets
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   │   ├── pages/     # Main page components
│   │   │   ├── posts/     # Post-related components
│   │   │   ├── profile/   # Profile components
│   │   │   ├── settings/  # Settings components
│   │   │   ├── signin/    # Authentication components
│   │   │   └── toolbar/   # Navigation components
│   │   ├── queries.js     # GraphQL queries and mutations
│   │   ├── utility.js     # Helper functions
│   │   └── App.js         # Main app component
│   └── package.json       # Client dependencies
├── server/                 # Node.js backend
│   ├── models/            # Mongoose data models
│   ├── public/            # Uploaded files and images
│   ├── schema.js          # GraphQL schema and resolvers
│   └── index.js           # Server entry point
├── __tests__/             # Test files
├── docs/                  # Documentation and guides
└── package.json           # Server dependencies
```

## 🔧 Configuration

### Database Schema

The application uses the following main data models:

- **User** - User accounts with authentication and profile information
- **Pet** - Pet profiles with details and ownership information
- **Post** - Social media posts with content and engagement data
- **Comment** - Comments on posts with threading support
- **FriendRequest** - Friend connection system
- **Chat** - Direct messaging between users
- **Message** - Individual chat messages
- **Playgroup** - Pet meetup events and groups
- **Notification** - Real-time notifications for user activities

### API Endpoints

The application uses GraphQL for all API operations:

- **Queries** - Data fetching operations (users, posts, pets, etc.)
- **Mutations** - Data modification operations (create, update, delete)
- **Subscriptions** - Real-time updates (new messages, notifications)

Access the GraphQL Playground at `http://localhost:4000/graphql` to explore the API schema and test queries.

## 🚀 Deployment

### Production Deployment

1. **Environment Variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   PORT=4000
   ```

2. **Build the client**
   ```bash
   cd client
   npm run build
   ```

3. **Deploy to your hosting platform**
   - Heroku, AWS, DigitalOcean, etc.
   - Ensure MongoDB is accessible from your production environment
   - Configure environment variables on your hosting platform

### Live Demo

🌐 **Current deployment**: [http://54.179.234.160/](http://54.179.234.160/)

**Demo Account:**
- Username: `admin`
- Password: `admin123`

Feel free to explore the features using this demo account!

## 📖 Documentation

For more detailed information, check out our comprehensive documentation:

- **[User Guide](https://bryanwhl.github.io/pet-social/UserGuide.html)** - How to use Pet Social
- **[Developer Guide](https://bryanwhl.github.io/pet-social/DeveloperGuide.html)** - Technical implementation details

## 🤝 Contributing

We welcome contributions to Pet Social! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Add comments for complex functionality
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Bryan Wong** - *Full-stack Developer* - [GitHub](https://github.com/bryanwhl)
- **Wang Zihan** - *Full-stack Developer*

## 🙏 Acknowledgments

- Material-UI team for the excellent React components
- Apollo team for the powerful GraphQL tools
- MongoDB team for the flexible database solution
- The React and Node.js communities for ongoing support

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/bryanwhl/pet-social/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Made with ❤️ for pet owners everywhere!** 🐕🐱

*Pet Social - Connecting pets and their humans, one wag at a time.*
