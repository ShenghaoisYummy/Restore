import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  // set build output directory to the API project's wwwroot folder
  // wwwroot is the default static files directory for ASP.NET Core apps
  // when we run app.UseStaticFiles() in Program.cs, it will serve the static files from the wwwroot folder
  build: {
    outDir: "../API/wwwroot",
    chunkSizeWarningLimit: 1024,
    emptyOutDir: true,
  },
  plugins: [react(), mkcert()],
});
