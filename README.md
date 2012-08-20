# backpocket

lost your files? check your backpocket : >

simple secure backup/snapshotting over ssh using rsync and pax

## Dependencies
- rsync http://rsync.samba.org/
- pax 

## Features
- Very simple directory structure
- 'latest' directory contains latest backup
- each incremental backup generates a new snapshot folder named with the following convention: 'yyyy-mm-dd hh-mm'
- snapshots make use of hard linking to save space - unmodified files can be snapshotted unlimited times without consuming more space
- rsync only transfers modified files

## Getting Started
Install the module with: `npm install backpocket -g`

## Examples
    //backup from remote to local 
    backpocket user@someipaddress:/home/user/important/ ./backups/  
    
    //backup from local to remote 
    backpocket ./important/ user@someipaddress:/home/user/backups/

## Options

- --ignore path: path to file containing rules for ignoring files (as per rsync docs), default is:
    .git
    .DS_Store
    *.pyc

- --idkey path: optional path to ssh identity key if you want to specify an alternative to the default on your filesystem

## License
Copyright (c) 2012 Alan Clarke  
Licensed under the MIT license.
