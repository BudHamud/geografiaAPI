import "dotenv/config";

export const config = {
  url: process.env.URL || 'http://localhost:',
  port: process.env.PORT || 8080,
  cloudName: process.env.CLOUD_NAME,
  cloudKey: process.env.CLOUD_API_KEY,
  cloudSecret: process.env.CLOUD_SECRET,
  mongoURI: process.env.MONGO_URL
};

export default config;