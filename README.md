<div align="center">
  <img src="https://img.shields.io/badge/LIVE-pathfainder.vercel.app-6A0DAD?style=for-the-badge" alt="Live Site" />
  
  # PathfAInder

  ### AI-Powered Career Development Platform
  
<p>Your AI-powered assistant for career growth, offering advanced tools for resume building, interview preparation, and professional development</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=white)](https://cloud.google.com/vertex-ai)
  
  <br/>
  
  [🌐 Live Demo](https://pathfainder.vercel.app/) • 
  [💻 Repository](https://github.com/shibam-pandit/pathfainder) • 
  [📚 Documentation](#documentation) • 
  [🚀 Features](#-key-features)
</div>

---

## 🔍 Overview

**PathfAInder** is a comprehensive AI-powered platform designed to revolutionize career development. By leveraging Google's Gemini AI, it provides sophisticated tools for resume building, interview preparation, cover letter generation, and industry insights - all in one elegant, accessible interface.

<div align="center">
  <img src="https://img.shields.io/badge/Build-Passing-success?style=for-the-badge" alt="Build Status"/>
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License"/>
</div>

### Why PathfAInder?

- 🧠 **AI-Powered** - Intelligent suggestions tailored to your industry and experience
- 🔄 **Integrated Workflow** - Seamless transition between different career development tools
- 💼 **Industry-Specific** - Personalized insights based on your professional field
- 🚀 **Modern Interface** - Intuitive design with responsive controls and real-time feedback
- 📊 **Data-Driven** - Make informed career decisions based on current market trends

<details>
<summary><strong>Who is it for?</strong></summary>
<br>
PathfAInder serves professionals at all career stages:

- **Professionals** - Craft standout application materials and prepare effectively for interviews
- **Career Changers** - Understand skill gaps and industry requirements for new roles
- **Experienced Workers** - Stay current with industry trends and enhance career growth strategies
- **New Graduates** - Build professional materials and gain insights into your chosen field
</details>

<div align="center">
  <br/>
  <a href="https://pathfainder.vercel.app/">
    <img src="https://img.shields.io/badge/Try_PathfAInder_Today-6A0DAD?style=for-the-badge&logo=react&logoColor=white" alt="Try PathfAInder" height="40"/>
  </a>
  <br/><br/>
</div>

## ✨ Key Features

<table>
  <tr>
    <td>
      <h3>🔤 AI Resume Builder</h3>
      <ul>
        <li>Interactive form with step-by-step guidance</li>
        <li>Real-time AI suggestions for content improvement</li>
        <li>ATS compatibility scoring and optimization</li>
        <li>PDF format exports</li>
        <li>Customizable templates with live preview</li>
      </ul>
    </td>
    <td>
      <h3>📝 Cover Letter Generator</h3>
      <ul>
        <li>AI-driven personalization based on job descriptions</li>
        <li>Multiple writing styles and tones</li>
        <li>Editable markdown content with formatting controls</li>
        <li>One-click professional PDF downloads</li>
        <li>History tracking for all generated letters</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🎯 Resume Analyzer</h3>
      <ul>
        <li>ATS compatibility assessment</li>
        <li>Job description matching analysis</li>
        <li>Keyword optimization recommendations</li>
        <li>Visual impact scoring with improvement suggestions</li>
        <li>Detailed content feedback by section</li>
      </ul>
    </td>
    <td>
      <h3>🧠 Interview Preparation</h3>
      <ul>
        <li>AI-generated questions based on job descriptions</li>
        <li>Industry-specific mock interviews</li>
        <li>Performance analytics and progress tracking</li>
        <li>Detailed answer explanations</li>
        <li>Customizable practice sessions</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <h3>📈 Industry Insights</h3>
      <ul>
        <li>Real-time market trends and growth indicators</li>
        <li>In-demand skills analysis for your field</li>
        <li>Salary benchmarks and career path mapping</li>
        <li>Personalized skill development recommendations</li>
        <li>Industry outlook forecasting</li>
      </ul>
    </td>
  </tr>
</table>

## 🚀 Getting Started

### For Users

1. Visit [PathfAInder](https://pathfainder.vercel.app/)
2. Create an account or sign in
3. Complete the onboarding process (industry, skills, experience)
4. Access all features through the intuitive navigation menu

### For Developers

<details>
<summary><strong>Prerequisites</strong></summary>
<br>

- Node.js 18.0 or higher
- npm or yarn package manager
- Google AI API key (for Gemini integration)
- NextAuth secret (for authentication)
- [HTML to PDF microservice](https://github.com/shibam-pandit/HTML2PDF_microservice) (for resume PDF generation)
</details>

<details>
<summary><strong>Installation Steps</strong></summary>
<br>

```bash
# Clone the repository
git clone https://github.com/shibam-pandit/pathfainder.git

# Navigate to project directory
cd pathfainder

# Install dependencies
npm install

# Set up the PDF microservice
# Clone and set up the PDF microservice from:
# https://github.com/shibam-pandit/HTML2PDF_microservice
# Follow the installation guide in that repository

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application running locally.
</details>

<details>
<summary><strong>Environment Variables</strong></summary>
<br>

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
POSTGRES_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# Google AI API Configuration
GEMINI_API_KEY="your-google-ai-api-key"

# PDF Service Configuration
PDF_SERVICE_URL="http://localhost:4000"  # URL to PDF microservice (https://github.com/shibam-pandit/HTML2PDF_microservice)

# Scheduled Jobs Configuration
CRON_SECRET="your-secret-key-for-scheduled-cleanup-tasks"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

> Note: The `CRON_SECRET` is used by the GitHub Actions workflow for authenticating requests to the automated cleanup endpoint.
</details>

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15.2.4](https://nextjs.org/) with App Router
- **UI Library**: [React 19.0.0](https://react.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Markdown Editor**: [@uiw/react-markdown-editor](https://uiwjs.github.io/react-markdown-editor/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **API Routes**: Next.js API Routes
- **Authentication**: [NextAuth.js 4.24.11](https://next-auth.js.org/)
- **AI Integration**: [Google Generative AI](https://ai.google.dev/) (Gemini)
- **PDF Generation**: [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) (cover letters), [Dedicated microservice](https://github.com/shibam-pandit/HTML2PDF_microservice) using Puppeteer (resumes)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Development
- **Linting**: ESLint with Next.js config
- **Build Tool**: [Turbopack](https://turbo.build/pack) (Next.js 15)
- **Package Manager**: npm
- **CI/CD**: GitHub Actions for automated maintenance tasks

## 📡 API Documentation

PathfAInder provides a comprehensive set of API endpoints:

<details>
<summary><strong>Authentication</strong></summary>
<br>

```
GET/POST /api/auth/[...nextauth]  # NextAuth.js authentication handlers
```
</details>

<details>
<summary><strong>User Management</strong></summary>
<br>

```
GET  /api/users/onboarding-status  # Check user onboarding status
PUT  /api/users/onboarding-update  # Update user onboarding information
```
</details>

<details>
<summary><strong>Resume Builder</strong></summary>
<br>

```
GET/POST  /api/resume-builder            # Create or retrieve resume data
POST      /api/resume-builder/aiImprovedText  # Get AI suggestions for text
POST      /api/resume-builder/atsAnalysis     # Analyze resume for ATS compatibility
POST      /api/resume-builder/downloadPdf     # Generate and download PDF
POST      /api/resume-builder/saveMarkdown    # Save resume in markdown format
```
</details>

<details>
<summary><strong>Cover Letter</strong></summary>
<br>

```
POST  /api/cover-letter              # Generate a new cover letter
GET   /api/cover-letter/getHistory   # Get user's cover letter history
PUT   /api/cover-letter/updateContent  # Update existing cover letter
GET   /api/cleanup                   # Automated cover letter cleanup (triggered by GitHub Actions)
```

> Note: Cover letters are automatically deleted after 10 days via GitHub Actions scheduled workflow to maintain privacy and storage efficiency.
</details>

<details>
<summary><strong>Interview Preparation</strong></summary>
<br>

```
POST  /api/interview-prep/getQuestions  # Generate interview questions
POST  /api/interview-prep/submitQuiz    # Submit quiz answers
GET   /api/interview-prep/getHistory    # Get quiz history and performance
```
</details>

<details>
<summary><strong>Resume Analysis</strong></summary>
<br>

```
POST  /api/resume-analyze  # Analyze uploaded resume against job description
```
</details>

<details>
<summary><strong>Industry Insights</strong></summary>
<br>

```
GET  /api/industry-insights  # Get industry trends and data
```
</details>

## 📂 Project Structure

```
pathfainder/
├── .github/                      # GitHub specific files
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/                # Login page
│   │   └── register/             # Registration page
│   ├── (main)/                   # Main application routes
│   │   ├── home/                 # Dashboard/insights
│   │   ├── resume-builder/       # Resume creation
│   │   ├── resume-analyzer/      # Resume analysis
│   │   ├── cover-letter/         # Cover letter generator
│   │   └── interview-prep/       # Interview preparation
│   ├── api/                      # API routes
│   ├── providers/                # React context providers
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout
│   └── page.js                   # Landing page
├── components/                   # Reusable components
│   ├── ui/                       # UI primitives
│   ├── Navbar.jsx                # Navigation component
│   └── Footer.jsx                # Footer component
├── lib/                          # Utilities and services
│   ├── db/                       # Database connection
│   ├── services/                 # Business logic
│   └── utils.js                  # Helper functions
├── public/                       # Static assets
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── LICENSE                       # MIT License file
└── package.json                  # Dependencies
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help improve PathfAInder:

<details>
<summary><strong>Contribution Guidelines</strong></summary>
<br>

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests to ensure quality**:
   ```bash
   npm run test
   ```
5. **Commit your changes**:
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Follow the existing code style
- Write clear commit messages
- Add appropriate tests for new features
- Update documentation as needed
</details>

<details>
<summary><strong>Development Setup</strong></summary>
<br>

For local development:

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```
</details>

<details>
<summary><strong>Reporting Issues</strong></summary>
<br>

If you find a bug or have a feature request:

1. Check if the issue already exists in the [Issues](https://github.com/shibam-pandit/pathfainder/issues) section
2. If not, create a new issue with a descriptive title and detailed information
3. Include steps to reproduce, expected behavior, and actual behavior
4. Add relevant screenshots if applicable
</details>

## 📄 License & Acknowledgements

<details>
<summary><strong>License</strong></summary>
<br>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 PathfAInder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED.
```
</details>

<details>
<summary><strong>Acknowledgements</strong></summary>
<br>

- [Google Gemini AI](https://ai.google.dev/) for powering the intelligent features
- [Next.js](https://nextjs.org/) and [Vercel](https://vercel.com/) for the development framework and hosting
- [Tailwind CSS](https://tailwindcss.com/) for the UI styling system
- [Shadcn UI](https://ui.shadcn.com/) for accessible UI components
- All open source contributors who have helped improve this project
</details>

---

<div align="center">
  <p>
    <a href="https://pathfainder.vercel.app/">Website</a> •
    <a href="https://github.com/shibam-pandit/pathfainder">GitHub</a> •
    <a href="https://github.com/shibam-pandit/pathfainder/issues">Issues</a>
  </p>
  <p>© 2025 PathfAInder. All rights reserved.</p>
</div>