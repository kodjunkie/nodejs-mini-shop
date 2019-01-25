const fs = require('fs');
const { dirname, resolve } = require('path');

exports.deleteFile = filePath => {
	fs.unlink(resolve(dirname(process.mainModule.filename), filePath.substr(1)), err => {
		if (err) {
			throw err;
		}
	});
};
