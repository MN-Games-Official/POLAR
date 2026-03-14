import { Header } from "@/components/Header";
import { PolarisKeyGenerator } from "@/components/api-keys/PolarisKeyGenerator";

export default function PolarisKeyPage() {
  return (
    <>
      <Header
        title="Polaris API key"
        description="Generate scoped access tokens for integrations consuming Polaris services."
      />
      <PolarisKeyGenerator />
    </>
  );
}
