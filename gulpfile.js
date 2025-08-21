const path = require('path');
const { task, src, dest } = require('gulp');
const fs = require('fs');

task('build:icons', copyIcons);

function copyIcons() {
	const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
	const nodeDestination = path.resolve('dist', 'nodes');

	// Copy node icons
	src(nodeSource).pipe(dest(nodeDestination));

	// Only copy credential icons if credentials folder exists
	const credPath = path.resolve('credentials');
	if (fs.existsSync(credPath)) {
		const credSource = path.resolve('credentials', '**', '*.{png,svg}');
		const credDestination = path.resolve('dist', 'credentials');
		return src(credSource).pipe(dest(credDestination));
	}

	return Promise.resolve();
}
