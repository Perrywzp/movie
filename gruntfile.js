module.exports = function(grunt){

    grunt.initConfig({
        watch:{
            jade:{
                files:['views/**'],
                options:{
                    livereload:true
                }
            },
            js:{
                files:['public/js/**','models/**/*.js','schemas/**/*.js'],
                // task:['jshint'],
                options:{
                    livereload:true
                }
            }
        },

        nodemon:{
            dev:{
                options:{
                    file:'app.js',
                    args:[],
                    ignoredFiles:['README.md','node_modules/**','.DS_Store'],
                    watchedExtensions:['js'],
                    watchedFolders:['app','config'],
                    debug:true,
                    delayTime:1,
                    env:{
                        PORT:3030
                    },
                    cwd:__dirname
                }
            }
        },

        concurrent:{
            tasks:['nodemon','watch'],
            options:{
                logConcurrentOutput:true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    //慢任务插件
    grunt.loadNpmTasks('grunt-concurrent');
    //屏蔽语法错误导致代码中断
    grunt.option('force',true);
    grunt.registerTask('default',['concurrent']);
};
