import fs from 'fs-extra';
import https from 'https';
import tar from 'tar';

export function log(text){
    process.stdout.write(text+"\n")
}

export function fetch(url, dest) {
	return new Promise((fulfil, reject) => {
		https
			.get(url, response => {
				const code = response.statusCode;
				if (code >= 400) {
					reject({ code, message: response.statusMessage });
				} else if (code >= 300) {
					fetch(response.headers.location, dest).then(fulfil, reject);
				} else {
					response
                        .pipe(fs.createWriteStream(dest))
						.on('finish', () => fulfil())
						.on('error', reject);
				}
			})
			.on('error', reject);
	});
}

export async function untar(file, dest) {
	return tar.extract({
		file,
		strip: 1,
		C: dest,
	});
}