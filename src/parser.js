const supported = new Set(['github', 'gitlab', 'bitbucket']);

// thanks to Degit
export default function(src) {
	const match = /^(?:https:\/\/([^\/]+)\/)?([^\/\s]+)\/([^\/\s#]+)(\/[^\s#]+)?(?:#(.+))?/.exec(src);
	if (!match) throw new Error(`could not parse ${src}`);

	const site = (match[1] || 'github').replace(/\.(com|org)$/,'');

	if (!supported.has(site)) {
		throw new Error(`Supported GitHub, GitLab and BitBucket only`);
	}

	const user = match[2];
	const name = match[3];
	const path = (match[4] || '').replace(/^\//,'');
	const ref = match[5] || 'master';

	const url = `https://${site}.${
		site === 'bitbucket' ? 'org' : 'com'
	}/${user}/${name}`;

	const gz = 	site === 'gitlab' 		? 	`${url}/repository/archive.tar.gz?ref=${ref}` : 
				site === 'bitbucket' 	? 	`${url}/get/${ref}.tar.gz` : 
											`${url}/archive/${ref}.tar.gz`;

	return { site, user, name, ref, path, url, gz };
}