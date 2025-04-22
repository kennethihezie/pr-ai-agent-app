# 🔍 AI Pull Request Analyzer

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-required-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An intelligent web application that leverages AI to analyze GitHub pull requests, helping developers and teams gain faster, deeper insights into code changes. Built with a secure authentication system and optimized for performance using Redis caching.

## 📋 Table of Contents

- [Requirements](#-requirements)
- [Setup Instructions](#-setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage Guide](#-usage-guide)
- [Architecture Overview](#-architecture-overview)
- [Methodology](#-methodology)
- [Design Decisions & Trade-offs](#-design-decisions--trade-offs)
- [Limitations & Potential Improvements](#-limitations--potential-improvements)
- [Key Features](#-key-features)
- [Notable Innovations](#-notable-innovations)

## 🧱 Requirements

- Node.js (v18 or above)
- Docker & Docker Compose
- Yarn (v1 or v3)
- GitHub Access Token (for PR analysis)
- AWS credentials (for Bedrock integration)

## ⚙️ Setup Instructions

### AWS setup

1. Create a free tier account on aws.

2. Create an IAM user and attach a custom policy to InvokeModel.

3. Navigate to Aws bedrock and request access to claude 3.5 haiku model

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file using the template below:
   ```
   APP_DISPLAY_NAME="PR AI AGENT"
   APP_PORT=3001
   APP_EN=local
   APP_API_VERSION=1.0.0

   AWS_ACCESS_KEY=
   AWS_SECRET_KEY=
   AWS_REGION=
   AWS_CLAUDE_AI_ARN=

   JWT_SECRET=
   JWT_REFRESH_SECRET = 

   JWT_EXPIRY_TIME=20m 
   JWT_REFRESH_TOKEN_EXPIRY_TIME=2d

   DB_NAME=
   DB_USER_NAME=
   DB_PASS=
   DB_URL=

   REDIS_HOST=redis
   REDIS_PORT=6379
   REDIS_TTL=1440

   GITHUB_BASE_URL=https://api.github.com/repos

   PRIVATE_KEY=
   PUBLIC_KEY=
   ```

4. Start the application using Docker Compose:
   ```bash
   docker compose up
   ```

5. The backend will be accessible at:
   - API: http://localhost:3001/api/v1
   - API Documentation: http://localhost:3001/docs

6. Signup by providing:
   - Username
   - Password
   - GitHub access token

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

4. The frontend will be accessible at http://localhost:3000

## 📸 Usage Guide

1. **Sign Up / Login**
   - Create an account or log in to access PR analysis features

2. **Provide a GitHub Pull Request URL**
   - Example: `https://github.com/owner/repo/pull/42`

3. **Choose Analysis Options**
   - Commit Summary
   - Code Quality Review
   - Change Impact Estimate

4. **View Results**
   - The AI will analyze the PR using AWS Bedrock and return structured insights

## 🧠 Architecture Overview

```
 ┌──────────────┐
 │   Frontend   │
 │ (React/Next) │
 └──────┬───────┘
        │
        ▼
 ┌──────────────────────┐       ┌────────────┐
 │      NestJS API      │◄─────►│   Redis     │
 │ ─ Auth (JWT)         │       │  (Cache)   │
 │ ─ PR Analysis Logic  │       └────────────┘
 │ ─ GitHub API Client  │
 │ ─ AWS Bedrock Client │
 └──────┬───────────────┘
        │
        ▼
  ┌──────────────┐
  │  AWS Bedrock │ (LLM for PR analysis)
  └──────────────┘
```

## 🧪 Methodology

- Built secure APIs with NestJS and JWT Authentication
- Integrated Redis to cache PR analysis results and avoid redundant requests
- Offloaded heavy analysis logic to AWS Bedrock for language model processing
- Ensured modular architecture for scalability and maintainability
- Encrypted GitHub access key before storing in the database

## ⚖️ Design Decisions & Trade-offs

### ✅ Decisions
- **JWT Auth**: Used to secure access to PR analysis endpoints
- **Redis**: Chosen for its speed and simplicity in caching API responses
- **Modular Service Layer**: Encourages better separation of concerns and future scaling

### ⚠️ Trade-offs
- **Redis as cache only**: For simplicity, persistent caching isn't implemented
- **PR URL parsing**: Basic parsing—may require validation improvements for edge cases

## 🚧 Limitations & Potential Improvements

- **Rate limits**: GitHub API rate limits can still impact frequent usage
- **Bedrock dependency**: The LLM integration assumes AWS availability and keys
- **Parameter configuration**: Though this was designed in the api endpoint but was not implemented in the frontend
- **Future improvements**: 
  - Support for additional code hosting platforms (GitLab, Bitbucket)
  - Enhanced analysis capabilities (security scanning, performance impact)
  - User preference settings for customized analysis

## ✨ Key Features

- 🔐 **User Authentication** – Sign Up / Login with secure JWT token handling
- ⚡ **AI-powered PR Analysis** – Summarizes commits, highlights issues, and offers insight
- 🔄 **Redis Caching** – Minimizes redundant API calls and improves performance

## 💡 Notable Innovations

- Combines LLMs + GitHub API for contextual code review automation
- Dynamic analysis options for customized PR insights
- Optimized response times via smart caching logic

---

This application is ideal for teams looking to augment code review workflows with AI. With a solid foundation built on scalable architecture, there's plenty of room to expand — from custom prompt tuning to deeper repo analysis.