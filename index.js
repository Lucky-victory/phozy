const fse = require("fs-extra");

const srcDir = `client/www`;
const destDir = `server/public`;

// To copy a folder or file, select overwrite accordingly
try {
  fse.copySync(srcDir, destDir, { overwrite: true });
  console.log("success!");
} catch (err) {
  console.error(err);
}
