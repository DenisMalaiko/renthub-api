import { GraphQLUpload } from "graphql-upload";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";

const photoResolver = {
    Upload: GraphQLUpload,
    Mutation: {
        uploadPhoto: async (_, { photo }) => {
            const { filename, mimetype, encoding, createReadStream } = await photo.file;
            const stream = createReadStream();
            const db = mongoose.connection.db;
            const bucket = new GridFSBucket(db, { bucketName: "uploads" });

            return new Promise((resolve, reject) => {
                const uploadStream = bucket.openUploadStream(filename, {
                    contentType: mimetype,
                });

                stream.pipe(uploadStream);

                uploadStream.on("finish", () => {
                    console.log("Файл завантажено в MongoDB GridFS:", filename);
                    resolve({
                        id: uploadStream.id,
                        filename,
                        url: `/image/${uploadStream.id}`,
                    });
                });

                uploadStream.on("error", (error) => {
                    console.error("Помилка завантаження:", error);
                    reject(error);
                });
            });
        },
    }
};

export default photoResolver;