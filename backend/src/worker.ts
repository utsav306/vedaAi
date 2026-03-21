import { connectMongo } from "./db/connect";
import { generationWorker } from "./workers/generationWorker";
import { pdfWorker } from "./workers/pdfWorker";

async function bootstrapWorker(): Promise<void> {
  await connectMongo();

  console.log("Workers started:", generationWorker.name, pdfWorker.name);
}

bootstrapWorker().catch((error) => {
  console.error("Failed to bootstrap workers", error);
  process.exit(1);
});
