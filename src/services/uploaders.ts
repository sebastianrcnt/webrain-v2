import multer from "multer";

const uploader = multer({ dest: "uploads/" });

export const experimentsUploader = uploader.fields([
  {
    name: "cover",
    maxCount: 1,
  },
  { name: "zip", maxCount: 1 },
]);

export const projectsUploader = uploader.single("cover");
export const projectGroupsUploader = uploader.single("cover");

export default uploader;
