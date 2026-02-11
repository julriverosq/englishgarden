import { AzureOpenAI } from "openai";

// Fallback to prevent build crashes
const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.startsWith('http')
    ? process.env.AZURE_OPENAI_ENDPOINT
    : "https://placeholder.openai.azure.com";

const apiKey = process.env.AZURE_OPENAI_API_KEY || "placeholder-key";
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4";
const apiVersion = "2024-02-15-preview";

if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_API_KEY) {
    console.warn("Azure OpenAI endpoint or API key is missing or invalid in localized env.");
}

export const openaiClient = new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment: deploymentName,
    dangerouslyAllowBrowser: true // Be careful with this if using client-side, but usually we use API routes
});
// Note: dangerouslyAllowBrowser is needed if using this client in browser, 
// but we only use it in API routes (Node.js). 
// However, next build might try to bundle it if referenced in client code.
// Ideally, this file should only be imported in server components/routes.

export const deploymentId = deploymentName;
