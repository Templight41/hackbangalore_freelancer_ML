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

async function getFrameworksUsed(repoName, token) {
    try {
        const response = await axios.get(`https://api.github.com/repos/${repoName}/contents`, {
            headers: {
                Authorization: `token ${token}`
            }
        });
        const contents = response.data;
        const frameworks = [];

        // Check for common framework files or directories
        const frameworkIndicators = {
            'Gemfile': 'Ruby on Rails',
            'requirements.txt': 'Django',
            'composer.json': 'Laravel',
            'package.json': 'Node.js',
            'angular.json': 'Angular',
            'pom.xml': 'Spring Boot',
            'build.gradle': 'Spring Boot (Gradle)',
            'Dockerfile': 'Docker',
            'android/build.gradle': 'Android (Gradle)',
            'ios/Podfile': 'iOS (CocoaPods)',
            'pubspec.yaml': 'Flutter',
            'webpack.config.js': 'Webpack',
            '.travis.yml': 'Travis CI',
            '.circleci/config.yml': 'CircleCI',
            '.github/workflows/': 'GitHub Actions',
            'Jenkinsfile': 'Jenkins',
            // Add more indicators for other frameworks as needed
        };

        for (const item of contents) {
            const fileName = item.name;
            if (fileName in frameworkIndicators) {
                frameworks.push(frameworkIndicators[fileName]);
            } else if (fileName.startsWith('README') || fileName.endsWith('.md')) {
                // Check README files for framework mentions
                const fileContent = await getFileContent(`${repoName}/${fileName}`, token);
                if (fileContent) {
                    const matches = fileContent.match(/(express|nestjs|flask|fastapi|koa|ruby\s*on\s*rails|django|laravel|spring\s*boot|angular|react|vue|docker|android|ios|flutter|webpack|travis\s*ci|circleci|github\s*actions|jenkins)/gi);
                    if (matches) {
                        frameworks.push(...matches.map(match => match.trim()));
                    }
                }
            }
        }
        return frameworks;
    } catch (error) {
        // console.error(`Error fetching repository contents for ${repoName}:`, error);
        return [];
    }
}

async function getFileContent(filePath, token) {
    try {
        const response = await axios.get(`https://api.github.com/repos/${filePath}`, {
            headers: {
                Authorization: `token ${token}`
            }
        });
        return Buffer.from(response.data.content, 'base64').toString();
    } catch (error) {
        // console.error(`Error fetching file content for ${filePath}:`, error);
        return null;
    }
}

async function displayFrameworksUsed(username, token) {
    const repositories = await getUserRepositories(username, token);
    const frameworksUsed = [];
    for (const repo of repositories) {
        const frameworks = await getFrameworksUsed(`${username}/${repo.name}`, token);
        frameworksUsed.push({ repo: repo.name, frameworks: frameworks.length > 0 ? [...new Set(frameworks)] : ['No frameworks detected'] });
    }
    console.log(frameworksUsed)
    return frameworksUsed;
}


module.exports = displayFrameworksUsed;
