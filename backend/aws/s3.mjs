import configurations from "../utils/configurations.mjs";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

//recibe un buffer y lo sube a S3
const uploadFileS3 = async (buff, path, type) => {
    const client = new S3Client({
      region: configurations.region,
      credentials: {
        accessKeyId: configurations.accessKeyId,
        secretAccessKey: configurations.secretAccessKey,
      },
    });
  
    const command = new PutObjectCommand({
      Bucket: configurations.bucket,
      Key: path,
      Body: buff,
      ContentType: type,
    });
  
    try {
      const response = await client.send(command);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }finally{
      client.destroy();
    }
  };

  const deleteObjectS3 = async (path) => {
    let parts = path.split('/');
    parts = parts[parts.length - 2] + "/" + parts[parts.length - 1];
  
    const client = new S3Client({
      region: configurations.region,
      credentials: {
        accessKeyId: configurations.accessKeyId,
        secretAccessKey: configurations.secretAccessKey,
      },
    });
    const command = new DeleteObjectCommand({
      Bucket: configurations.bucket,
      Key: parts,
    });
  
    try {
      const response = await client.send(command);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export { uploadFileS3, deleteObjectS3};
  