Cordova usb hid plugin for android

# thanks
this plugin is a merge of two existing plugin and some features which I needed to communicate for Hid.

    https://www.npmjs.com/package/cordova-plugin-usbserial

    https://github.com/noconsulting/cordova-plugin-hid-usb/blob/master/src/android/fr/noconsulting/UsbHid.java

add the plugin to cordova:

    cordova plugin add https://github.com/tijmenvangulik/cordova-usb-hid.git

# usage

In this example I open an read/write connection with 121 package size. The data is csafe specific replace it with data for your device. The example code could be simplyfied by using async await. 

```javascript
    var errorHandler=(e)=>{console.error(e)};
    cordova.plugins.UsbHid.registerReadCallback((response)=>{
                console.log("received "+buf2hex(response));
    })
    .then(()=>{
        cordova.plugins.UsbHid.enumerateDevices()
        .then(devices=>{
            console.log("Devices :"+JSON.stringify(devices));
            if (devices.length>0) {
                cordova.plugins.UsbHid.requestPermission(devices[0])
                .then(()=>{
                    cordova.plugins.UsbHid.open({
                        packetSize:121,
                        skippFirstByteZero:true,
                        timeout:1000})                        
                    .then(()=>{                         
                        var data= new Uint8Array([0x02,0xF0,0xFD,0x00,0x80,0x80,0xF2]);
                        cordova.plugins.UsbHid.writeHex(data)
                        .catch(errorHandler);
                    }).catch(errorHandler);
                }).catch(errorHandler);
            }
        }).catch(errorHandler);
    }).catch(errorHandler);
```

# Tips and tricks
* Often the communication goes wrong when the packet size in not correct. The plugin reads the packetSize from the device. However this can be the wrong packet size. Please check de doc of your device and use the correct packet size.
* configure the device in the AndroidManifest.xml so your app is opened when the device is connected. You can configure this from the cordova config.xml. For example
```  xml
        <config-file parent="/manifest/application" target="AndroidManifest.xml">
           <meta-data android:name="android.hardware.usb.action.USB_DEVICE_ATTACHED"
                android:resource="@xml/device_filter" />
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