const {
    CreateTableCommand,
    DescribeTableCommand,
    DynamoDBClient,
    ResourceInUseException,
} = require('@aws-sdk/client-dynamodb');
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');
const { getAwsConfig } = require('../../config/aws');

function createDynamoDbClient() {
    const config = getAwsConfig();

    return new DynamoDBClient({
        region: config.region,
        credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            sessionToken: config.sessionToken,
        },
    });
}

function getTableName() {
    return getAwsConfig().dynamoDbSessionsTable;
}

function getDocumentClient() {
    return DynamoDBDocumentClient.from(createDynamoDbClient());
}

async function createSessionsTable() {
    const client = createDynamoDbClient();
    const tableName = getTableName();

    try {
        await client.send(new CreateTableCommand({
            TableName: tableName,
            AttributeDefinitions: [
                {
                    AttributeName: 'sessionString',
                    AttributeType: 'S',
                },
            ],
            KeySchema: [
                {
                    AttributeName: 'sessionString',
                    KeyType: 'HASH',
                },
            ],
            BillingMode: 'PAY_PER_REQUEST',
        }));

        return { tableName, created: true };
    } catch (error) {
        if (error instanceof ResourceInUseException || error.name === 'ResourceInUseException') {
            return { tableName, created: false };
        }

        throw error;
    }
}

async function describeSessionsTable() {
    const client = createDynamoDbClient();
    const tableName = getTableName();

    return client.send(new DescribeTableCommand({
        TableName: tableName,
    }));
}

async function saveSession(session) {
    const client = getDocumentClient();

    await client.send(new PutCommand({
        TableName: getTableName(),
        Item: session,
    }));

    return session;
}

async function findSession(sessionString) {
    const client = getDocumentClient();
    const result = await client.send(new GetCommand({
        TableName: getTableName(),
        Key: {
            sessionString,
        },
    }));

    return result.Item || null;
}

async function deactivateSession(sessionString) {
    const client = getDocumentClient();

    const result = await client.send(new UpdateCommand({
        TableName: getTableName(),
        Key: {
            sessionString,
        },
        UpdateExpression: 'SET active = :active',
        ConditionExpression: 'attribute_exists(sessionString)',
        ExpressionAttributeValues: {
            ':active': false,
        },
        ReturnValues: 'ALL_NEW',
    }));

    return result.Attributes || null;
}

module.exports = {
    createSessionsTable,
    describeSessionsTable,
    saveSession,
    findSession,
    deactivateSession,
};
