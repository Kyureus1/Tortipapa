const { google } = require('googleapis');
const fs = require('fs');
const fetchTrends = require("./gpt_research.js");
const { Document, Packer, Paragraph } = require('docx');
const {loadKnowledge, saveKnowledge, updateMemory} = require("./memory.js");

// Path to your service account key file
//const keyFilePath = './credentials.json';

// Authenticate with Google API
/* const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/drive'],
});
 */
// Initialize the Drive API
/* const drive = google.drive({ version: 'v3', auth }); */
//async function saveToWord(content, filePath) {
  //const cleanedContent = content.replace(/\*\*/g, '');
  /*const paragraphs = cleanedContent.split('\n').map((line) => new Paragraph(line.trim()));
  const doc = new Document ({
    sections: [
      {
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);
  console.log(`file saved as ${filePath}`);
  return filePath;
}*/

/* async function uploadFile(filePath, fileName, folderId = null) {
  try {
    // File metadata
    const folderId = '1QH0aa9-p6-wauTiUqMzmUOh9trGmr2Zy'; // Replace with your Google Drive folder ID
    const fileMetadata = {
      name: fileName,
      ...(folderId && {parents: [folderId]}),
    };

    // File content
    const media = {
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      body: fs.createReadStream(filePath), // Path to your local file
    };

    // Upload the file
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log(`File uploaded successfully with ID: ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
} */

async function main() {
  try{
    const folderId = '1QH0aa9-p6-wauTiUqMzmUOh9trGmr2Zy';
    const prompt = "who is Eduardo?"
    const gptResearch  = await fetchTrends(prompt);
    await updateMemory(prompt, gptResearch);
    console.log("GPT Research Result:", gptResearch);

    const title = prompt.split(':')[0].trim();
    const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${safeTitle}.docx`;

    /* const filePath = `./${fileName}`;
    await saveToWord(gptResearch, filePath);
    await uploadFile(filePath, fileName, folderId); */
  }
  catch (error) {
    console.error('error in main process:', error.message);
  }
}

module.exports = updateMemory;
main();