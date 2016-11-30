'use strict';

const {Menu, Tray, shell} = require('electron');
// const shell = require('shell');

function EddystoneTrayIcon(opts) {
	opts = opts || {};

	this.trayIcon = new Tray(opts.iconForNotFound);

	if (opts.toolTip) {
		this.trayIcon.setToolTip(opts.toolTip);
	}

	if (opts.iconForPressed) {
		this.trayIcon.setPressedImage(opts.iconForPressed);
	}

	this.opts = opts;
	this.beacons = [];
	this.refresh();
}

EddystoneTrayIcon.prototype.refresh = function () {
	var contextMenu = null;

	if (this.beacons.length > 0) {
		this.trayIcon.setImage(this.opts.iconForFound);

		contextMenu = Menu.buildFromTemplate(this.beacons.map(function (beacon) {
			return {
				label: [
					beacon.url, ',', 'RX Power:',
					beacon.txPower, ',', 'RSSI',
					beacon.rssi
				].join(' '),
				click: function () {
					shell.openExternal(beacon.url);
				}
			};
		}));
	} else {
		this.trayIcon.setImage(this.opts.iconForNotFound);

		contextMenu = Menu.buildFromTemplate([{label: 'Not found'}]);
	}

	this.trayIcon.setContextMenu(contextMenu);
};

EddystoneTrayIcon.prototype.add = function (beacon) {
	this.beacons.push(beacon);
	this.refresh();
};

EddystoneTrayIcon.prototype.clear = function (beacon) {
	this.beacons = [];
	this.refresh();
};

module.exports = EddystoneTrayIcon;
