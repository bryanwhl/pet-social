# Pet Social Developer Guide

![Pet Social](uml/BannerRounded.png)

## Introduction

Pet Social is a web app that will serve as a social media for pet owners, as well as a platform for services like booking Vet appointments and Shopping for pet accessories.

### About this Developer Guide

This developer guide details how Pet Social is designed, implemented and tested.
Readers can find out more about the overall architecture of Pet Social, and also the implementation
behind various functionalities. Technically inclined readers may wish to use the developer guide and
further implement features or customise Pet Social for their own use!

### How to use the Developer Guide

The Developer Guide has been split into clear sections to allow readers to quickly navigate to their desired
information.

- You may navigate to any section from the [Table of contents](#table-of-contents).
- Click [here](#setting-up) for the Setting Up section and get started as a developer!
- Alternatively, if you wish to dive right into Pet Social's implementation,
  we would recommend starting in the [Design](#design) section.

<div style="page-break-after: always;"></div>

## Table of contents

- [Setting Up](#setting-up)
- [Design](#design)
  - [Tech Stack](#tech-stack)
  - [Frontend and User Interface](#frontend-and-user-interface)
  - [Server](#server)
  - [Database](#database)
  - [Hosting](#hosting)
- [Implementation](#implementation)
  - [Sign Up and Password Encryption](#sign-up-and-password-encryption)
  - [Sign In and Token Authentication](#sign-in-and-token-authentication)
  - [Arrange Playgroup Meetup](#arrange-playgroup-meetup)
- [Testing](#testing)
- [Product scope](#product-scope)
  - [Target user profile](#target-user-profile)
  - [Value proposition](#value-proposition)
  - [User stories](#user-stories)
  - [Non-functional requirements](#non-functional-requirements)
- [Glossary](#glossary)

<div style="page-break-after: always;"></div>

## Setting Up

You may follow this Setting Up guide and get started as a developer! This guide helps you import and set up the development environment for Pet Social onto Visual Studio Code,
but feel free to use your preferred IDE.

1. Ensure you have React and NodeJS installed on your computer.
1. Fork the Pet Social repository from [here](https://github.com/bryanwhl/pet-social).
1. Clone your fork to your local machine, using the Git software you prefer.
1. Open Visual Studio Code; you may download it from [here](https://code.visualstudio.com/). (Or your preferred IDE)
1. On the terminal, run `npm install` for missing node modules.
1. On the terminal, in the root directory, run `npm run dev` to start the local development server. In the `/client` directory, run `npm start` to start the web app.

Note that API and encryption keys are not hosted on GitHub, hence you will require your own keys in a `.env` file.

For readers who are not familiar with the commands of Pet Social, they can access the User Guide (Coming Soon).

<div style="page-break-after: always;"></div>

## Design

This section describes the architectural design of Pet Social, as well as the connections between them.
The overall tech stack of Pet Social is explained first, before diving into each of the architecture components.

### Tech Stack

Pet Social is built using the follow technology:

**JavaScript** <br />
JavaScript is the default language for programming web applications. Pet Social uses JavaScript libraries for both the frontend and backend of the program.

**Node.js**<br />
Node.js is a server-side runtime environment that helps to ease the job of developing applications in JavaScript. Pet Social uses Node.js and its in-built package manager, Node Package Manager (npm), extensively to increase development efficiency.

**React**<br />
React is a modern JavaScript library used for building user interfaces. Applications built with React are single-page applications that works inside a browser and does not require page reloading during use. We chose react for the ease of development that it provides for us. We also chose to use the Material-UI framework which contains pre-built react components based on Google's material design.

**Express.js**<br />
Express.js is a Node.js framework that handles the backend of the application. It is used to ease the development of our backend system.

**GraphQL**<br />
Pet Social uses GraphQL to define our backend APIs. GraphQL is chosen for its efficiency in dealing with large amounts of data. GraphQL is also optimized for querying as only a single request is needed to retrieve all the information we need.

**Apollo Client**<br />
Apollo Client is a comprehensive state management library for JavaScript that enables us to manage both local and remote data with GraphQL. Apollo Client greatly eases the development process for writing and handling of GraphQL APIs.

**MongoDB**<br />
To complete our application, MongoDB is the database that we've chosen due to its NoSQL property. Upon research, MongoDB is a better choice than SQL languages due to its faster querying times for social media features like retrieving posts, friends, comments etc.

### Frontend and User Interface

The diagram below shows the component tree of our React frontend application. These components come together to provide a smooth application interface for users to use our application at ease.

![React Components](uml/ReactComponents.png)

Many of the components are made from sub-components taken from the Material-UI library. These components are made from Google's material design, with visuals and experiences that epitomizes modern web applications.

### Server

We implemented our server using Express.js as a router and GraphQL with Apollo client as the query language to handle queries between the front and back end.

Express is used as a router as middleware that defines the application's endpoints and corresponds to HTTP methods.

GraphQL was chosen over the 'standard' REST API as data can be gathered more precisely using a single query, instead of accessing multiple endpoints. This would minimise overfetching of data.

Apollo Client organises and simplifies the implementation of GraphQL by tracking the schema in a central registry and combining APIs, databases and microservices into a single data graph that can be queried with GraphQL.

You may use _GraphQL Playground_ to make queries to the server by adding `/graphql` to the end of the web address.

### Database

All data except for media (pictures and videos) are stored on a MongoDB Atlas cloud database. The `mongoose` node package is used to model the application data and simplifies interactions with the database. The data model follows the data schema used by the server.

This diagram shows our data schema with connections shown explicitly.

![Data Schema Explicit](uml/DataSchemaExplicitConnections.png)

This diagram shows our data schema without connections shown explicitly.

![Data Schema](uml/DataSchema.png)

### Hosting

Pet Social is being hosted on Amazon Web Services. It is hosted on an EC2 instance with the repository being housed on Amazon Web Services' Ubuntu Server. The backend of Pet Social is hosted using the pm2 package. All images are hosted on the /images route that is being run as a static folder.

## Implementation

This subsection provides sequence and activity diagrams detailing the workflows for more complicated processes in Pet Social.

### Sign Up and Password Encryption

When the user signs up for a new account, a validity check is done to ensure a unique email and username are used.

Subsequently, the password is encrypted using the password-hashing function `bcrypt`. It is hashed through a predetermined number of "salt rounds" or cost factors. A higher cost factor uses more time to calculate a single `bcrypt` hash but makes the encrypted password more difficult to brute-force. 10 salt rounds were chosen to balance speed and security.

This encrypted password is sent and stored on the database.

### Sign In and Token Authentication

This sequence diagrams shows the execution flow of the program when a user signs in to the app.

![Token Authentication](uml/TokenAuthentication.png)

Every time a user logs in, a token will be generated and saved to the browser's `sessionStorage`. Each query for `currentUserQuery` will verify the validity of this token. If the token is invalidated or deleted, the user would be logged out.

If 'Remember Me' is selected during sign in, the token will be saved to the browser's `localStorage`. Upon reloading the application, this token will be retrieved and verified for automatic sign in. If no valid token is present, the original sign in screen is rendered. `localStorage` is cleared when the user logs out.

### Arrange Playgroup Meetup

![Playgroup Meetup](uml/PlaygroupMeetupActivity.png)

Playgroup Meetups can be suggested on the Playgroup. Upon agreement among the members, the meetup date is set. Else, new dates are suggested.

## Testing

Our application follows the Model-View-Controller(MVC) model. The model being the MongoDB Database, the view being the User Interface, and the controller being the frontend logic with React states and backend logic with Apollo Client and mongoose.

We divided our testing into two: Model and Controller Testing, as well as View testing.

Model/Controller Testing is done with mock data and unit tests on our database to test application logic and flow.

View testing is done with user interaction, gathering feedback on UI usability and functionality.

## Product scope

Product scope provides you an insight into the value of Pet Social, and its benefits for target users.

### Target user profile:

- Pet owners who:

  - want to interact with other pet users and pets
  - want to arrange meetups with other pet owners
  - want to purchase items and services for their pets

- Business owners who:
  - want to advertise their products or services to pet owners
  - want to sell their products or services to pet owners

### Value proposition

There is currently no easy way to do this besides meeting other pet owners from our own social circle. Apart from Facebook groups, there are no centralised digital platforms for pet owners to interact, socialise or advise each other on pet ownership.

Pet Social will be the first to implement such an application; one that connects pet owners and that enhances their experience as pet owners.

### User Stories

| Version | As a ...              | I want to ...                                      | So that I can ...                                    |
| ------- | --------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| v1.0    | Pet Social User       | create a personal or business account              | begin using the platform                             |
| v1.0    | Pet Social User       | delete my account                                  | remove my data if I no longer use the platform       |
| v1.0    | Pet Social User       | post photos                                        | share my experiences and memories with my pets       |
| v1.0    | Pet Social User       | comment on posts                                   | reply to posts that I enjoy                          |
| v2.0    | Pet Owner             | add other users as friends                         | connect more easily with each other on the platform  |
| v2.0    | Pet Social User       | chat with other users on the platform              | easily communicate without leaving Pet Social        |
| v2.0    | Pet Social User       | view notifications                                 | quickly see events pertaining to me                  |
| v2.0    | Pet Owner             | form playgroups with fellow pet owners             | our pets can play together                           |
| v3.0    | Pet Services Provider | join the platform                                  | advertise and sell my products and services          |
| v3.0    | Pet Services Provider | advertise my products and services                 | I can market my products to bigger audiences         |
| v3.0    | Pet Social User       | adjust UI settings such as font size and dark mode | configure my experience to my preferences            |
| v3.0    | Pet owner             | have friend suggestions                            | connect with others who have similar interests as me |

### Non-Functional Requirements

1. The application should work on any _mainstream_ browser (e.g. Chrome, Firefox, Edge)
1. The application should be responsive - users should be able to use the app with different devices and browser configurations.

<div style="page-break-after: always;"></div>

## Glossary

- _Playgroup_ - Groups where users may join to arrange or participate in meet ups.
- _IDE_ - Integrated development environment, software applications for software development
