var express = require("express");

const BigQuery = require("@google-cloud/bigquery");

// Your Google Cloud Platform project ID
const projectId = "158821688787";

// Creates a client
const bigquery = new BigQuery({
  projectId: projectId,
  keyFilename: "./mbbigquery.json",
});

const sqlQuery =
  "select count(*) file_count from `bigquery-public-data.github_repos.files` where ref != 'X'";

const options = {
  query: sqlQuery,
  timeoutMs: 10000, // Time out after 10 seconds.
  useLegacySql: false, // Use standard SQL syntax for queries.
};

const sqlQuery2 =
  "SELECT COUNT(*) commit_count, JSON_EXTRACT_SCALAR(payload, '$.pull_request.base.repo.language') lang FROM `githubarchive.month.201801` WHERE JSON_EXTRACT_SCALAR(payload, '$.pull_request.base.repo.language')IS NOT NULL GROUP BY 2 ORDER BY 1 DESC LIMIT 1";
const options2 = {
  query: sqlQuery2,
  timeoutMs: 10000, // Time out after 10 seconds.
  useLegacySql: false, // Use standard SQL syntax for queries.
};

const formatYmd = (date) => date.toISOString().slice(0, 10);
console.log(formatYmd(new Date()));

let sqlQuery3 =
  "SELECT title, sum(views) views FROM `bigquery-public-data.wikipedia.pageviews_2024` WHERE DATE(datehour) = '";
yesterday=new Date();
yesterday.setDate(yesterday.getDate()-1);
sqlQuery3 += formatYmd(yesterday);


//sqlQuery3 += formatYmd(new Date());

sqlQuery3 +=
  "' and title not in ('Pornhub','-','Main_Page','Special:Search') and wiki like 'en%' group by title order  by views desc LIMIT 20 ";
console.log(sqlQuery3);
console.log('Wikipedia query: '+sqlQuery3)

const options3 = {
  query: sqlQuery3,
  timeoutMs: 10000, // Time out after 10 seconds.
  useLegacySql: false, // Use standard SQL syntax for queries.
};

var app = express();

app.set("port", process.env.PORT || 5005);
app.use(express.static(__dirname + "/public"));

app.get("/", function (request, response) {
  response.send("Hello World!");
});

app.get("/bigquery", function (request, response) {
  var row;
  bigquery
    .query(options)
    .then((results) => {
      row = results[0][0];
      console.log("Biq query returned: " + JSON.stringify(row));
      response.send(JSON.stringify(row));
    })
    .catch((err) => {
      console.error("ERROR:", err);
      response.send(err);
    });
});

app.get("/bigquery2", function (request, response) {
  var myresults = {};
  var row;
  bigquery
    .query(options2)
    .then((results) => {
      row = results;
      console.log("Biq query returned: " + JSON.stringify(results[0]));
      myresults = { data: results[0] };
      response.send(JSON.stringify(myresults));
    })
    .catch((err) => {
      console.error("ERROR:", err);
      response.send(err);
    });
});

app.get("/bigquery3", function (request, response) {
  var myresults = {};
  var rows;
  bigquery
    .query(options3)
    .then((results) => {
      rows = results[0];
      console.log("Biq query returned: " + JSON.stringify(rows));
      myresults = { data: rows };
      let strresult = JSON.stringify(myresults);
      const searchRegExp = /_/g;
      const replaceWith = " ";
      strresult = strresult.replace(searchRegExp, replaceWith);
      response.send(strresult);
    })
    .catch((err) => {
      console.error("ERROR:", err);
      response.send(err);
    });
});

app.listen(app.get("port"), function () {
  console.log("Node app is running at localhost:" + app.get("port"));
});
