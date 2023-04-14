import { Card, Page, Layout, EmptyState } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Page title="Recipe Generator" fullWidth divider>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <EmptyState
              heading="This where you'll manage your recipes"
              action={{
                content: "Update Recipe Prompt",
                onAction: () => navigate("/manage-prompt"),
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>
                You can create a new Mix & Match Product or edit existing ones
              </p>
            </EmptyState>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
