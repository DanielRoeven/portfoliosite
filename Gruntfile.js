module.exports = function(grunt) {

	grunt.initConfig({
		
		jshint: {
			main: {
				options: {
					esversion: 6,
				},
				src: [
					'src/js/transitions.js',
				],
			},
		},

		babel: {
			main: {
				options: {
					sourceMap: false,
					presets: ["env"],
				},
				files: {
					'temp/js/transitions.js': 'src/js/transitions.js',
				},
			},
		},
		
		uglify: {
			main: {
				files: {
					'temp/js/transitions.js': 'temp/js/transitions.js',
				},
			}
		},
		
		scsslint: {
			allFiles: ['src/sass/*.scss'],
			options: {
				config: 'src/sass/scss-lint.yml',
				colorizeOutput: true,
			},
		},


		sass: {
			dist: {
				options: {
					sourcemap: 'none',
					style: 'compressed',
				},
				files: {
					'temp/css/style.css': 'src/sass/style.scss',
				},
			},
			dev: {
				options: {
					sourcemap: 'none'
				},
				files: {
					'temp/css/style.css': 'src/sass/style.scss',
				},
			},
		},

		processhtml: {
			main: {
				files: {
					'temp/html/index.html': 'src/index.html',
					'temp/html/work.html': 'src/work.html',
					'temp/html/about.html': 'src/about.html',
					'temp/html/contact.html': 'src/contact.html',
					'temp/html/articles.html': 'src/articles.html',
				},
			}
		},
		
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					conservativeCollapse: true,
				},
				files: {
					'dist/index.html': 'temp/html/index.html',
					'dist/work.html': 'temp/html/work.html',
					'dist/about.html': 'temp/html/about.html',
					'dist/contact.html': 'temp/html/contact.html',
					'dist/articles.html': 'temp/html/articles.html',
				},
			},
			dev: {
				files: {
					'dev/index.html': 'temp/html/index.html',
					'dev/work.html': 'temp/html/work.html',
					'dev/about.html': 'temp/html/about.html',
					'dev/contact.html': 'temp/html/contact.html',
					'dev/articles.html': 'temp/html/articles.html',
				},
			},
		},
		
		copy: {
			dist: {
				files: [
					{expand: true, cwd: 'src/', src: 'fonts/**', dest: 'dist/'},
					{expand: true, cwd: 'src/', src: 'img/**', dest: 'dist/'},
				]
			},
			dev: {
				files: [
					{expand: true, cwd: 'src/', src: 'fonts/**', dest: 'dev/'},
					{expand: true, cwd: 'src/', src: 'img/**', dest: 'dev/'},
				]
			}
		},
				
		watch: {
			scripts: {
				files: ['src/*', 'src/*/*', 'src/*/*/*'],
				tasks: ['dev'],
				options: {
					spawn: false,
				},
			},
		},
		
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-scss-lint');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('dist', [
		'jshint',
		'babel',
		'uglify',
		'scsslint',
		'sass:dist',
		'processhtml',
		'htmlmin:dist',
		'copy:dist'
	]);
	grunt.registerTask('dev', [
		'jshint',
		'babel',
		'scsslint',
		'sass:dev',
		'processhtml',
		'htmlmin:dev',
		'copy:dev',
	]);
};