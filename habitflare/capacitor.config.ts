import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.habitflare.app',
  appName: 'HabitFlare',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;