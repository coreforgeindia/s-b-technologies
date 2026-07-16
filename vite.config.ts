import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT || "5173";

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || "/";

function emailApiPlugin() {
  return {
    name: "email-api-plugin",
    configureServer(server: any) {
      server.middlewares.use("/api/contact", async (req: any, res: any) => {
        const { handleContactForm } = await import("./src/lib/email-router");
        await handleContactForm(req, res);
      });
    },
    configurePreviewServer(server: any) {
      server.middlewares.use("/api/contact", async (req: any, res: any) => {
        const { handleContactForm } = await import("./src/lib/email-router");
        await handleContactForm(req, res);
      });
    },
  };
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.SMTP_HOST) process.env.SMTP_HOST = env.SMTP_HOST;
  if (env.SMTP_PORT) process.env.SMTP_PORT = env.SMTP_PORT;
  if (env.SMTP_SECURE) process.env.SMTP_SECURE = env.SMTP_SECURE;
  if (env.SMTP_USER) process.env.SMTP_USER = env.SMTP_USER;
  if (env.SMTP_PASS) process.env.SMTP_PASS = env.SMTP_PASS;

  return {
    base: basePath,
    plugins: [
      react(),
      tailwindcss(),
      runtimeErrorOverlay(),
      emailApiPlugin(),
      ...(process.env.NODE_ENV !== "production" &&
      process.env.REPL_ID !== undefined
        ? [
            await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer({
                root: path.resolve(import.meta.dirname, ".."),
              }),
            ),
            await import("@replit/vite-plugin-dev-banner").then((m) =>
              m.devBanner(),
            ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "out"),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort: true,
      host: "0.0.0.0",
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
