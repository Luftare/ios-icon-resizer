const sharp = require('sharp');

module.exports = (sourceImagePath, outputDirectoryPath, versions) => {
  return versions.map(async ({ name, size }) => {
    const imageOutputPath = `${outputDirectoryPath}/${name}`;
    return await sharp(sourceImagePath)
      .resize(size, size)
      .toFile(imageOutputPath);
  });
};
