const AWS = require('aws-sdk')
const {v4: uuidv4} = require('uuid')

const ID = process.env.AWS_ACCESS_KEY_ID
const Secret = process.env.AWS_SECRET_ACCESS_KEY
const BUCKET_NAME = process.env.AWS_BUCKET_NAME

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

const deleteFromS3 = async (fileUrl) => {
    try {
        // Extract key from S3 URL (e.g., https://bucket.s3.region.amazonaws.com/bills/uuid.ext)
        const url = new URL(fileUrl)
        const key = url.pathname.slice(1) // remove leading /
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
        }
        await s3.deleteObject(params).promise()
        console.log(`File deleted successfully from S3: ${key}`)
    } catch (error) {
        console.error('Error deleting from S3:', error)
        throw new Error('Failed to delete file from S3')
    }
}

module.exports = { uploadToS3, deleteFromS3 }
