Cordova usb hid plugin for android

# Thanks
this plugin is a merge of two existing plugin and some features which I needed to communicate for Hid.

    https://www.npmjs.com/package/cordova-plugin-usbserial

    https://github.com/noconsulting/cordova-plugin-hid-usb/blob/master/src/android/fr/noconsulting/UsbHid.java


# Usage

add the plugin to cordova:

    cordova plugin add https://github.com/tijmenvangulik/cordova-usb-hid.git

or npm : 
  https://www.npmjs.com/package/cordova-plugin-usb-hid

# Example

In this example I open an read/write connection with 121 package size. The data is csafe specific replace it with data for your device. The example picks the first device. You could do here more complex filtering.

using async await with a callback continously reading the data

```typescript

    await cordova.plugins.UsbHid.registerReadCallback((response)=>{
                console.log("received "+buf2hex(response));
    });
    var devices=await cordova.plugins.UsbHid.enumerateDevices();
    if (devices.length==0) throw "Device not found";
    await cordova.plugins.UsbHid.requestPermission(devices[0]);
    await cordova.plugins.UsbHid.open({
                                  packetSize:121,
                                  skippFirstByteZero:true,
                                  writeTimeout:500});
    var data= new Uint8Array([0x02,0xF0,0xFD,0x00,0x80,0x80,0xF2]);
    await cordova.plugins.UsbHid.write(data)
    
```

using async await and a writeRead routine sending one package and waiting for the result.

```typescript

    var devices=await cordova.plugins.UsbHid.enumerateDevices();
    if (devices.length==0) throw "Device not found";
    await cordova.plugins.UsbHid.requestPermission(devices[0]);
    await cordova.plugins.UsbHid.open({
                                  packetSize:121,
                                  skippFirstByteZero:true,
                                  writeTimeout:500,
                                  readTimeout:1000});
    var data= new Uint8Array([0x02,0xF0,0xFD,0x00,0x80,0x80,0xF2]);
    var response = await cordova.plugins.UsbHid.writeRead(data);
    console.log("received "+buf2hex(response));;
    
```

same example using promises and an read callback handler

```typescript

    cordova.plugins.UsbHid.registerReadCallback((response)=>{
                console.log("received "+buf2hex(response));
    }).then(()=>{
        return cordova.plugins.UsbHid.enumerateDevices();
    }).then((devices)=>{
        console.log("Devices :"+JSON.stringify(devices));
        if (devices.length>0) 
            return cordova.plugins.UsbHid.requestPermission(devices[0]);
        else return Promise.reject("device not found");  
    }).then(()=>{
        return cordova.plugins.UsbHid.open({
                        packetSize:121,
                        skippFirstByteZero:true,
                        timeout:1000})   
    }).then(()=>{
        var data= new Uint8Array([0x02,0xF0,0xFD,0x00,0x80,0x80,0xF2]);
        cordova.plugins.UsbHid.write(data)
    }).catch((e)=>{console.error(e)});    
        
```
# Api type definitions

The typescript type definitions can be found [here](www/UsbHid.d.ts) 

# Tips and tricks

* Often the communication goes wrong when the packet size in not correct. The plugin reads the packetSize from the device. However this can be the wrong packet size. Please check de doc of your device and use the correct packet size.
* configure the device in the AndroidManifest.xml so your app is opened when the device is connected. You can configure this from the cordova config.xml. For example
```  xml
        <config-file parent="/manifest/application" target="AndroidManifest.xml">
           <meta-data android:name="android.hardware.usb.action.USB_DEVICE_ATTACHED"
                android:resource="@xml/device_filter" />
            <uses-feature android:name="android.hardware.usb.host" />
        </config-file>
        <resource-file src="device_filter.xml" target="res/xml/device_filter.xml" />
```
device_filter.xml contents:
``` xml
    <?xml version="1.0" encoding="utf-8"?>
    <resources>
        <usb-device vendor-id="6052" />
    </resources>
```
*  registerReadCallback is called on every data block which is received,
this also includes the empty blocks (all bytes zero). To not overload the main javascript thread with events I made two options to skipp these
packets in java. 
   * skippFirstByteZero (skipp when only first byte zero)
   * skippZeroResults (skipp when all bytes are zero (higher costs) )
 * The type definitons work if you have the cordova types included. If this is not the case you van manually add the cordova name space declarations:

```typescript
declare interface Cordova {
    plugins:CordovaPlugins;
}
declare interface CordovaPlugins {
    UsbHid : UsbHidPlugin;     
}  

declare var cordova: Cordova;
```
* There is not yet an special function for sending and receiving reports. However it is easy to do this using the existing functions since an report is just an package and the first byte is the report id. 
  