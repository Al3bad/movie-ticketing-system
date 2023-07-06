import "dotenv/config";
import { defineConfig } from "cypress";
import db from "backend/db/db";

export default defineConfig({
  screenshotsFolder: false,
  video: false,
  env: {
    apiUrl: process.env.BASE_URL + "/api",
  },
  component: {
    specPattern: ["**/*.cy.{js,jsx,ts,tsx}", "**/*.test.{js,jsx,ts,tsx}"],
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    setupNodeEvents(on, _) {
      on("task", {
        async initDB() {
          await db.init();
          return null;
        },
      });
    },
  },
});
