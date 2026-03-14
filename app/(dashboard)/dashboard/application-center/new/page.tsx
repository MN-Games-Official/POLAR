import { Header } from "@/components/Header";
import { ApplicationBuilder } from "@/components/applications/ApplicationBuilder";

export default function NewApplicationPage() {
  return (
    <>
      <Header
        title="New application"
        description="Compose a new assessment manually or seed it with Polaris AI."
      />
      <ApplicationBuilder />
    </>
  );
}
