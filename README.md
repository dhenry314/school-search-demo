# school-search-demo 

App to demonstrate building a full-stack Express/React app using the CollegeScoreBoard API (see https://api.data.gov/ed/collegescorecard/v1/schools.json).  Thanks to Sandeep Raveesh for the deployment template (see https://hackernoon.com/full-stack-web-application-using-react-node-js-express-and-webpack-97dbd5b9d708)

## Prerequisites

1. Get an api key from https://api.data.gov/signup/

## Installation 

1. git clone https://github.com/dhenry314/school-search-demo.git
2. cd /school-search-demo
3. npm install
4. Copy example.env to .env
5. Replace the APIKEY value in .env with the api key obtained from https://api.data.gov/signup/

### Development mode

1. npm run dev
2. Go to http://localhost:3000

### Production mode

1. npm run build
2. npm start
3. Go to http://localhost:8080

NOTE: To run the app in the background as a deamon, you can use pm2 (see https://www.npmjs.com/package/pm2)
-- npm install -g pm2
-- pm2 start npm --start

### Usage

1. Type a school name in the search box at the top of the page
2. Select a school from the list of search results
3. Options: a) print the report;  b) download a PDF of the report



