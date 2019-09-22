declare type ErrorCallBack = (e: any) => void;
declare type VoidCallBack = () => void;
declare type ReadCallBack = (data: ArrayBuffer) => void;
interface UsbHidDevice {
    name: string;
    vendor: string;
    product: string;
    serial: string;
}
declare type UsbHidDevices = UsbHidDevice[];
interface PermissonOptions {
}
interface OpenOptions {
    packetSize?: number;
    timeout?: number;
    skippZeroResults?: boolean;
    skippFirstByteZero?: boolean;
}
interface WriteOptions {
    packetsize?: number;
    timeout?: number;
}
declare class UsbHidPlugin {
    enumerateDevices(): Promise<UsbHidDevices>;
    requestPermission(device: UsbHidDevice): Promise<void>;
    open(opts?: OpenOptions): Promise<void>;
    writeHex(data: ArrayBuffer, opts?: WriteOptions): Promise<void>;
    close(): Promise<void>;
    registerReadCallback(readCallback: ReadCallBack): Promise<ArrayBuffer>;
}
interface CordovaPlugins {
    UsbHid: UsbHidPlugin;
}
declare var exec: void;
declare var usbhid: UsbHidPlugin;
