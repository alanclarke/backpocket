

var path = require('path'),
fs = require('fs'),
util = require('util'),
spawn = require('child_process').spawn;



function exec(command, args, cwd, callback){
	var child = spawn(command, args, {
		cwd: cwd,
		env: process.env
	}),
	resp = '', error = '';
	child.stdout.on('data', function (data) {
		resp += data;
		process.stdout.write(data.toString());
	});

	child.stderr.on('data', function (data) {
		error +=data;
		process.stdout.write(error.toString());
	});

	child.on('exit', function (err) {
	if(err || error){
		return !callback||callback(error ||err , resp);
	}
		return !callback||callback(error ||err , resp );
	});
}


module.exports = function(src, dest, opts, callback) {

	var pwd = process.cwd(),
	d = new Date(),
	folder_name = util.format('%s-%s-%s %s-%s-%s',d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(), d.getMinutes(), d.getSeconds()),
	
	sshOpts = [
		"ssh"
	];
	if(opts.idkey){
		sshOpts.push('-i', opts.idkey);
	}
	sshOpts.push(
		"-o", "LogLevel=QUIET",
		"-o", "UserKnownHostsFile=/dev/null",
		"-o", "StrictHostKeyChecking=no",
		"-o", "PasswordAuthentication=no",
		"-o", "ServerAliveInterval=10",
		"-p", 22
	);

	ssh = sshOpts.join(" ");

	opts.ignore = opts.ignore||path.join(__dirname, "ignore.txt");

	exec('mkdir', [ path.join(dest,'latest') ], pwd, function(){
		exec('mkdir', [path.join(dest,folder_name)], pwd, function(){
			exec('rsync', ["-lpthrvz","--archive", "--delete", "--safe-links", "--exclude-from", opts.ignore, "-e", ssh, src , path.join(dest,'latest')], pwd, function(err, resp){
			 	exec('pax', ['-rwl','.', path.resolve(pwd, path.join(dest, folder_name))], path.resolve(pwd, path.join(dest,'latest')), function(){
			 		return !callback|| callback();
			 	});
			});
		});
	});
};



var opts_list = [
	'--idkey',
	'--ignore'
];

module.exports.getargs = function(argv){
	var skip = false,
	args  = argv.slice(2),
	opts = { };
	
	args.forEach(function(a, i){
		if(skip){
			skip = false;
			return;
		}
		if(opts_list.indexOf(a)>=0){
			skip = true;
			opts[a.substr(2)] = args[i+1];
		} else if (!opts.src){
			opts.src = a;
		} else {
			opts.dest = a;
		}
	});
	return opts
};

