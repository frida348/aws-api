const { PublishCommand, SNSClient } = require('@aws-sdk/client-sns');
const { getAwsConfig } = require('../../config/aws');

function createSnsClient() {
    const config = getAwsConfig();

    return new SNSClient({
        region: config.region,
        credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            sessionToken: config.sessionToken,
        },
    });
}

async function publishAlumnoEmail(message) {
    const config = getAwsConfig();

    if (!config.region || !config.accessKeyId || !config.secretAccessKey || !config.snsTopicArn) {
        throw new Error('Configuracion de SNS incompleta');
    }

    const sns = createSnsClient();

    return sns.send(new PublishCommand({
        TopicArn: config.snsTopicArn,
        Subject: 'Datos del alumno',
        Message: message,
    }));
}

module.exports = {
    publishAlumnoEmail,
};
