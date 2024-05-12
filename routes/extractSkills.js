require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// const description = "Need a django python developer with 6 years of experience and MySQL/postgresql/mongodb database experience of 3 years"

let count = 0;

module.exports = async function run(description) {
    count++;
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = `from this description extract the skills required for the job. The description is: ${description}. give it to me ONLY in a json format in the form {skills: [skill1, skill2, skill3, skill4]}.`

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text()
  // console.log(text);

  try {

    // Remove "```json" from the beginning
    let jsonString = text.slice(7);
  
    // Remove "```" from the end
    jsonString = jsonString.slice(0, -3);
  
    // Now you can parse jsonString to JSON object
    const jsonObject = JSON.parse(jsonString);
    console.log(count)
    console.log(jsonObject);
    count = 0;
    return jsonObject;
    
  }
  catch (error) {
    if(count <= 5) {
        run(description);
    }
    console.log("Error: ", error);
  }
}