// Network configuration utility
export const getNetworkConfig = () => {
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1');
  
  const isNetwork = typeof window !== 'undefined' && 
    window.location.hostname.startsWith('192.168');
  
  return {
    isLocalhost,
    isNetwork,
    isDevelopment: process.env.NODE_ENV === 'development',
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
    port: typeof window !== 'undefined' ? window.location.port : 'unknown',
    protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
  };
};

// CSS class helper untuk network-specific styling
export const getNetworkClasses = () => {
  const config = getNetworkConfig();
  
  if (config.isNetwork) {
    return {
      container: 'network-container',
      card: 'network-card',
      button: 'network-button',
      text: 'network-text',
    };
  }
  
  return {
    container: '',
    card: '',
    button: '',
    text: '',
  };
};

// Debug helper
export const logNetworkInfo = () => {
  if (typeof window !== 'undefined') {
    const config = getNetworkConfig();
    console.log('🌐 Network Configuration:', {
      hostname: config.hostname,
      port: config.port,
      protocol: config.protocol,
      isLocalhost: config.isLocalhost,
      isNetwork: config.isNetwork,
      isDevelopment: config.isDevelopment,
    });
  }
};
