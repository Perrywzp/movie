module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'public/js/<%= pkg.name %>.js',
        dest: 'build/js/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      jade: {
        files: ['views/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
        // task:['jshint'],
        options: {
          livereload: true
        }
      }
    },

    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolders: ['app', 'config'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3030
          },
          cwd: __dirname
        }
      }
    },

    mochaTest:{
      options:{
        reporter: 'spec'
      },
      src:['test/**/*.js']
    },

    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-livereload');
  // 可以监控特定的文件，在添加文件、修改文件、或者删除文件的时候自动执行自定义的任务
  grunt.loadNpmTasks('grunt-contrib-watch');
  // 自动重启项目工程，node 有一个 npm 模块 supervisior 也是用来监控进程的，不过除了
  //supervisior 外，还有很多其他的工具，从 github 的评分上看，比较热门的有
  //forever，nodemon，node-dev，具体这些工具的区别可以参考这篇文章 Comparison: Tools to
  //Automate Restarting Node.js Server After Code Changes ，个人觉得在开发环境还是用
  //nodemon，因为配置比较方便，文档也很清晰。
  grunt.loadNpmTasks('grunt-nodemon');
  //并发运行缓慢的任务就像Coffee和Sass， 可以显著改善您的构建时间。如果要一次运行nodmon和watch，grunt-concurrent这个插件是很有用的。
  grunt.loadNpmTasks('grunt-concurrent');

  // 加载mocha任务模块
  grunt.loadNpmTasks('grunt-mocha-test');
  //屏蔽语法错误导致代码中断
  grunt.option('force', true);
  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('test',['mochaTest']);
};
