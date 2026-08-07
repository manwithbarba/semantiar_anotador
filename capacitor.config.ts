import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ar.org.semantiar.app',
  appName: 'SemantIAr App',
  webDir: 'dist/semantiar-anotador/browser',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
};

export default config;
