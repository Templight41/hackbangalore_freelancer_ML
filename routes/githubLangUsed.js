const axios = require('axios');

async function getUserRepositories(username, token) {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
            headers: {
                Authorization: `token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user repositories:", error);
        return [];
    }
}

function calculateLanguageDistribution(repositories) {
    const languageCount = {};
    const totalRepos = repositories.length;

    repositories.forEach(repo => {
        const language = repo.language || 'Unknown';
        languageCount[language] = (languageCount[language] || 0) + 1;
    });

    const languagePercentage = {};
    for (const [language, count] of Object.entries(languageCount)) {
        languagePercentage[language] = (count / totalRepos) * 100;
    }
    return languagePercentage;
}

function displayLanguageDistribution(languageDistribution) {
    console.log("Language Distribution:");
    const LangUsed = [];
    for (const [language, percentage] of Object.entries(languageDistribution)) {
        // console.log(`${language}: ${percentage.toFixed(2)}%`);
        LangUsed.push({ language: language, percentage: percentage.toFixed(2) });
    }
    return LangUsed;
}



module.exports = async function (username, token) {
    const repositories = await getUserRepositories(username, token);
    const languageDistribution = calculateLanguageDistribution(repositories);
    return displayLanguageDistribution(languageDistribution);
};
