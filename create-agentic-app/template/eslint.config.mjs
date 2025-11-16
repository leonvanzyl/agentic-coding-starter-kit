import nextConfig from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [".next/**", "node_modules/**", ".cache/**", "dist/**", "build/**"],
  },
  ...nextConfig,
];

export default config;
