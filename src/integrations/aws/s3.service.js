const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getAwsConfig } = require('../../config/aws');

function createS3Client() {
    const config = getAwsConfig();

    return new S3Client({
        region: config.region,
        credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            sessionToken: config.sessionToken,
        },
    });
}

function buildPublicUrl(bucket, region, key) {
    return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, '/')}`;
}

async function uploadProfilePhoto(alumnoId, file) {
    const config = getAwsConfig();

    if (!config.region || !config.accessKeyId || !config.secretAccessKey || !config.s3Bucket) {
        throw new Error('Configuracion de AWS incompleta');
    }

    const extension = file.originalname.includes('.') ? file.originalname.split('.').pop() : 'jpg';
    const key = `perfiles/alumnos/${alumnoId}/fotoPerfil-${Date.now()}.${extension}`;
    const s3 = createS3Client();

    await s3.send(new PutObjectCommand({
        Bucket: config.s3Bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    }));

    return buildPublicUrl(config.s3Bucket, config.region, key);
}

module.exports = {
    uploadProfilePhoto,
};
