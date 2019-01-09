#!/usr/bin/env node
/**
 * Module dependencies.
 */
const program = require('commander');
const cmd = require('node-cmd');
const pjson = require('./package.json');

const HOME = '/home/cvasquez/';

program
    .version(pjson.version, '-v, --version');

program
    .command('commit')
    .description('adds files and perform a commit')
    .action(function(repo, options){
        cmd.get(
            `
               git add *
               git commit -m 'automatic commit'
            `,
            function(err, data, stderr){
                if (!err) {
                    console.log(data)
                } else {
                    console.log('error',err)
                }
            }
        );
    });


program
    .command('where')
    .description('shows the remote')
    .action(function(repo, options){
        cmd.get(
            `
               git remote -v
            `,
            function(err, data, stderr){
                if (!err) {
                    console.log(data)
                } else {
                    console.log('error',err)
                }
            }
        );
    });

program
    .command('clone <repository>')
    .description('clone a repo from github')
    .action(function(repo, options){

        if (repo.startsWith("https://github.com")){
            let destinationDir = repo.replace('https://', HOME).replace('.git', '');
            cloneDir(repo, destinationDir);
        } else if (repo.startsWith("git@gitlab.ilabt.imec.be")) {
            let destinationDir = repo.replace('git@', HOME).replace('.git', '');
            cloneDir(repo, destinationDir);
        } else {
            throw Error("Only from github or gitlab");
        }
    });

function cloneDir(repo, destinationDir) {
    let userDir = pop(destinationDir);
    console.log(`cloning into:\n${destinationDir}`);
    cmd.get(
        `
            mkdir -p ${userDir}
            cd ${userDir}
            git clone ${repo}
            cd ${destinationDir}
            `,
        function (err, data, stderr) {
            if (!err) {
                console.log('Done\n', data);
            } else {
                console.log('error', err);
            }
        }
    );
}


function pop(string){
    return string.substr(0, string.lastIndexOf('/'));
}
program
    .command('*')
    .action(function(command){
        console.log('command %s not recognized (ggit --help)',command);
    });

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parse(process.argv);