# backpocket

lost your files? check your backpocket : >

simple secure backup/snapshotting over ssh using rsync and pax

## Usage
```js
npm install backpocket -g
cd ~/backups
backpocket bob@server:/my/important/files

/*
 *  Creates the following in ~/backups
 *  - latest
 *  - yyyy-mm-dd_hh-mm-ss
*/

// subsequent calls
backpocket bob@server:/my/important/files
backpocket bob@server:/my/important/files

/*
 *  Create more dated archives
 *  - latest
 *  - yyyy-mm-dd_hh-mm-ss
 *  - yyyy-mm-dd_hh-mm-ss
 *  - yyyy-mm-dd_hh-mm-ss
*/

// see backpocket --help for more options
```
## Dependencies
- node.js http://nodejs.org/download/
- rsync http://rsync.samba.org/
- pax http://en.wikipedia.org/wiki/Pax_(Unix) or cp (gnu flavour)

## Features
- only transfers modified files
- uses hard links to unmodified files, i.e. if nothing changed, incremental backup should take up zero additional disk space
