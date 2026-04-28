import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.breathefree.omar',
  appName: 'Breathe Free',
  webDir: 'out',
  server: {
    url: 'https://breath-free-one.vercel.app/',
    cleartext: true,
    allowNavigation: ['breath-free-one.vercel.app', 'accounts.google.com', '*.google.com', '*.googleapis.com']
  },
  android: {
    allowMixedContent: true,
    overrideUserAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
  }
};

export default config;
