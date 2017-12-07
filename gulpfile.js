const fs = require('fs-extra');
const path = require('path');
const gulp = require('gulp');
const { exec } = require('child_process');
const intercept = require('gulp-intercept');
const csso = require('gulp-csso');
const base64 = require('gulp-css-base64');
const img64 = require('gulp-img64');
const imagemin = require('gulp-imagemin');
const ob = require('gulp-javascript-obfuscator');
const htmlmin = require('gulp-htmlmin');
const util = require('gulp-util');
const header = require('gulp-header');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const md5 = require('md5');
const rename = require("gulp-rename");
const babel = require('gulp-babel');
const moment = require('moment');
const atob = require('atob');
const btoa = require('btoa');

const srcDir = `${__dirname}/app`;
const resourcesDir = `${__dirname}/resources`;
const buildDir = `${srcDir}/assets`;
const build_hash = md5(Math.random());
const build_date = Math.round(new Date().getTime() / 1000);
const pkg = require('./package.json');
const assetHeader = [
	"/*!",
	"| *  _______  _______  _______  _______  __ ",
	"| * |       ||       ||       ||       ||  |",
	"| * |  _____||_     _||   _   ||    _  ||  |",
	"| * | |_____   |   |  |  | |  ||   |_| ||  |",
	"| * |_____  |  |   |  |  |_|  ||    ___||__|",
	"| *  _____| |  |   |  |       ||   |     __ ",
	"| * |_______|  |___|  |_______||___|    |__|",
	"| * ",
	"| * This file is auto-generated and obfuscated for proprietary reasons. Attempting to edit this file as it is can break the application.",
	"| * This file is (c) 2017 Caprine Softworks. Under no circumstances are you to redistribute this file.",
	`| * ${build_hash}@${build_date}`,
	"| */"
].join("\n");
const templateHeader = [
	"<!--",
	"	This file is (c) 2017 Caprine Softworks. Under no circumstances are you to redistribute this file.",
	`	${build_hash}@${build_date}`,
	"-->"
].join("\n");
const jsObTemplate = [
	"function r(V){",
		"V = V.split(\"\");",
		"for(var W,l=V.length,R=Math.floor(l/2)-1,U=0;R>=U;U++)W=V[l-U-1],V[l-U-1]=V[U],V[U]=W;",
		"return V.join(\"\")",
	"}",
	"var s = \"%%BASE64%%\";",
	"eval(atob(r(s)));"
].join("");
const appObTemplate = [
	"var a = require('atob');",
	"function r(V){",
		"V = V.split(\"\");",
		"for(var W,l=V.length,R=Math.floor(l/2)-1,U=0;R>=U;U++)W=V[l-U-1],V[l-U-1]=V[U],V[U]=W;",
		"return V.join(\"\")",
	"}",
	"var s = \"%%BASE64%%\";",
	"eval(a(r(s)));"
].join("");


const reverse = (string) => {
	// Step 1. Create an empty string that will host the new created string
	var newString = "";

	// Step 2. Create the FOR loop
    /* The starting point of the loop will be (str.length - 1) which corresponds to the 
       last character of the string, "o"
       As long as i is greater than or equals 0, the loop will go on
       We decrement i after each iteration */
	for (var i = string.length - 1; i >= 0; i--) {
		newString += string[i]; // or newString = newString + str[i];
	}
    /* Here hello's length equals 5
        For each iteration: i = str.length - 1 and newString = newString + str[i]
        First iteration:    i = 5 - 1 = 4,         newString = "" + "o" = "o"
        Second iteration:   i = 4 - 1 = 3,         newString = "o" + "l" = "ol"
        Third iteration:    i = 3 - 1 = 2,         newString = "ol" + "l" = "oll"
        Fourth iteration:   i = 2 - 1 = 1,         newString = "oll" + "e" = "olle"
        Fifth iteration:    i = 1 - 1 = 0,         newString = "olle" + "h" = "olleh"
    End of the FOR Loop*/

	// Step 3. Return the reversed string
	return newString; // "olleh"
};


const uid = (length) => {
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
	let text = "";
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};


