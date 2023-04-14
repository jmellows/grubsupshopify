import React from "react";
import { Page } from "@shopify/polaris";
import StorePageList from "../../components/store-page/StorePageList";

const StorePage = () => {
  return (
    <>
      <Page
        breadcrumbs={[{ content: "StorePages", url: "/" }]}
        title="Store Pages"
        fullWidth
      />
      <StorePageList />
    </>
  );
};

export default StorePage;
