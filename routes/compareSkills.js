const { compareTwoStrings } = require('string-similarity'); // Install this package using npm install string-similarity

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

// Function to compare skills and return results with spelling error tolerance
module.exports = function compareSkillsWithSpellingErrors(inputData) {
    const results = [];
    inputData.client.forEach(client => {
        const clientSkills = client.skills.map(skill => skill.toLowerCase());
        const clientProjectDetails = {
            id: client.id,
            projectTitle: client.projectTitle,
            rate: client.rate
        };
        const matches = inputData.freelancer.map(freelancer => {
            const freelancerSkills = freelancer.skills.map(skill => skill.toLowerCase());
            const matchPercentage = calculateSimilarityWithSpellingErrors(clientSkills, freelancerSkills);
            return { freelancerId: freelancer.id, matchPercentage: matchPercentage };
        });
        results.push({ ...clientProjectDetails, ...matches[0] });
    });
    return results;
}

// Test the function
// module.exports = compareSkillsWithSpellingErrors(inputData);