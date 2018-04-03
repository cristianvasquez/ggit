#!/usr/bin/env node
/**
 * Module dependencies.
 */
const program = require('commander');
const cmd = require('node-cmd');
const pjson = require('./package.json');

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
        if (!repo.startsWith("https://github.com")){
            throw Error("Only from github");
        }
        let dir = pop(repo).replace('https://','/home/cvasquez/');
        console.log(dir);
        cmd.get(
            `
            mkdir -p ${dir}
            cd ${dir}
            git clone ${repo}
            ls
            `,
            function(err, data, stderr){
                if (!err) {
                    console.log('Done:\n',data)
                } else {
                    console.log('error',err)
                }
            }
        );
    });

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