gulp.task('sass', () => {
	return gulp.src([
		resourcesDir + '/scss/app.scss'
	])
	.pipe(replace(/\/\*![\s\S](.*)[\s\S]\*\//gi, ''))
	.pipe(sass())
	.pipe(csso())
	.pipe(header(assetHeader))
	.pipe(gulp.dest(buildDir + '/css'));
});


gulp.task('es6', () => {
	return gulp.src([
		resourcesDir + '/js/**/**/*.js'
	])
	.pipe(replace(/\/\*![\s\S](.*)[\s\S]\*\//gi, ''))
	.pipe(babel())
	.pipe(ob())
	.pipe(intercept(file => {
		let encodedScript = reverse(btoa(file.contents));
		let evaluator = jsObTemplate.replace('%%BASE64%%', encodedScript);
		file.contents = new Buffer(evaluator, 'utf8');
		return file;
	}))
	.pipe(ob())
	.pipe(gulp.dest(`${buildDir}/js`));

});


gulp.task('app', () => {
	return gulp.src([
		'./index.js'
	])
	.pipe(replace(/\/\*![\s\S](.*)[\s\S]\*\//gi, ''))
	.pipe(babel())
	.pipe(ob())
	.pipe(intercept(file => {
		let encodedScript = reverse(btoa(file.contents));
		let evaluator = appObTemplate.replace('%%BASE64%%', encodedScript);
		file.contents = new Buffer(evaluator, 'utf8');
		return file;
	}))
	.pipe(ob())
	.pipe(gulp.dest(`./app`));

});

gulp.task('images', ['image:icons', 'image:compress']);
gulp.task('image:icons', (cb) => {
	exec('electron-icon-maker --input=./resources/img/jpegoat_icon.png --output=./resources/img', (err, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});
gulp.task('image:compress', ['image:icons'], () => {
	return gulp.src([
		'!' + resourcesDir + '/img/jpegoat_icon.png',
		resourcesDir + '/img/**/*'
	])
	.pipe(imagemin([
		imagemin.gifsicle({ interlaced: true }),
		imagemin.jpegtran({ progressive: true }),
		imagemin.optipng({ optimizationLevel: 3 }),
		imagemin.svgo({
			plugins: [
				{ removeViewBox: true },
				{ cleanupIDs: false }
			]
		})
	], { verbose: true }))
	.pipe(gulp.dest(buildDir + '/img'));
});


gulp.task('font', ['font:materialdesignicons', 'font:lato']);
gulp.task('font:materialdesignicons', () => {
	const fontDir = `${resourcesDir}/font/materialdesignicons`;
	return gulp.src([
		`${fontDir}/eot/*`,
		`${fontDir}/otf/*`,
		`${fontDir}/ttf/*`,
		`${fontDir}/woff/*`,
		`${fontDir}/woff2/*`,
		`${fontDir}/svg/*`
	])
	.pipe(gulp.dest(buildDir + '/font/materialdesignicons'));
});
gulp.task('font:lato', () => {
	const fontDir = `${resourcesDir}/font/lato`;
	return gulp.src([
		`${fontDir}/*`
	])
	.pipe(gulp.dest(buildDir + '/font/lato'));
});


gulp.task('versionAssets', () => {
	/**
	* Updates the asset's cache buster hash
	*/
	return gulp.src([
		`${srcDir}/templates/*.html`
	])
	.pipe(replace(/\.?\.\/assets\/(css|js)\/(.*)\.(css|js)(\?[a-fA-F0-9]{32,}(\@[\d]{1,12})?)?/ig, `../assets/$1/$2.$3?${build_hash}@${build_date}`))
	.pipe(gulp.dest(srcDir + "/templates"));
});


gulp.task('moveTemplates', () => {
	/**
	* Moves templates to /src/
	*/
	return gulp.src([
		`${resourcesDir}/html/*.html`
	])
	.pipe(gulp.dest(srcDir + "/templates"));
});


gulp.task('convertImages', ['versionAssets'], () => {
	/**
	* Converts static images to base64 strings
	*/
	return gulp.src([
		`${srcDir}/templates/*.html`
	])
	.pipe(img64())
	.pipe(gulp.dest(srcDir + "/templates"));
});


gulp.task('minifyTemplates', () => {
	/**
	* Minifies output HTML templates
	*/
	return gulp.src([
		`${srcDir}/templates/*.html`
	])
	.pipe(htmlmin({
		collapseWhitespace: true,
		minifyCSS: true
	}))
	.pipe(header(templateHeader))
	.pipe(gulp.dest(srcDir + "/templates"));
});


gulp.task('moveOtherFiles', () => {
	/**
	* Moves other files to the app directory
	*/
	return gulp.src([
		`./queries.json`
	])
	.pipe(gulp.dest(srcDir));
});


gulp.task('cleanup', () => {
	let directories = [
		`${buildDir}/css/`,
		`${buildDir}/../templates/`
	];

	directories.forEach(dir => {
		fs.readdir(dir, (err, files) => {
			if (err && err.code !== 'ENOENT') throw new Error(err);
			files.forEach(file => {
				fs.unlink(path.join(dir, file), (err) => {
					if (err) throw new Error(err);
					return util.log(`Cleared built file:`, file);
				});
			});
		});
	});
});


gulp.task('cleanupThumbsDB', () => {
	gulp.src([
		`./app/assets/img/**/**/*.db`,
		`./resources/img/**/**/*.db`
	])
	.pipe(intercept(file => {
		fs.unlink(file.path, () => {
			return util.log('Deleted', file.path);	
		});
	}))
});


gulp.task('processTemplates', ['minifyTemplates'], () => {
	gulp.start('convertImages');
});


gulp.task('watch', () => {
	gulp.watch('src/scss/**/*.scss', ['sass', 'versionAssets']);
	gulp.watch('src/js/**/*.js', ['es6', 'versionAssets']);
});


gulp.task('default', ['cleanup', 'cleanupThumbsDB', 'moveTemplates', 'moveOtherFiles', 'font', 'sass', 'es6', 'app'], () => {
	gulp.start('processTemplates');
	let pkg = require('./app/package.json');
	fs.writeFile(`${srcDir}/build-info.json`, JSON.stringify({
		date: moment().format('MM/DD/YY HH:mm:ss') + " CST",
		codename: pkg.name,
		version: pkg.version,
		hash: build_hash + "@" + build_date
	}), (err) => {
		if (err) throw new Error(err);
	});
});