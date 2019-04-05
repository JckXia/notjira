function randomIntFromInterval(min, max) // min and max included
{
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const request = require('request');

module.exports = {
  createBranch: (req, res) => {
    let platnumber = randomIntFromInterval(1000, 9999);
    res.send({
      platNUmber: platnumber
    });
  },
  getPullRequests: (req, res) => {
    const repo_owner_name = req.query.repo_owner_name;
    const repo_name = req.query.repo_name;
    const reqUrl = "https://api.github.com/repos/" + repo_owner_name + "/" + repo_name + "/pulls";
    console.log(reqUrl);
    var options = {
      url: reqUrl,
      headers: {
        'User-Agent': 'request'
      }
    }
    request(options,(err,response,body)=>{
        if(err){
          throw err;
        }
        res.send(body);
    });
  }
}
