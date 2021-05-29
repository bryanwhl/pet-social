# Developer Guide

## Introduction

```
Pet Social
```

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
1. Open Visual Studio Code; you may download it from [here](https://code.visualstudio.com/) first.
1. On the terminal, run `npm install` for missing node modules.
1. In the root directory, run `npm run dev` to start the local development server. In the `/client` directory, run `npm start` to start the web app.

For readers who are not familiar with the commands of Pet Social, they can access the User Guide (Coming Soon).

<div style="page-break-after: always;"></div>

## Design

This section describes the architectural design of Pet Social, as well as the connections between them.
The overall tech stack of Pet Social is explained first, before diving into each of the architecture components.

### Tech Stack

Tech Stack here

### Frontend and User Interface

Frontend here

### Server

Server here

### Database

Database here

### Hosting

Hosting here

## Implementation

Implementation here

## Product scope

Product scope provides you an insight into the value of Pet Social, and its benefits for target users.

### Target user profile:

- Pet owners who:
  - want to interact with other pet users and pets
  - want to purchase items and services for their pets

### Value proposition

There is currently no easy way to do this besides meeting other pet owners from our own social circle. Furthermore, apart from Facebook groups, there are no centralised digital platforms for pet owners to interact, socialize or advise one another on pet ownership.

Pet Social will be the first to conceptualise such an application; one that connects pet owners nearby in ways that will enhance their experience as pet owners.

### User Stories

| Version | As a ...              | I want to ...                          | So that I can ...                           |
| ------- | --------------------- | -------------------------------------- | ------------------------------------------- |
| v1.0    | Pet Owner             | create an account                      | begin using the platform                    |
| v2.0    | Pet Owner             | form playgroups with fellow pet owners | our pets can play together                  |
| v3.0    | Pet Services Provider | join the platform                      | advertise and sell my products and services |

### Non-Functional Requirements

1. The application should work on any _mainstream_ browser (e.g. Chrome, Firefox, Edge)
1. The application should be responsive - users should be able to use the app with different devices and browser configurations.

<div style="page-break-after: always;"></div>

## Glossary

- _Playgroup_ - Groups where users may join to arrange or participate in meet ups.
- _IDE_ - Integrated development environment, software applications for software development
