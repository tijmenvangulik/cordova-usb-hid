
type ErrorCallBack = (e: any)=>void;
type VoidCallBack = ()=>void;
type ReadCallBack = (data : ArrayBuffer)=>void;
interface UsbHidDevice {
    name : string;
    vendor : string;
    product : string;
    serial : string;

}
type UsbHidDevices = UsbHidDevice[];
interface PermissonOptions {

}
interface OpenOptions {
    packetSize? : number;
    timeout?: number;
    skippZeroResults? : boolean;
    skippFirstByteZero? : boolean
}
interface WriteOptions {
    packetsize? : number;
    timeout? : number;
}        
/** @internal */   
function buf2hex(buffer : ArrayBuffer) : string { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

class UsbHidPlugin {
    public enumerateDevices() : Promise<UsbHidDevices> {
        return new Promise((successCallback,errorCallback)=>{
            cordova.exec(
                successCallback,
                errorCallback,
                'UsbHid',
                'enumerateDevices',
                []
            );
        })        
    }
    public requestPermission(device : UsbHidDevice) : Promise<void>{
        return new Promise((successCallback,errorCallback)=>{
            cordova.exec(
                successCallback,
                errorCallback,
                'UsbHid',
                'requestPermission',
                [{'opts': device}]
            );
        })
        
    }
    public open(opts? : OpenOptions) : Promise<void> {
        if (!opts) opts={};
        return new Promise((successCallback,errorCallback)=>{
            cordova.exec(
                successCallback,
                errorCallback,
                'UsbHid',
                'open',
                    [{'opts': opts}]
            );
        })
        
    }
    
    public writeHex(data : ArrayBuffer,opts? : WriteOptions) : Promise<void> {
        var writeOpts : any=opts;
        if (!writeOpts) writeOpts={};
        
        writeOpts.data=buf2hex(data);
        return new Promise((successCallback,errorCallback)=>{
            cordova.exec(
                successCallback,
                errorCallback,
                'UsbHid',
                'writeHex',
                [{'opts': writeOpts}]
            );
        });
        
    }
    
    public close() : Promise<void> {
        return new Promise((successCallback,errorCallback)=>{
            cordova.exec(
                successCallback,
                errorCallback,
                'UsbHid',
                'close',
                []
            );
        })
        
    }
    public registerReadCallback(readCallback : ReadCallBack): Promise<ArrayBuffer> {
        return new Promise((successCallback,errorCallback)=>{
            cordova.exec(
                (value)=>{
                    if (typeof value == "object" && value.registerReadCallback) 
                       successCallback();
                    else readCallback(value);
                },
                errorCallback,
                'UsbHid',
                'registerReadCallback',
                []
            );
        });
        
    }
}


interface CordovaPlugins {
    UsbHid : UsbHidPlugin;     
}   

var exec = require('cordova/exec');
var usbhid = new UsbHidPlugin();
module.exports = usbhid;
