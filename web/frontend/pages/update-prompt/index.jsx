import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Frame,
  Loading,
  Page,
  Stack,
  TextField,
} from "@shopify/polaris";
import { useFetch } from "../../hooks";

const UpdatePrompt = () => {
  const [inputState, setInputState] = useState(false);
  const [value, setValue] = useState("");

  const { fetchData, data, error, loading } = useFetch();
  const {
    fetchData: updatePromptFetch,
    data: updatePromptData,
    error: updatePromptError,
    loading: updatePromptLoading,
  } = useFetch();

  useEffect(() => {
    fetchData("/api/prompt");
  }, []);

  useEffect(() => {
    if (data?.prompt) {
      setValue(data.prompt);
      setInputState(false);
    }
    if (updatePromptData?.prompt) {
      setValue(updatePromptData.prompt);
      setInputState(false);
    }
  }, [
    data,
    updatePromptData,
    loading,
    updatePromptLoading,
    error,
    updatePromptError,
  ]);

  return (
    <Frame>
      <Page
        breadcrumbs={[{ content: "StorePages", url: "/" }]}
        title="Manage prompt"
        fullWidth
        divider
      >
        {loading && <Loading />}
        <Card sectioned>
          <Stack vertical>
            <TextField
              multiline={4}
              disabled={!inputState || updatePromptLoading || loading}
              value={value}
              onChange={(eValue) => setValue(eValue)}
            />
            <Stack>
              <span style={{ color: "grey" }}>
                <span style={{ fontWeight: "bold" }}>Please Note : </span>
                <span>
                  The placeholders{" "}
                  {"<diets>, <servings>, <foodType>, <ingredients>"} will be
                  decoded in the App by the customers input in the frontend. Use
                  all placeholders for better result.
                </span>
              </span>
            </Stack>
            <Stack>
              <Button
                onClick={() => setInputState(!inputState)}
                disabled={loading || updatePromptLoading}
                primary={!inputState}
              >
                Edit
              </Button>
              <Button
                primary
                onClick={() =>
                  updatePromptFetch("/api/prompt", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: value }),
                  })
                }
                disabled={loading || !inputState}
                loading={updatePromptLoading}
              >
                Update Prompt
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Page>
    </Frame>
  );
};

export default UpdatePrompt;
