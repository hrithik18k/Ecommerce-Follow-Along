const fs = require('fs');
const path = require('path');
const directory = 'c:/Users/Hrithik/OneDrive/Desktop/projects/Ecommerce-Follow-Along/frontend/src';

function processFile(fullPath) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('http://localhost:3001')) {
        // Only replace if it doesn't already have import.meta.env
        if (content.includes('import.meta.env.VITE_BACKEND_URL')) return;

        // Replace strings with backticks if they are currently single/double quotes
        let newContent = content.replace(/'http:\/\/localhost:3001([^']*)'/g, '`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}$1`');
        newContent = newContent.replace(/"http:\/\/localhost:3001([^"]*)"/g, '`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}$1`');
        // Handle existing template literals (already in backticks)
        // Check for `http://localhost:3001...` when they are inside template literal but not using env.
        // Match: ` followed by http://localhost:3001
        newContent = newContent.replace(/`http:\/\/localhost:3001/g, '`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}');

        fs.writeFileSync(fullPath, newContent);
        console.log(`Refactored ${fullPath}`);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
        else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) processFile(fullPath);
    }
}

walk(directory);
walk('c:/Users/Hrithik/OneDrive/Desktop/projects/Ecommerce-Follow-Along/frontend'); 
