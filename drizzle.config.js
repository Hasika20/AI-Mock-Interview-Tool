import { defineConfig } from "drizzle-kit"
export default defineConfig({
	dialect: "postgresql",
	schema: "./utils/schema.js",
	out: "./drizzle",
	dbCredentials: {
		url: "postgresql://AI-Mock-Interview-Tool_owner:npg_wmzc4UkD9qMQ@ep-small-queen-a8q1k3qg-pooler.eastus2.azure.neon.tech/AI-Mock-Interview-Tool?sslmode=require",
	},
})
