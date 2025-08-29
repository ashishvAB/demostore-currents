import { CurrentsConfig } from "@currents/playwright";

const config: CurrentsConfig = {
  recordKey: process.env.CURRENTS_RECORD_KEY || "your-record-key",
  projectId: process.env.CURRENTS_PROJECT_ID || "currents-project-id"
};

export default config;