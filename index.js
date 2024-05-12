const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const compareSkills = require('./routes/compareSkills');
const githubLangUsed = require('./routes/githubLangUsed');
const githubRepoLang = require('./routes/githubRepoLang');
const githubFrameworkUsed = require('./routes/githubFrameworkUsed');
const extractSkills = require('./routes/extractSkills');



app.post("/extract-skills", async (req, res) => {
    const { description } = req.body;

    const result = await extractSkills(description);
    res.status(200).json(result);
})

app.post("/compare-skills", async (req, res) => {
    //template data
    const inputData = {
        freelancer: [{ id: "1", rate: 500, role: "web developer", skills: ["html", "css", "javascript"] }],
        gigs: [{
            id: "client1",
            projectTitle: "backend development",
            description: "need a backend developer with 5 years of experience in nodejs and mongodb",
            rate: "600",
            skills: ["html", "css", "javascript", "nodejs"]
        },
        {
            id: "client2",
            projectTitle: "frontend development",
            rate: "400",
            description: "need a frontend developer with 3 years of experience in react",
            skills: ["html", "css", "js", "react"]
        },
        {
            id: "client3",
            projectTitle: "full stack development",
            rate: "1000",
            description: "need a full stack developer with 5 years of experience in angular and nodejs",
            skills: ["html", "css", "javascript", "angular", "nodejs"]
        }]
    };

    const { skillSet } = req.body

    const result = await compareSkills(skillSet);

    res.status(200).json(result);
})


app.post("/api/github/github-repo-lang", async (req, res) => {

    const { username, token } = req.body;

    const response = await githubRepoLang(username, token);

    res.status(200).json(response);

})

app.post("/api/github/github-lang-used", async (req, res) => {

    const { username, token } = req.body;

    response = await githubLangUsed(username, token);

    res.status(200).json(response);
})

app.post("/api/github/github-framework-used", async (req, res) => {

    const { username, token } = req.body;

    response = await githubFrameworkUsed(username, token);

    res.status(200).json(response);
})

app.listen(4001, () => {
    console.log('Server is running on port 4001');
})