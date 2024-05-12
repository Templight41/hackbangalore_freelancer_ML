const { compareTwoStrings } = require('string-similarity'); // Install this package using npm install string-similarity
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

let count = 0;

// Function to calculate similarity between two arrays of skills considering spelling errors
function calculateSimilarityWithSpellingErrors(skillSet1, skillSet2) {
    let totalSimilarity = 0;
    skillSet1.forEach(skill1 => {
        const similarities = skillSet2.map(skill2 => compareTwoStrings(skill1.toLowerCase(), skill2.toLowerCase()));
        const maxSimilarity = Math.max(...similarities);
        totalSimilarity += maxSimilarity;
    });
    return (totalSimilarity / skillSet1.length) * 100;
}


module.exports = async function compareSkills(inputData) {
    count++;

    const model = genAI.getGenerativeModel({ model: "gemini-pro"});


    console.log(inputData)

    const prompt = `from this object ${JSON.stringify(inputData)} - extract the skills of the freelancer and compare with the skills of each skills in the gigs of clients. And also compare the project title, rates and description with the freelancer's role and rates depending on if the freelancer is worth working with the paygrade and amount of work with quality. If the freelancer has lesser skills than the gig, then the freelancer should have a lower match since there are missing skills. Also look out for abbreviations of words (for example - js for javascript) give me the result in terms of the percentage of similarity between the skills of the freelancer and the skills required by the clients in an array of objects in JSON format ONLY in the form {result: [{id: client_1, projectTitle: project_title, rate: rate, freelancerId: freelancer_id, matchPercentage: match_percentage}, {id: client_2, projectTitle: project_title, rate: rate, freelancerId: freelancer_id, matchPercentage: match_percentage}]}.`

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text()

    try {

        // Remove "```json" from the beginning
        let jsonString = text.slice(7);
      
        // Remove "```" from the end
        jsonString = jsonString.slice(0, -3);
      
        // Now you can parse jsonString to JSON object
        console.log(jsonString);
        const jsonObject = await JSON.parse(jsonString);
        console.log(count)
        // console.log(text)
        console.log(jsonObject);
        count = 0;
        return jsonObject;
        
    }
    catch (error) {
        console.log("Error: ", error);
        if(count <= 5) {
            await compareSkills(inputData);
        }
    }
}