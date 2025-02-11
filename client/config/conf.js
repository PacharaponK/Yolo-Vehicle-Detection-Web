const conf = {
    appName: "Yolo",
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
    environment: process.env.NODE_ENV || "development",
    featureFlags: {
      enableExperimentalFeature: process.env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURE === "true",
    },
  };
  
  export default conf;
  