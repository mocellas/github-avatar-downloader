var request = require('request');
var fs = require('fs');
var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;

var user = process.argv[2];
var repo = process.argv[3];

function getRepoContributors(repoOwner, repoName, cb) {
  //my code starts here
    var options = {
      url: `https://+{GITHUB_USER}:+{GITHUB_TOKEN}@api.github.com/repos/+{repoOwner}/+{repoName}/contributors`,
      headers: {
        'User-Agent': 'GitHub Avatar Downloader - Student Project'
        }
    };
    request.get(options,(err,response,body) => {
        if (JSON.parse(body).message === "Bad credentials") {
            console.log('Credentials are correct? Please review your .env file');
            return -1;
        }
        cb(err,JSON.parse(body));
    });
}

function downloadImageByURL(url, filePath) {
    var options = {
        url: url,
        headers: {
            'User-Agent': 'GitHub Avatar Downloader - Student Project'
        }
    }
    var fileOptions = {
        flags: 'w',
        defaultEncoding: 'utf8',
        fd: null,
        mode: 0o666,
        autoClose: true
    }
    if (!fs.existsSync('avatars'))
            fs.mkdirSync('avatars');
    request.get(options).pipe(fs.createWriteStream(filePath,fileOptions));
}

getRepoContributors(user,repo,(err,contributors) => {
    contributors.forEach((contributor) => {
        downloadImageByURL(contributor.avatar_url,`avatars/${contributor.login}.jpg`);
    })
});

module.exports = getRepoContributors;