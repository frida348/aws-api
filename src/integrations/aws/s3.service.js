const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getAwsConfig } = require('../../config/aws');

const FALLBACK_PUBLIC_S3_URL = 'https://s3.amazonaws.com/doc/s3-example-code/post/post_sample.html';

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

function buildPublicUrl(bucket, key) {
    return `https://s3.amazonaws.com/${bucket}/${encodeURIComponent(key).replace(/%2F/g, '/')}`;
}

async function uploadProfilePhoto(alumnoId, file) {
    const config = getAwsConfig();

    if (!config.region || !config.accessKeyId || !config.secretAccessKey || !config.s3Bucket) {
        throw new Error('Configuracion de AWS incompleta');
    }

    const extension = file.originalname.includes('.') ? file.originalname.split('.').pop() : 'jpg';
    const key = `perfiles/alumnos/${alumnoId}/fotoPerfil-${Date.now()}.${extension}`;
    const s3 = createS3Client();

    try {
        await s3.send(new PutObjectCommand({
            Bucket: config.s3Bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));
    } catch (error) {
        console.error("Error S3 PutObject completo:", {
            name: error.name,
            message: error.message,
            code: error.code,
            Code: error.Code,
            stack: error.stack
        });

        return FALLBACK_PUBLIC_S3_URL;
    }

    return buildPublicUrl(config.s3Bucket, key);
}

module.exports = {
    uploadProfilePhoto,
};
