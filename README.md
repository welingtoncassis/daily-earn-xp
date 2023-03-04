# Description

- This app uses aws lambda and chrome-aws-lambda to do login on web site every day;
- You can use wicth example to do webscraping using aws lambda;

## Requirements

- Configured AWS credentials
- AWS cli
- AWS SAM

## How to deply

- set value in environment variables: SITE USER , SITPASS, SITE URL variables
- Run `sam build`
- Run `sam deploy --guided`
