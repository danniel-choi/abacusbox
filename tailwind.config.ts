import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#040713",
        navy: "#081333",
        line: "#e6ebf2",
        paper: "#f5f7fb",
        brand: "#02b585",
        blue: "#2668ff",
        coral: "#ff7a45",
        violet: "#6d5bd0"
      },
      boxShadow: {
        panel: "0 18px 50px rgba(4, 7, 19, 0.08)",
        float: "0 24px 80px rgba(4, 7, 19, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
