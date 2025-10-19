# CPAN212_MERN_Project - Ringo

## Overview
Ringo is a language learning web application that helps users learn Japanese through short, scenario-based lessons. Each lesson includes simple two-choice questions designed to simulate everyday conversations and real-life situations. As users complete lessons, their progress is automatically tracked and updated.  

## Tech Stack
- Node.js  
- Express.js  
- Express-Validator  
- RESTful API 
- JSON

## Setup and Run
### 1. Install dependencies 
```bash
npm install
```
### 2. Start the server
```bash
node server.js
```
### 3. Access in browser or API client
`http://localhost:3000/`

## Features Implemented
- Modular Express backend architecture with reusable models, routes, and middlewares
- User management:
  - Register new users
  - Login existing users
  - Update and delete users
- Lesson management:
  - View lessons by ID
  - Search lessons by keyword
  - Filter lessons by level
- Question management:
  - Get questions by lesson ID or question ID
  - Check answers
- Progress tracking:
  - Create new progress for new users
  - Update progress for existing users
- Validation and error handling:
  - express-validator rules for user, lesson, and progress inputs
  - 400 for validation errors, 404 for missing data, 500 for internal errors

## Tasks Completed
- Define data structures for all entities: Users, Lessons, Questions, and Progress
- Create JSON files and prepare sample data
- Apply modular architecture with separate folders for each module
- Add application-level middlewares in server.js:
  - express.json() for body parsing
  - 404 and 500 error-handling middlewares
- Create models for each module to manage data logic
- Implement READ/WRITE operations using file-utils.js
- Add independent routes for each module (users, lessons, questions, progress)
- Define validation rules using express-validator
- Add route-level middlewares for validation
- Handle proper HTTP status codes and JSON responses
- Test all endpoints using Postman
- Create README.md file