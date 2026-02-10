import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'build',
      assetsDir: 'static',
      sourcemap: true,
    },
    publicDir: 'public',
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    define: {
      'process.env.REACT_APP_KEYCLOAK_CLIENT_ID': JSON.stringify(env.REACT_APP_KEYCLOAK_CLIENT_ID),
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL),
      'process.env.REACT_APP_KEYCLOAK_URL': JSON.stringify(env.REACT_APP_KEYCLOAK_URL),
      'process.env.REACT_APP_KEYCLOAK_REALM': JSON.stringify(env.REACT_APP_KEYCLOAK_REALM),
    },
  };
});
