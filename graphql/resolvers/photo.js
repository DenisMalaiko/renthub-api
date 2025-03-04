import { GraphQLUpload } from "graphql-upload";
import mongoose from "mongoose";

const photoResolver = {
    Upload: GraphQLUpload,
    Mutation: {
        uploadPhoto: async (_, { file }) => {
            console.log("START uploadPhoto");

            const { createReadStream, filename, mimetype } = await file;
            console.log("Processing file:", filename);

            const stream = createReadStream();

            return new Promise((resolve, reject) => {
                const uploadStream = global.gfs.openUploadStream(filename, {
                    contentType: mimetype
                });
                stream.pipe(uploadStream);

                uploadStream.on("finish", () => {
                    console.log("File uploaded:", filename);
                    resolve({
                        id: uploadStream.id.toString(),
                        filename,
                    });
                });

                uploadStream.on("error", (err) => {
                    console.error("Upload error:", err);
                    reject(err);
                });
            });
        }
    }
};

export default photoResolver;