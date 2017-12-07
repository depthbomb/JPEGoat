# JPEGoat

Needs more JPEG. A desktop application to horribly compress your images.

This is an application I initially created for a friend on Discord as an alternative to using websites to achieve the same result. I decided to actually put some effort as a test of my current skills with Electron to make this a great meme-tool.

## Installation for development

1. Run `npm install` in both the root directory and */app/* directory.
1. Run `npm run build:full` to build the static assets and process the necessary files.
1. Run the app with `npm start`

## Project structure

This project uses a _two-package_ scheme in which there is a package for the development modules and a package for the modules required by the application. This is a structure I decided to use when I was unaware of the `prune` option for the Electron packager.

## Other

* `build:full` runs the image-related tasks and then the tasks for the remaining files. This is slower so I have provided a `build:quick` script that skips the image tasks to greatly speed up testing (assuming you've ran the image task prior).
* The processed JavaScript files are heavily obfuscated due to the project initially being closed-source. I never bothered to remove the obfuscation tasks from Gulp but it shouldn't be a problem seeing as you have access to the source files here.
* `build-info.json` is an auto-generated file that is placed in the `app` directory upon deployment. It contains some extra info about the specific build of the application including date, version, and build hash.
* Effective 12/7/2017, this project will use a versioning scheme similar to that of *BLAG Linux and GNU* where the version number will start out at a large value, such as **1000**. Major releases will move this number to the next thousand, minor changes increment it by **1**, and patches/bugfixes increment it by **0.1**. Some examples below:
	* 1057.5
	* 1105.39
	* 2000.12