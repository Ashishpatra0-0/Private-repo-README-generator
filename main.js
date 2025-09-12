const axios = require('axios')
const fs = require("fs")
require('dotenv').config();
const API_KEY = process.env.GEMINI_API_KEY;
const user = process.argv[2]
const repo = process.argv[3]

if (!user || !repo) {
    console.log("Please provide owner and repo name, e.g., node main.js facebook react");
    process.exit(1);
}

function FETCHrepoDATA(user, repo) {
    return new Promise(async (resolve, reject) => {
        try {
            const URL = `https://api.github.com/repos/${user}/${repo}`
            const headers = { "Accept": "application/vnd.github.v3+json" };
            if (process.env.GITHUB_TOKEN) {
                headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
            }
            const response = await axios.get(URL, { headers });
            resolve(response.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    reject(new Error(" Unauthorized: Invalid or missing GitHub token."));
                } else if (error.response.status === 403) {
                    reject(new Error(" Forbidden: Token does not have required permissions (maybe missing 'repo' scope)."));
                } else if (error.response.status === 404) {
                    reject(new Error(" Repository not found. Check owner/repo name or token access."));
                } else {
                    reject(new Error(`GitHub API Error: ${error.response.status} ${error.response.statusText}`));
                }
            } else {
                reject(error);
            }
        }
    })
}

function generateREADME(data) {
    return `
 #${data.name}
 
 ##${data.description}
 
 ##Installation
 '''bash
 git clone ${data.clone_url}
 cd repo
 npm install
 '''
 ##Tech Stack
 Main Language :${data.language}
 
 ##License Information
 ${data.license ? data.license.name : "No license"}`

}

async function READMEGEMINI(data) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
    const task = ` Create a professional README.md for a GitHub project.
        Repo Name: ${data.name}
        Description: ${data.description || "No description"}
        Main Language: ${data.language || "Not specified"}
        License: ${data.license ? data.license.name : "No license"}
        Clone URL: ${data.clone_url}

        Include sections: 
        1. Project Title
        2. Description
        3. Features
        4. Installation Guide (with bash code)
        5. Usage
        6. Tech Stack
        7. License Information
        `
    try {
        const response = await axios.post(endpoint, { contents: [{ parts: [{ text: task }] }] });
        const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
        return result || null

    } catch (error) {
        console.log("GEMINI API ERROR:", error.message)
        return null

    }
}

FETCHrepoDATA(user, repo)
    .then(async (data) => {
        const GEMINIextraText = await READMEGEMINI(data)
        const readme = generateREADME(data) + (GEMINIextraText ? `\n\n***\n\n${GEMINIextraText}`: "")
        fs.writeFileSync("README.md", readme)
        console.log("README.md File generated...")
    })
    .catch((error) => {
        if (error.response && error.response.status === 404) {
            console.log("Repository not found")

        } else {
            console.error(error)
        }
    })

