const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log('--- DEBUG START ---');

// 1. Where does Node.js think we are?
const currentDir = process.cwd();
console.log(`Current Working Directory: ${currentDir}`);

// 2. What files does Node.js actually see here?
console.log('Files in this folder:');
const files = fs.readdirSync(currentDir);
const envFiles = files.filter(f => f.startsWith('.env'));

if (envFiles.length === 0) {
    console.error('❌ CRITICAL ERROR: Node.js cannot see any .env file in this directory!');
} else {
    envFiles.forEach(f => {
        console.log(` - Found file: "${f}"`); 
        // Check if it is actually named .env.txt hiddenly
        if (f === '.env.txt') {
             console.error(`   ⚠️ WARNING: You have a file named ".env.txt". Windows is hiding the extension! Rename it to just ".env"`);
        }
    });
}

// 3. Try to force load the .env file
const envPath = path.join(currentDir, '.env');

if (fs.existsSync(envPath)) {
    console.log(`✅ .env file found at: ${envPath}`);
    
    // Read raw content to check for syntax errors/invisible characters
    const rawContent = fs.readFileSync(envPath, 'utf8');
    console.log('--- RAW CONTENT START ---');
    console.log(rawContent);
    console.log('--- RAW CONTENT END ---');

    // Parse it with dotenv
    const result = dotenv.config({ path: envPath });
    
    if (result.error) {
        console.error('❌ Dotenv failed to parse the file:', result.error);
    } else {
        console.log('✅ Dotenv parsed successfully!');
        console.log('Loaded keys:', Object.keys(result.parsed));
        
        // Check specific key
        if (process.env.AUTH_GITHUB_ID) {
            console.log(`✅ AUTH_GITHUB_ID is loaded: ${process.env.AUTH_GITHUB_ID}`);
        } else {
            console.error('❌ AUTH_GITHUB_ID is still undefined in process.env!');
        }
    }

} else {
    console.error('❌ fs.existsSync failed: Node says the file does not exist at that path.');
}

console.log('--- DEBUG END ---');