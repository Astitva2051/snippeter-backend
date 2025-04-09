require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeAndOptimizeCode = async (code) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `Analyze the following code:  
 ${code}  

Provide the following details in JSON format without any explanation:  
- Optimized version of the code (as a single string but format code in multiple lines so that it is readable). JSON Key: optimisedCode
- Original code time complexity (only the complexity, no explanation). JSON Key: originalTimeComplexity
- Original code space complexity (only the complexity, no explanation).  JSON Key: originalSpaceComplexity
- Optimized code time complexity (only the complexity, no explanation).  JSON Key: optimisedTimeComplexity
- Optimized code space complexity (only the complexity, no explanation).  JSON Key: optimisedSpaceComplexity
- Tags based on the functionality of the code(only tags in array form). JSON Key: suggestedTags:
- Reason why this is optimized code (in 1-2 line). JSON Key: reason`;

  const result = await model.generateContent(prompt);

  let jsonString = result.response.text().trim(); // Trim extra spaces
  if (jsonString.startsWith("```")) {
    jsonString = jsonString.replace(/```json|```/g, "").trim(); // Remove backticks
  }

  return jsonString;
};

const getComplexity = async (code) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analyze the following code:  
    ${code}  

    Provide the following details in JSON format without any explanation:  
    - Original code time complexity (only the complexity, no explanation). JSON Key: timeComplexity
    - Original code space complexity (only the complexity, no explanation).  JSON Key: spaceComplexity`;

    const result = await model.generateContent(prompt);

    let jsonString = result.response.text().trim(); // Trim extra spaces
    if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/```json|```/g, "").trim(); // Remove backticks
    }

    return jsonString;
  } catch (error) {
    console.error("AI Search Error:", error);
    return [];
  }
};

module.exports = { analyzeAndOptimizeCode, getComplexity };
