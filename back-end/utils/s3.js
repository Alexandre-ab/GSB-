const AWS = require('aws-sdk')
const {v4: uuidv4} = require('uuid')

const ID = 'AKIAR6CECS537ATOEOBN'
const Secret = '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'
const BUCKET_NAME = 'gsbbackend'



const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey:Secret,
});

const uploadToS3 = async (file) => {
    try {
        const fileExtension = file.originalname.split('.').pop();
        const key = `bills/${uuidv4()}.${fileExtension}`
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file.buffer,
        };
        const uploadData = await s3.upload(params).promise();
        console.log(`File uploaded successfully. ${uploadData.Location}`)
        return uploadData.Location;
    } catch (error) {
        console.error('Error uploading to S3:', error)
        throw new Error('Failed to upload file to S3')
    }
}

module.exports = { uploadToS3 }


