
const fse = require("fs-extra");

const srcDir = `server/dist/public`;
const destDir = `server/public`;

// To copy a folder or file, select overwrite accordingly
try {
  fse.copySync(srcDir, destDir, { overwrite: true });
  console.log("files copied successfully!");
 
} catch (err) {
  console.error(err);
}
