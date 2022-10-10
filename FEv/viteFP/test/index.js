//AWS setup
const AWS = require("aws-sdk");

const client = new AWS.DynamoDB.DocumentClient()
exports.handler = async (event)=>{
    let response = {}

    let body = event.body
    if(typeof(body)){
        body = JSON.parse(body)
    }

    const params = {
        TableName : 'viteFPtable',
        item : body
    }

    try {
        await client.put(params).promise()
        response = {
            statusCode : 200,
        }

    } catch (error) {
       response={
            statusCode : 500,
            body : error
       }        
    }

    return response
    
}