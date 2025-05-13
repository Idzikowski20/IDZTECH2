
import { useState, useEffect } from "react";

type DeviceInfo = {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  deviceType: string;
  connection: {
    effectiveType: string;
    saveData: boolean;
  };
};

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    deviceType: "desktop",
    connection: {
      effectiveType: "4g", // Default to fast connection
      saveData: false
    }
  });

  useEffect(() => {
    const detectDevice = () => {
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
      
      // Get network information
      const connection = {
        effectiveType: "4g",
        saveData: false
      };
      
      if ('connection' in navigator) {
        const networkInfo = (navigator as any).connection;
        if (networkInfo) {
          connection.effectiveType = networkInfo.effectiveType || "4g";
          connection.saveData = networkInfo.saveData || false;
        }
      }
      
      setDeviceInfo({
        isMobile,
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        deviceType,
        connection
      });
      
      // Apply device-specific body classes for CSS targeting
      if (isMobile) document.body.classList.add('is-mobile');
      if (isIOS) document.body.classList.add('is-ios');
      if (isAndroid) document.body.classList.add('is-android');
      if (connection.saveData) document.body.classList.add('save-data');
      
      // Apply connection-specific optimizations
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        document.body.classList.add('slow-connection');
      }
    };
    
    detectDevice();
    
    // Handle orientation change for iOS/Android
    const handleOrientationChange = () => {
      // Timeout needed for some mobile browsers
      setTimeout(detectDevice, 100);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
}

// Helper hook for checking slow connections
export function useIsSlowConnection() {
  const { connection } = useDeviceDetection();
  return connection.effectiveType === '2g' || 
         connection.effectiveType === 'slow-2g' ||
         connection.saveData;
}

// Helper hook for detecting iOS Safari specifically (which has unique rendering issues)
export function useIsiOSSafari() {
  const { isIOS, isSafari } = useDeviceDetection();
  return isIOS && isSafari;
}
