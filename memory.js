const fs = require('fs');
const knowledgeFilePath = './business_knowledge.json';

async function loadKnowledge() {
    try {
      if (fs.existsSync(knowledgeFilePath)) {
        const data = fs.readFileSync(knowledgeFilePath, 'utf8');
        return JSON.parse(data); // Convertir el contenido a un objeto
      } else {
        console.log("El archivo JSON no existe. Creando uno nuevo...");
        fs.writeFileSync(knowledgeFilePath, JSON.stringify({}, null, 2), 'utf8');
        return {}; // Si no existe, devolver un objeto vacío
      }
    } catch (error) {
      console.error("Error al cargar el archivo JSON:", error.message);
      return {};
    }
}
  
async function updateMemory(userInput, assistantResponse) {
    // Cargar el archivo JSON
    const knowledge = await loadKnowledge();
  
    // Asegurarse de que la sección de memoria exista
    if (!knowledge.memory) {
      knowledge.memory = {
        user_preferences: {},
        recent_conversations: []
      };
    }
  
    // Agregar la conversación reciente
    knowledge.memory.recent_conversations.push({
      user: userInput,
      assistant: assistantResponse,
      timestamp: new Date().toISOString()
    });
  
    // Mantener solo las últimas 5 conversaciones
    if (knowledge.memory.recent_conversations.length > 5) {
      knowledge.memory.recent_conversations.shift();
    }
  
    // Guardar los datos actualizados en el archivo JSON
    saveKnowledge(knowledge);
}
  
async function saveKnowledge(data) {
    try {
      fs.writeFileSync(knowledgeFilePath, JSON.stringify(data, null, 2), 'utf8');
      console.log("Datos guardados correctamente en el archivo JSON.");
    } catch (error) {
      console.error("Error al guardar los datos en el archivo JSON:", error.message);
    }
}

module.exports = {loadKnowledge, saveKnowledge, updateMemory};
