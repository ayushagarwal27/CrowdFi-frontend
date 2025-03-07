import "./globals.css";
import { ClusterProvider } from "@/components/cluster/cluster-data-access";
import { SolanaProvider } from "@/components/solana/solana-provider";
import { UiLayout } from "@/components/ui/ui-layout";
import { ReactQueryProvider } from "./react-query-provider";

export const metadata = {
  title: "template-next-tailwind-basic",
  description: "Generated by create-solana-dapp",
};

const links: { label: string; path: string }[] = [
  { label: "All Campaigns", path: "/all" },
  { label: "My Campaigns", path: "/myCampaign" },
  // { label: "My Donations", path: "/donations" },
  { label: "Create Campaign", path: "/create" },
  { label: "Create Config", path: "/config" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <UiLayout links={links}>{children}</UiLayout>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
