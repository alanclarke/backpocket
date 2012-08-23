[![build status](https://secure.travis-ci.org/alanclarke/backpocket.png)](http://travis-ci.org/alanclarke/backpocket)
# backpocket

lost your files? check your backpocket : >

simple secure backup/snapshotting over ssh using rsync and pax

## Dependencies
- node.js http://nodejs.org/download/
- rsync http://rsync.samba.org/
- pax http://en.wikipedia.org/wiki/Pax_(Unix) or cp (gnu flavour)

## Features
- simple directory structure
- 'latest' folder contains latest backup
- incremental backups, named 'yyyy-mm-dd hh-mm', provide timestamped snapshots
- snapshots make use of hard linking to save space - unmodified files can be snapshotted unlimited times without consuming more space
- rsync only transfers modified files

## Installation
```
npm install backpocket -g
```

## Examples
```
//backup from local to local
backpocket ./important/ ./backups/  

//backup from remote to local (pull)
backpocket pull user@someipaddress:/home/user/important/ ./backups/  

//backup from local to remote (push)
backpocket push ./important/ user@someipaddress:/home/user/backups/
```

## Options

- **--cp [1]**: *use cp instead of pax. this runs on the destination machine. osx ships with pax and it's cp command doesn't support hard links, so if the dest is osx use pax, but if the dest is linux cp is more likely to be there already*

- **--idkey [path]**: *optional path to ssh identity key if you want to specify an alternative to the default on your filesystem*

- **--ignore [path]**: *path to file containing rules for ignoring files (as per rsync docs), default is:*

```
.git
.DS_Store
*.pyc
```


## License
Copyright (c) 2012 Alan Clarke  
Licensed under the MIT license.
