import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ar.org.semantiar.app',
  appName: 'SemantIAr App',
  webDir: 'dist/semantiar-anotador/browser',
  server: {
    androidScheme: 'https',
  },
};

export default config;
