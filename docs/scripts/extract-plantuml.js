/**
 * PlantUML Extractor and Converter
 * 
 * This script extracts PlantUML code blocks from markdown files and converts
 * them to PNG images using the PlantUML server API.
 * 
 * Usage: node extract-plantuml.js <markdown-file> <output-folder>
 * Example: node extract-plantuml.js ../module-1/feature-1.1-1.3/documentation.md ../module-1/feature-1.1-1.3
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');

/**
 * Encodes PlantUML text to the format required by the PlantUML server.
 */
function encodePlantUML(text) {
  const deflated = zlib.deflateRawSync(Buffer.from(text, 'utf-8'));
  return encode64(deflated);
}

/**
 * Custom base64 encoding for PlantUML
 */
function encode64(data) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
  let result = '';
  
  for (let i = 0; i < data.length; i += 3) {
    const b1 = data[i];
    const b2 = i + 1 < data.length ? data[i + 1] : 0;
    const b3 = i + 2 < data.length ? data[i + 2] : 0;
    
    result += chars.charAt(b1 >> 2);
    result += chars.charAt(((b1 & 0x3) << 4) | (b2 >> 4));
    result += chars.charAt(((b2 & 0xF) << 2) | (b3 >> 6));
    result += chars.charAt(b3 & 0x3F);
  }
  
  return result;
}

/**
 * Downloads PNG from PlantUML server
 */
function downloadPNG(encodedText, outputPath) {
  return new Promise((resolve, reject) => {
    const url = `https://www.plantuml.com/plantuml/png/${encodedText}`;
    
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectResponse) => {
          const chunks = [];
          redirectResponse.on('data', chunk => chunks.push(chunk));
          redirectResponse.on('end', () => {
            fs.writeFileSync(outputPath, Buffer.concat(chunks));
            resolve();
          });
          redirectResponse.on('error', reject);
        }).on('error', reject);
        return;
      }
      
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        fs.writeFileSync(outputPath, Buffer.concat(chunks));
        resolve();
      });
      response.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Extracts PlantUML blocks from markdown content
 */
function extractPlantUMLBlocks(markdown) {
  const regex = /```plantuml\s*([\s\S]*?)```/g;
  const blocks = [];
  let match;
  
  while ((match = regex.exec(markdown)) !== null) {
    blocks.push(match[1].trim());
  }
  
  return blocks;
}

/**
 * Determines the diagram type from content
 */
function getDiagramType(content) {
  // Check for sequence diagram patterns
  if (content.includes('participant') && content.includes('->')) {
    return 'sequence';
  }
  
  // Check for use case diagram patterns
  if (content.includes('usecase') || (content.includes('actor') && content.includes('rectangle') && content.includes('-->'))) {
    return 'usecase';
  }
  
  // Check for ERD patterns
  if (content.includes('entity') && (content.includes('||--') || content.includes('|o--'))) {
    return 'erd';
  }
  
  // Check for component diagram patterns
  if (content.includes('package') && content.includes('[')) {
    return 'component';
  }
  
  // Check for activity diagram patterns
  if ((content.includes('start') && content.includes('stop')) || 
      (content.includes(':') && content.includes('if (') && content.includes('endif'))) {
    return 'activity';
  }
  
  return 'diagram';
}

/**
 * Generates filename with counter for duplicates
 */
function generateFilename(type, usedNames) {
  let name = type;
  let counter = 1;
  
  while (usedNames.has(name)) {
    name = `${type}-${counter}`;
    counter++;
  }
  
  usedNames.add(name);
  return name;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node extract-plantuml.js <markdown-file> <output-folder>');
    console.log('Example: node extract-plantuml.js ../module-1/feature-1.1-1.3/documentation.md ../module-1/feature-1.1-1.3');
    process.exit(1);
  }
  
  const markdownFile = path.resolve(__dirname, args[0]);
  const outputFolder = path.resolve(__dirname, args[1]);
  
  if (!fs.existsSync(markdownFile)) {
    console.error(`Error: File not found: ${markdownFile}`);
    process.exit(1);
  }
  
  const markdown = fs.readFileSync(markdownFile, 'utf-8');
  
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
    console.log(`Created folder: ${outputFolder}`);
  }
  
  const blocks = extractPlantUMLBlocks(markdown);
  console.log(`Found ${blocks.length} PlantUML diagrams`);
  
  if (blocks.length === 0) {
    console.log('No PlantUML diagrams found.');
    process.exit(0);
  }
  
  const usedNames = new Set();
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const type = getDiagramType(block);
    const filename = generateFilename(type, usedNames);
    const outputPath = path.join(outputFolder, `${filename}.png`);
    
    console.log(`Processing ${i + 1}/${blocks.length}: ${filename}.png`);
    
    try {
      const encoded = encodePlantUML(block);
      await downloadPNG(encoded, outputPath);
      console.log(`  ✓ Saved: ${filename}.png`);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\nDone!');
  console.log(`Images saved to: ${outputFolder}`);
}

main().catch(console.error);
