import fs from 'fs-extra';
import tmp from 'tmp';
import path from 'path';
import parser from './parser';
import { fetch , log, untar } from './utils';

tmp.setGracefulCleanup();

export default async function(repodirs, options={}){
    
    if(!Array.isArray(repodirs))  repodirs = [repodirs];

    options = Object.assign({
        replace:false,
        onDownloadStart: () => {},
        onDownloadEnd: () => {},
        onUnpackStart: () => {},
        onUnpackEnd: () => {},
        onCopyStart: () => {},
        onCopyEnd: () => {}
    },options);

    const tmpdir = tmp.dirSync({unsafeCleanup:true});
    const TMPDIR = tmpdir.name;

    const downloadUnpackAndCopy = async (src,dest) => {

        const repo = parser(src);

        const HASH = `${repo.site}_${repo.user}_${repo.name}_${repo.ref}`.replace(/[^a-z0-9_]/gi,'_');
        const GZ = path.join(TMPDIR,`${HASH}.tar.gz`);
        const EXTR = path.join(TMPDIR,HASH);
        const SRC = path.join(EXTR,repo.path.split('/').join(path.sep));
        const DEST = path.resolve(dest);
        
        if(!fs.existsSync(EXTR)){
            fs.mkdirSync(EXTR);
            try {
                options.onDownloadStart(repo.gz,GZ);
                await fetch(repo.gz,GZ);
                options.onDownloadEnd(repo.gz,GZ);
            }catch (err) {
                throw new Error(`unsuccessful download of ${repo.gz};${err}`);
            }
        }
        
        try {
            options.onUnpackStart(GZ,EXTR);
            await untar(GZ,EXTR);
            options.onUnpackEnd(GZ,EXTR);
        }catch (err) {
            throw new Error(`can't unpack ${GZ}`);
        }
        
        if(!options.replace && fs.existsSync(DEST) && fs.readdirSync(DEST).length > 0) throw new Error(`destination directory is not empty`);
        fs.mkdirpSync(DEST);

        options.onCopyStart(SRC,DEST);
        fs.copySync(SRC,DEST);
        options.onCopyEnd(SRC,DEST);
    }
    
    for(let i = 0; i < repodirs.length; i++){
        const repodir = repodirs[i];
        if(!repodir.src || !repodir.dir) throw new Error('invalid source and/or distonation provided');
        await downloadUnpackAndCopy(repodir.src,repodir.dir) 
    }

    tmpdir.removeCallback();
}



