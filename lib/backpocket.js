

var path = require('path'),
fs = require('fs'),
util = require('util'),
spawn = require('child_process').spawn;



function exec(command, args, cwd, callback){
	console.log(args.join(' '))
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

function ssh_exec(host, sshOpts, args, cwd,  callback){
	exec('ssh', [host].concat(sshOpts.slice(1),args), cwd, callback);


}

function clean_path(p){
	return p.replace(/\\\s/gi,' ').replace(/\s/gi,'\\ ').replace(/\/$/, '')+'\/';
}


module.exports = function(src, dest, opts, callback) {
	//force trailing backslash for consistency
	src = clean_path(src);
	dest = clean_path(dest);

	var src_is_ssh = opts.ssh==='pull';
	var dest_is_ssh = opts.ssh==='push';
	var is_ssh = src_is_ssh || dest_is_ssh;

	var pwd = process.cwd(),
	ssh = '',
	d = new Date(),
	folder_name = util.format('%s-%s-%s %s-%s-%s',d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(), d.getMinutes(), d.getSeconds());
	
	opts.ignore = opts.ignore||path.join(__dirname, "ignore.txt");
	var rsync_args = ["-lpthrvz","--archive", "--delete", "--safe-links", "--exclude-from", opts.ignore ]

	if(is_ssh){
		var sshOpts = [
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

		rsync_args.push( "-e", ssh );
	}

	rsync_args.push(src , path.join(dest,'latest'));


	if(dest_is_ssh){
		var parse_dest = dest.split(':');
		var dest_local = parse_dest[1];
		var host = parse_dest[0];
		var latest = path.join(dest_local,'latest');
		var folder_path = path.join(dest_local,folder_name);

		ssh_exec(host, sshOpts, [ 'mkdir', folder_path], pwd,  function(){
			ssh_exec(host, sshOpts, [ 'mkdir', latest], pwd,  function(){
				exec('rsync', rsync_args, pwd, function(err, resp){
					ssh_exec(host, sshOpts, [ 'cd',latest+';',opts.cp?'cp':'pax', opts.cp?'-al':'-rwl','.', folder_path], pwd, function(){
						return !callback|| callback();
					});
				});

			});
		});
	} else {
		exec('mkdir', [ path.join(dest,'latest') ], pwd, function(){
			exec('mkdir', [path.join(dest,folder_name)], pwd, function(){
				exec('rsync', rsync_args, pwd, function(err, resp){
			 		exec(opts.cp?'cp':'pax', [opts.cp?'-al':'-rwl','.', path.resolve(pwd, path.join(dest, folder_name))], path.resolve(pwd, path.join(dest,'latest')), function(){
			 			return !callback|| callback();
				 	});
				});
			});
		});
	}


};



var opts_list = [
	'--idkey',
	'--ignore',
	'--cp'
];

module.exports.getargs = function(argv){
	var skip = false,
	args  = argv.slice(2),
	opts = { };

	switch(args[0]){
		case 'push': case 'pull':
			opts.ssh = args.shift();
			break;
		default:
			opts.ssh = false;

	}

	
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

