'use strict';

const {app} = require('electron');
const scanner = require('eddystone-beacon-scanner');
const EddystoneTrayIcon = require('./eddystone-trayicon');
const SCANNING_INTERVAL = 1000 * 30;

app.on('window-all-closed', function () {
	clearTimeout(app.scanTimer);

	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function () {
	app.trayIcon = new EddystoneTrayIcon({
		toolTip: 'Eddystone beacon scanner',
		iconForNotFound: 'images/lighthouse-grey-16x16.png',
		iconForFound: 'images/lighthouse-black-16x16.png',
		iconForPressed: 'images/lighthouse-white-16x16.png'
	});

	scanner.on('found', function(beacon) {
		console.log('beacon has been found:', beacon.url);
		app.trayIcon.add(beacon);
	});

	scanner.on('updated', function(beacon) {
		console.log('beacon has been update:', beacon.url);
		app.trayIcon.add(beacon);
	});

	scanner.on('lost', function(beacon) {
		console.log('beacon has been lost:', beacon);
		app.trayIcon.clear();
	});

	scanner.startScanning();

	app.scanTimer = setInterval(function () {
		console.log('Start beacon scanning');
		app.trayIcon.clear();
		scanner.startScanning();
	}, SCANNING_INTERVAL);
});
