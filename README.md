# fetch-repo-dir
Download any directory from repository on GitHub, GitLab or Bitbucket to the specified location. Minimal dependencies, works without *git* or *unzip* in the OS.

## Usage

`fetchRepoDir({src:<repository_path>,dir:<destination_path>},{<options>})`
`fetchRepoDir([{src:<repository_path>,dir:<destination_path>},...],{<options>})`

```javascript

const fetchRepoDir = require('fetch-repo-dir');

...
// this is async function. 
try{
    //this will copy content of the /templates/default of the repository to the ./template directory
    await fetchRepoDir({src:'author/repository/templates/default',dir:'./template'});
}catch(err){
    trow new Error(err);
}
...
```

## Options

|Option         |Default|Description                                     |
|---------------|-------|------------------------------------------------|
|replace        | false | Replace or not existing directory              |
|onDownloadStart| (archive_url,tmp_archive)=>{}| Run before download archive of repository      |
|onDownloadEnd  | (archive_url,tmp_archive)=>{}| Run after download archive of repository       |
|onUnpackStart  | (tmp_archive,tmp_dir)=>{}| Run before unpacking archive in tmp folder     |
|onUnpackEnd    | (tmp_archive,tmp_dir)=>{}| Run after unpacking archive in tmp folder      |
|onCopyStart    | (tmp_path,dest_path)=>{}| Run before copy folder from tmp to destination |
|onCopyEnd      | (tmp_path,dest_path)=>{}| Run after copy folder from tmp to destination  |
