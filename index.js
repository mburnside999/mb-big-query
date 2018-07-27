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


var app = express();

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {

  response.send('Hello World!')
})

app.get('/bigquery', function(request, response) {

var rows;

bigquery
    .query(options)
    .then(results => {
      rows = results[0];
response.send(JSON.stringify(rows));
      //console.log('Rows:');
      //rows.forEach(row => console.log(row));
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

	
  //response.send(rows);
})




app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})