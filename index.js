var express = require('express');

const BigQuery = require('@google-cloud/bigquery');

// Your Google Cloud Platform project ID
const projectId = '158821688787';

// Creates a client
const bigquery = new BigQuery({
  projectId: projectId,
});

const sqlQuery = "select count(*) commit_count from `bigquery-public-data.github_repos.commits`";
const options = {
    query: sqlQuery,
    timeoutMs: 10000, // Time out after 10 seconds.
    useLegacySql: false, // Use standard SQL syntax for queries.
  };

const sqlQuery2="SELECT COUNT(*) c, JSON_EXTRACT_SCALAR(payload, '$.pull_request.base.repo.language') lang FROM `githubarchive.month.201801` WHERE JSON_EXTRACT_SCALAR(payload, '$.pull_request.base.repo.language')IS NOT NULL GROUP BY 2 ORDER BY 1 DESC LIMIT 10"
const options2 = {
  query: sqlQuery2,
  timeoutMs: 10000, // Time out after 10 seconds.
  useLegacySql: false, // Use standard SQL syntax for queries.
};

var app = express();

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/bigquery', function(request, response) {

var row;
bigquery
    .query(options)
    .then(results => {
      row=results[0][0];
      console.log('Biq query returned: '+JSON.stringify(row));
      response.send(JSON.stringify(row));
    })
    .catch(err => {
      console.error('ERROR:', err);
      response.send(err);
    });

})

app.get('/bigquery2', function(request, response) {

  var row;
  bigquery
      .query(options2)
      .then(results => {
        row=results;
        console.log('Biq query returned: '+JSON.stringify(results));
        response.send(JSON.stringify(results));
      })
      .catch(err => {
        console.error('ERROR:', err);
        response.send(err);
      });
  
  })




app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})