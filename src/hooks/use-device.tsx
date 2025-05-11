
import { useState, useEffect } from "react";

type DeviceInfo = {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  deviceType: string;
};

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    deviceType: "desktop",
  });

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Check iOS
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    
    // Check Android
    const isAndroid = /Android/i.test(userAgent);
    
    // Check Safari
    const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
    
    // Check Chrome
    const isChrome = /Chrome/i.test(userAgent) && !/Edge/i.test(userAgent);
    
    // Determine device type
    let deviceType = "desktop";
    if (isMobile) {
      if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
        deviceType = "tablet";
      } else {
        deviceType = "mobile";
      }
    }
    
    setDeviceInfo({
      isMobile,
      isIOS,
      isAndroid,
      isSafari,
      isChrome,
      deviceType,
    });
    
    // Apply device-specific body classes for CSS targeting
    if (isMobile) document.body.classList.add('is-mobile');
    if (isIOS) document.body.classList.add('is-ios');
    if (isAndroid) document.body.classList.add('is-android');
    
  }, []);

  return deviceInfo;
}
