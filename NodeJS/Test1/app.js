var express = require('express');
var app = express();

var fs = require('fs');

var ds = require('drivelist-scanner');

const si = require('systeminformation');
const os = require('os');

const drivelist = require('drivelist');

app.get('/', function(req, res){
    res.send('Hello Word!...');
});

app.get('/sysinfo', function(req, res){
    res.send(getSystemInfo());
});

app.listen(3000, function(){
    console.log('Application is listening on port 3000.');
});

function getSystemInfo(){
    var result = 'getSystemInfo...';

    /*si.cpu(function(data) {

        result = data;
        console.log('CPU-Information:');
        console.log(data);
    });

    si.fsSize(function(data) {

        console.log('File System:');
        console.log(data);
    });

    si.blockDevices(function(data) {

        console.log('Drives:');
        console.log(data);
    });*/
    
    //result = si.time();

    /*var path = 'c:\\Manish\\Daily Status.docx';

    fs.stat(path, function(err, stats) {
        console.log(path);
        console.log();
        console.log(stats);
        console.log();
     
        if (stats.isFile()) {
            console.log('    file');
        }
        if (stats.isDirectory()) {
            console.log('    directory');
        }
     
        console.log('    size: ' + stats["size"]);
        console.log('    mode: ' + stats["mode"]);
        console.log('    others eXecute: ' + (stats["mode"] & 1 ? 'x' : '-'));
        console.log('    others Write:   ' + (stats["mode"] & 2 ? 'w' : '-'));
        console.log('    others Read:    ' + (stats["mode"] & 4 ? 'r' : '-'));
     
        console.log('    group eXecute:  ' + (stats["mode"] & 10 ? 'x' : '-'));
        console.log('    group Write:    ' + (stats["mode"] & 20 ? 'w' : '-'));
        console.log('    group Read:     ' + (stats["mode"] & 40 ? 'r' : '-'));
     
        console.log('    owner eXecute:  ' + (stats["mode"] & 100 ? 'x' : '-'));
        console.log('    owner Write:    ' + (stats["mode"] & 200 ? 'w' : '-'));
        console.log('    owner Read:     ' + (stats["mode"] & 400 ? 'r' : '-'));
     
     
        console.log('    file:           ' + (stats["mode"] & 0100000 ? 'f' : '-'));
        console.log('    directory:      ' + (stats["mode"] & 0040000 ? 'd' : '-'));
    });*/

    /*get_win_drives(function(data){ 
                        console.log('Success...'); 
                        console.log(data);

                        var stat = fs.statSync("" + data[0] + "/");

                        console.log(stat);
                    },
                    function(){
                        console.log('Error...');
                    });*/

    drivelist.list((error, drives) => {
                    if (error) {
                        throw error;
                    }
                       
                    console.log(drives);
                });
                      
    var path = 'C:/';

    fs.readdir(path, function(err, stats) {
        console.log(stats);
    });

    var files = fs.readdirSync(path);

    var stat = fs.statSync("" + path + "/" + files[0]);

    return result;
}

/**
 * Get windows drives
 * */
function get_win_drives(success_cb,error_cb){
    var stdout = '';
    var spawn = require('child_process').spawn,
            list  = spawn('cmd');

    list.stdout.on('data', function (data) {
        stdout += data;
    });

    list.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    list.on('exit', function (code) {
        if (code == 0) {
            console.log(stdout);
            var data = stdout.split('\r\n');
            data = data.splice(4,data.length - 7);
            data = data.map(Function.prototype.call, String.prototype.trim);
            success_cb(data);
        } else {
            console.log('child process exited with code ' + code);
            error_cb();
        }
    });
    list.stdin.write('wmic logicaldisk get caption\n');
    list.stdin.end();
}