/** @internal */
function buf2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), function (x) { return ('00' + x.toString(16)).slice(-2); }).join('');
}
var UsbHidPlugin = /** @class */ (function () {
    function UsbHidPlugin() {
    }
    UsbHidPlugin.prototype.enumerateDevices = function () {
        return new Promise(function (successCallback, errorCallback) {
            cordova.exec(successCallback, errorCallback, 'UsbHid', 'enumerateDevices', []);
        });
    };
    UsbHidPlugin.prototype.requestPermission = function (device) {
        return new Promise(function (successCallback, errorCallback) {
            cordova.exec(successCallback, errorCallback, 'UsbHid', 'requestPermission', [{ 'opts': device }]);
        });
    };
    UsbHidPlugin.prototype.open = function (opts) {
        if (!opts)
            opts = {};
        return new Promise(function (successCallback, errorCallback) {
            cordova.exec(successCallback, errorCallback, 'UsbHid', 'open', [{ 'opts': opts }]);
        });
    };
    UsbHidPlugin.prototype.writeHex = function (data, opts) {
        var writeOpts = opts;
        if (!writeOpts)
            writeOpts = {};
        writeOpts.data = buf2hex(data);
        return new Promise(function (successCallback, errorCallback) {
            cordova.exec(successCallback, errorCallback, 'UsbHid', 'writeHex', [{ 'opts': writeOpts }]);
        });
    };
    UsbHidPlugin.prototype.close = function () {
        return new Promise(function (successCallback, errorCallback) {
            cordova.exec(successCallback, errorCallback, 'UsbHid', 'close', []);
        });
    };
    UsbHidPlugin.prototype.registerReadCallback = function (readCallback) {
        return new Promise(function (successCallback, errorCallback) {
            cordova.exec(function (value) {
                if (typeof value == "object" && value.registerReadCallback)
                    successCallback();
                else
                    readCallback(value);
            }, errorCallback, 'UsbHid', 'registerReadCallback', []);
        });
    };
    return UsbHidPlugin;
}());
/** @internal */
var exec = require('cordova/exec');
/** @internal */
var usbhid = new UsbHidPlugin();
/** @internal */
module.exports = usbhid;
