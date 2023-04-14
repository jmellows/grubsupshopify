import shopify from "../../../shopify.js";

const getPages = async (req, res) => {
  try {
    let _pageURL = "recipe-generator";

    const _allStorePages = await shopify.api.rest.Page.all({
      session: res.locals.shopify.session,
    });

    const _filteredPages = await _allStorePages.filter(
      (x) => x.handle === _pageURL
    )[0];

    res.status(200).send({ ..._filteredPages });
  } catch (error) {
    res.status(200).send({ error: error.message || error });
  }
};

export default getPages;
