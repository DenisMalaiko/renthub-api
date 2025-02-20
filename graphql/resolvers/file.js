//const { GraphQLUpload } = require('graphql-upload');
//const path = require("path");

const fileResolver = {
    uploadFile: async (_, { file }) => {
        console.log("-------")
        console.log("START UPLOAD FILE ", file);
        console.log("-------")

     /*   const { createReadStream, filename, mimetype } = await file;
        console.log("Create Read Stream ", createReadStream)
        console.log("File Name", filename)
        console.log("Mimetype", mimetype)*/

        return "";

       /*
        const filePath = path.join(__dirname, "uploads", filename);

        await new Promise((resolve, reject) => {
            createReadStream()
                .pipe(createWriteStream(filePath))
                .on("finish", resolve)
                .on("error", reject);
        });


        const savedFile = new File({ filename, mimetype, path: filePath });
        await savedFile.save();

        console.log("SAVED FILE ", savedFile);

        return savedFile;*/
    }
};

export default fileResolver;