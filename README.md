# backpocket
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

lost your files? check your backpocket : >

create incremental timemachine style backups locally or over ssh

### usage
```js
npm install backpocket -g
cd ~/backups
backpocket user@server:/my/important/files

/*
 *  Creates the following in ~/backups
 *  - latest
 *  - YYYY-MM-DD_HH-mm-ss
*/

// subsequent calls
backpocket bob@server:/my/important/files
backpocket bob@server:/my/important/files

/*
 *  Creates more incremental archives
 *  - latest
 *  - YYYY-MM-DD_HH-mm-ss
 *  - YYYY-MM-DD_HH-mm-ss
 *  - YYYY-MM-DD_HH-mm-ss
*/

backpocket --help

/*
 *  Usage: backpocket [options] <target>
 *
 *  e.g. "backpocket ../files" or "backpocket -p 30days -f YYYY-MM-DD_hh-mm-ss user@server:files"
 *
 *  create incremental backups of target in the current working directory
 *
 *  Options:
 *
 *    -h, --help            output usage information
 *    -V, --version         output the version number
 *    -v, --verbose         verbose output
 *    -f, --format          format for archive directory (default is "YYYY-MM-DD_HH-mm-ss")
 *    -p, --purge n[units]  remove backups older than... "2seconds", "2minutes", "2hours", "2days", "2weeks"
 */
```

### features
- works over ssh
- only transfers missing or modified files
- uses hard links i.e. if nothing changed, incremental backup takes up zero additional disk space
- unit tested

### dependencies
- node.js http://nodejs.org/download/
- pax http://en.wikipedia.org/wiki/Pax_(Unix)
- rsync http://rsync.samba.org/
