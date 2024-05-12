const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const compareSkills = require('./routes/compareSkills');
const githubLangUsed = require('./routes/githubLangUsed');
const githubRepoLang = require('./routes/githubRepoLang');
const githubFrameworkUsed = require('./routes/githubFrameworkUsed');



app.post("/compare-skills", (req, res) => {
    // const inputData = {
    //     freelancer: [{ id: "1", skills: ["html", "nodejs", "javascript"] }],
    //     client: [{
    //         id: "client1",
    //         projectTitle: "Title",
    //         rate: "rate",
    //         skills: ["html", "css", "javascript", "nodejs"]
    //     },
    //     {
    //         id: "client2",
    //         projectTitle: "Title",
    //         rate: "rate",
    //         skills: ["html", "css", "js", "react"]
    //     },
    //     {
    //         id: "client3",
    //         projectTitle: "Title",
    //         rate: "rate",
    //         skills: ["html", "css", "javascript", "angular"]
    //     }]
    // };

    const { skillSet } = req.body

    const result = compareSkills(skillSet);
    res.json(result);
})


app.post("/github-repo-lang", async (req, res) => {

    const { username, token } = req.body;

    const response = await githubRepoLang(username, token);

    res.status(200).json(response);

})

app.post("/github-lang-used", async (req, res) => {

    const { username, token } = req.body;

    response = await githubLangUsed(username, token);

    res.status(200).json(response);
})

app.post("/github-framework-used", async (req, res) => {

    const { username, token } = req.body;

    response = await githubFrameworkUsed(username, token);

    res.status(200).json(response);
})

app.listen(4001, () => {
    console.log('Server is running on port 4001');
})