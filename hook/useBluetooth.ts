import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDevice, updateDevice } from "@actions/ble";
import { emptyDevice } from "@actions/bluetoothActions";
import { BLUETOOTH_POWERED_ON } from "@constants/bluetooth";
import { bleManager } from "@services/ble";
import { storage } from "@utils/storage";
import { SELECTED_DEVICE } from "@constants/storage";
import { BleState, Device } from "@src/types/ble";

const useBluetooth = () => {
  const [blePowerOn, setBlePowerOn] = useState(false);
  const dispatch = useDispatch();
  const device = useSelector((state: BleState) => state.ble.device);
  const [curDevice, setCurDevice] = useState(device);

  useEffect(() => {
    if (!device.id) {
      const deviceData = storage.getString(SELECTED_DEVICE);
      deviceData && setCurDevice(JSON.parse(deviceData));
    }
  }, []);

  const getPowerState = async () => {
    return (await bleManager.state()) === BLUETOOTH_POWERED_ON;
  };

  useEffect(() => {
    getPowerState().then(setBlePowerOn);

    const subcriberOnPowerState = bleManager.onStateChange((state) =>
      setBlePowerOn(state === BLUETOOTH_POWERED_ON),
    );
    return () => subcriberOnPowerState.remove();
  }, []);

  useEffect(() => {
    if (curDevice.id && curDevice.isConnected) {
      const subcriberOnDevice = bleManager.onDeviceDisconnected(
        curDevice.id,
        (error, disconnectDevice) => {
          const deviceState: Device = {
            ...disconnectDevice,
            id: disconnectDevice?.id ?? "",
            name: disconnectDevice?.name ?? undefined,
            txPowerLevel: disconnectDevice?.txPowerLevel?.toString() ?? undefined,
            isConnected: false,
            isConnecting: false,
          };
          if (error) {
            dispatch(updateDevice(deviceState));
            dispatch(setDevice(emptyDevice));
            return;
          }
          dispatch(updateDevice(deviceState));
          dispatch(setDevice(emptyDevice));
          subcriberOnDevice.remove();
        },
      );
    }
  }, [curDevice]);

  return { device: curDevice, blePowerOn };
};

export default useBluetooth;
