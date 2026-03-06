const fs = require('fs');
const path = require('path');
const directory = 'c:/Users/Hrithik/OneDrive/Desktop/projects/Ecommerce-Follow-Along/frontend/src';

const RENDER_BACKEND_URL = "https://ecommerce-follow-along-1-1fss.onrender.com";

function processFile(fullPath) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;

    // 1. Simplify previous messes: ${import.meta.env.VITE_BACKEND_URL || "any_url"} -> ${import.meta.env.VITE_BACKEND_URL || "RENDER_URL"}
    // This handles both single and nested cases because it replaces the whole ${...} block.
    // We use a regex that handles potential nesting by matching carefully.
    // Actually, a simple replacement of the whole block is easier.
    content = content.replace(/\$\{import\.meta\.env\.VITE_BACKEND_URL\s*\|\|\s*(`(\$\{.*?\}|.)*?`|'[^']*'|"[^"]*")\}/g,
        `${"$"}{import.meta.env.VITE_BACKEND_URL || "${RENDER_BACKEND_URL}"}`);

    // 2. Replace any leftover localhost literals
    content = content.replace(/http:\/\/localhost:3001/g, RENDER_BACKEND_URL);

    if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (file === 'node_modules') continue;
        if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
        else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) processFile(fullPath);
    }
}

walk(directory);
walk('c:/Users/Hrithik/OneDrive/Desktop/projects/Ecommerce-Follow-Along/frontend'); 
