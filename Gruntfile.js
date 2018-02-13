module.exports = function(grunt) {

	grunt.initConfig({

		processhtml: {
			dist: {
				files: {
					'dist/index.html': 'src/index.html',
				},
			},
			dev: {
				files: {
					'dev/index.html': 'src/index.html',
				},
			},
		},

		sass: {
			dist: {
				options: {
					sourcemap: 'none'
				},
				files: {
					'temp/landing.css': 'src/sass/landing.scss'
				},
			},
			dev: {
				options: {
					sourcemap: 'none'
				},
				files: {
					'temp/landing.css': 'src/sass/landing.scss'
				},
			},
		},
		
		watch: {
			scripts: {
				files: ['src/*', 'src/*/*'],
				tasks: ['dev'],
				options: {
					spawn: false,
					livereload: true,
				},
			},
		},
	});

	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('dist', [
		'sass:dist',
		'processhtml:dist',
	]);
	grunt.registerTask('dev', [
		'sass:dev',
		'processhtml:dev',
	]);
};