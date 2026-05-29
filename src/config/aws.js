require('dotenv').config({ quiet: true });

function getAwsConfig() {
    return {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
        s3Bucket: process.env.AWS_S3_BUCKET,
        dynamoDbSessionsTable: process.env.AWS_DYNAMODB_SESSIONS_TABLE || 'sesiones-alumnos',
        snsTopicArn: process.env.AWS_SNS_TOPIC_ARN,
    };
}

module.exports = {
    getAwsConfig,
};
