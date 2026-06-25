const path = require('path');

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const toolArgs = JSON.parse(Buffer.concat(chunks).toString());

  // readPath could be absolute or relative
  const readPath = toolArgs.tool_input?.file_path || toolArgs.tool_input?.path || "";

  // Extract just the filename (e.g., "/var/www/app/.env" becomes ".env")
  const fileName = path.basename(readPath);

  // This will also catch .env.local, .env.production, etc. if you want to be safe
  if (fileName === '.env' || fileName.startsWith('.env.')){
    // Outputting to stderr and exiting with 1 is what tells Claude to abort the tool
    console.error(`Security Hook: Blocked attempt to read ${fileName}`);
    process.exit(2); 
  }
}

main();