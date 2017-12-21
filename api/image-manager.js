function imageManager() {
    const fs = require('fs');
    const imagesFolderLocation = __dirname + '/user-images/';

    let publicMethods = {
      saveImage: null
    }

    publicMethods.saveImage = function(imageName, image) {
      image = image.replace(/^data:([A-Za-z-+\/]+);base64,/, "");
      fs.writeFile(imagesFolderLocation + imageName, image, 'base64', function(err){
          if (err) throw err
      });
    }

    publicMethods.deleteImage = function(imageName) {
      console.log("Inside delete image.");
      fs.unlink(imagesFolderLocation + imageName, function(err){
          if (err) throw err
      })
    }

    return publicMethods;
}


module.exports = imageManager;
