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
    ScanCommand,
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

async function getPrimaryKeyName() {
    const result = await describeSessionsTable();
    const hashKey = result.Table.KeySchema.find(key => key.KeyType === 'HASH');

    return hashKey.AttributeName;
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
    const primaryKeyName = await getPrimaryKeyName();

    if (primaryKeyName !== 'sessionString') {
        const result = await client.send(new ScanCommand({
            TableName: getTableName(),
            FilterExpression: 'sessionString = :sessionString',
            ExpressionAttributeValues: {
                ':sessionString': sessionString,
            },
            Limit: 1,
        }));

        return (result.Items && result.Items[0]) || null;
    }

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
    const session = await findSession(sessionString);

    if (!session) {
        return null;
    }

    const primaryKeyName = await getPrimaryKeyName();

    const result = await client.send(new UpdateCommand({
        TableName: getTableName(),
        Key: {
            [primaryKeyName]: session[primaryKeyName],
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
