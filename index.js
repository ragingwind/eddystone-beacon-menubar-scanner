'use strict';

const app = require('app');
const Menu = require('menu');
const Tray = require('tray');
const scanner = require('eddystone-beacon-scanner');

// report crashes to the Electron project
require('crash-reporter').start();

// enable debug window
require('electron-debug')();

function EddystoneTrayIcon(opts) {
	opts = opts || {};

	if (!opts.icon) {
		throw new Error('Eddystone tray icon must be exist');
	}

	this.trayIcon = new Tray(opts.icon);

	if (opts.toolTip) {
		this.trayIcon.setToolTip(opts.toolTip);
	}

	if (opts.iconForPressed) {
		this.trayIcon.setPressedImage(opts.iconForPressed);
	}

	this.beacons = [];
	this.refresh();
}

EddystoneTrayIcon.prototype.refresh = function () {
	var contextMenu = null;

	if (this.beacons.length > 0) {
		contextMenu = Menu.buildFromTemplate(this.beacons.map(function(beacon) {
			return {
				label: [
					beacon.url, ',', 'RX Power:',
					beacon.txPower, ',', 'RSSI',
					beacon.rssi
				].join(' ')
			};
		}));
	} else {
		contextMenu = Menu.buildFromTemplate([{label: 'Not found'}]);
	}
	
	this.trayIcon.setContextMenu(contextMenu);
};

EddystoneTrayIcon.prototype.add = function (beacon) {
	this.beacons.push(beacon);
	this.refresh();
};

EddystoneTrayIcon.prototype.clear = function (beacon) {
	this.beacon = [];
	this.refresh();
};

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function () {
	app.trayIcon = new EddystoneTrayIcon({
		toolTip: 'Eddystone beacon scanner',
		icon: 'images/lighthouse-grey-16x16.png',
		iconForPressed: 'images/lighthouse-white-16x16.png'
	});
	
	scanner.on('discover', function(beacon) {
		console.log('beacon found:\b\t', beacon);
		app.trayIcon.add(beacon);
	});
	
	scanner.startScanning();
});