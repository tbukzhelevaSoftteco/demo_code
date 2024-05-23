import { useEffect, useState } from "react";
import { bleManager } from "@services/ble";
import { storage } from "@utils/storage";
import { SELECTED_DEVICE } from "@constants/storage";

const useBluetoothConnected = () => {
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);

  useEffect(() => {
    const getDevice = async () =>{
      const deviceJson = await storage.getString(SELECTED_DEVICE);
        const deviceID = deviceJson && JSON.parse(deviceJson).id;
        if(deviceJson && deviceID) {
          const isConnected = await bleManager.isDeviceConnected(deviceID);
          setIsDeviceConnected(isConnected)
        }
      }
      getDevice()
  }, []);

  return { isDeviceConnected };
};

export default useBluetoothConnected;
