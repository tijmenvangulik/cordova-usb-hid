declare namespace cordova_usb_hid {
    type ErrorCallBack = (e: any) => void;
    type VoidCallBack = () => void;
    type ReadCallBack = (data: ArrayBuffer) => void;
    interface UsbHidDevice {
        name: string;
        vendorId: string;
        productId: string;
        serialNumber: string;
        productName: string;
    }
    type UsbHidDevices = UsbHidDevice[];
    interface PermissonOptions {
    }
    interface OpenOptions {
        packetSize?: number;
        skippZeroResults?: boolean;
        skippFirstByteZero?: boolean;
        readTimeout?: number;
        writeTimeout?: number;
    }
    interface WriteOptions {
        packetsize?: number;
        writeTimeout?: number;
    }
    interface WriteReadOptions {
        packetsize?: number;
        readTimeout?: number;
        writeTimeout?: number;
    }
    interface GetFeatureOptions {
        reportId?: number;
        packetsize?: number;
        readTimeout?: number;
    }
    interface SetFeatureOptions {
        reportId?: number;
        packetsize?: number;
        writeTimeout?: number;
    }
    class UsbHidPlugin {
        enumerateDevices(): Promise<UsbHidDevices>;
        requestPermission(device: UsbHidDevice): Promise<void>;
        open(opts?: OpenOptions): Promise<void>;
        write(data: ArrayBuffer, opts?: WriteOptions): Promise<void>;
        writeRead(data: ArrayBuffer, opts?: WriteReadOptions): Promise<ArrayBuffer>;
        close(): Promise<void>;
        registerReadCallback(readCallback: ReadCallBack): Promise<ArrayBuffer>;
        getFeatureReport(opts?: GetFeatureOptions): Promise<ArrayBuffer>;
        setFeatureReport(data: ArrayBuffer, opts?: SetFeatureOptions): Promise<void>;
    }
}
interface CordovaPlugins {
    UsbHid: cordova_usb_hid.UsbHidPlugin;
}
