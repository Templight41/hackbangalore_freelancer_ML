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

function displayLanguageDistributionPerRepo(repositories) {
    console.log("Language Distribution per Repository:");
    const repoLanguages = repositories.map(repo => {
        const repoName = repo.name;
        const languages = repo.language ? repo.language : "Unknown";
        return { repoName, languages };
    })
    console.log(repoLanguages);
    return repoLanguages;
}


module.exports = async function (username, token) {
    const repositories = await getUserRepositories(username, token);
    return displayLanguageDistributionPerRepo(repositories);
};
