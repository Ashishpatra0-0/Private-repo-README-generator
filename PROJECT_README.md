# 📄 Private Repo README Generator

## 🚀Objective
This project generates a professional README.md file for both public and private GitHub repositories.
It uses the **GitHub REST API v3** to fetch repo data and the **Google Gemini 2.5 Flash API** to generate missing sections like features, usage, and installation.

---

## ✅ Features
- Supports public and private repositories
- Authentication with GitHub Personal Access Token (PAT)
- Securely fetches repo data from the GitHub API
- AI-powered README sections (Features, Installation, Usage, etc.) using Gemini 2.5 Flash
- Error handling for invalid repos, expired tokens, and missing data
- Protects against token leaks (no tokens logged in console)

---

## 🛠️ Tech Stack
- **Node.js**
- **Axios** - for API requests
- **dotenv** - for environment variable management
- **GitHub REST API** - REST API v3
- **Google Gemini API**

---

## ⚙️ Installation & Setup
1. Clone repository and install dependencies:
       ```bash
       git clone https://github.com/Ashishpatra0-0/Private-repo-README-generator.git ;
       cd Private-repo-README-generator ;
       npm install
       ```

3. Create a .env file in the root folder and add:
       ```env
       GEMINI_API_KEY=your_gemini_api_key_here ;
       GITHUB_TOKEN=your_github_token_here
       ```

---

## ▶️ Usage
   Run the script with owner and repo name, Example:
   For a public repository:
   ```bash
   node main.js facebook react
   ```

   For a private repository:
   ```bash
   node main.js your-username private-repo
   ```



