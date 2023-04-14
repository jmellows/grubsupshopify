import { Button, IndexTable } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { useFetch } from "../../hooks";

const LoadButton = () => {
  const [pageFound, setPageFound] = useState();

  const {
    fetchData: getPageFn,
    data: getPageData,
    loading: getPageLoading,
    error: getPageError,
  } = useFetch();

  // const {
  //   fetchData: deletePageFn,
  //   data: deletePageData,
  //   loading: deletePageLoading,
  //   error: deletePageError,
  // } = useFetch();

  const {
    fetchData: createPageFn,
    data: createPageData,
    loading: createPageLoading,
    error: createPageError,
  } = useFetch();

  const _handleCreatePageFn = () => {
    createPageFn("/api/app/store-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
  };

  const _handleDeletePageFn = () => {
    console.log({ getPageData, createPageData });
  };

  useEffect(() => {
    getPageFn("/api/app/store-pages", { method: "GET" });
  }, []);

  useEffect(() => {
    // if find exiting page
    if (getPageData && !getPageData.error && getPageData.id) {
      setPageFound(true);
    }

    // if created page
    if (createPageData && !createPageData.error && createPageData.id) {
      setPageFound(true);
    }

    // // if page deleted
    // if (
    //   deletePageData &&
    //   !deletePageData.error &&
    //   (createPageData.id || getPageData.id)
    // ) {
    //   console.log("Deleted..");
    // }
  }, [
    getPageData,
    getPageLoading,
    getPageError,
    createPageData,
    createPageLoading,
    createPageError,
    // deletePageData,
    // deletePageLoading,
    // deletePageError,
  ]);

  return (
    <>
      {/* {pageFound && (
        <Button
          size="slim"
          destructive
          loading={deletePageLoading}
          onClick={_handleDeletePageFn}
        >
          Disabled
        </Button>
      )} */}

      {/* {!pageFound && (
        <Button
          size="slim"
          loading={getPageLoading || createPageLoading}
          primary
          onClick={_handleCreatePageFn}
          disabled={pageFound || getPageLoading}
        >
          Activate
        </Button>
      )} */}

      <Button
        size="slim"
        primary={!pageFound}
        loading={getPageLoading || createPageLoading}
        onClick={() => {
          !pageFound && _handleCreatePageFn();
        }}
        disabled={pageFound}
      >
        {!pageFound ? "Activate" : "Activated"}
      </Button>
    </>
  );
};

const StorePageList = () => {
  return (
    <>
      <IndexTable
        loading={false}
        selectable={false}
        resourceName={{
          singular: "page",
          plural: "pages",
        }}
        itemCount={1}
        headings={[
          { title: "Name" },
          { title: "Created at" },
          { title: "URL" },
          { title: "" },
        ]}
      >
        <IndexTable.Row>
          <IndexTable.Cell>
            <span style={{ fontWeight: "bold" }}>Recipe Generator</span>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <span style={{ color: "#6d7175" }}>
              {new Date().toDateString()}
            </span>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <span style={{ color: "#6d7175" }}>/pages/recipe-generator</span>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <LoadButton />
          </IndexTable.Cell>
        </IndexTable.Row>
      </IndexTable>
    </>
  );
};

export default StorePageList;
