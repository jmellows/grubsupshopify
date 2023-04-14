// import shopify from "../../shopify.js";

import shopify from "../../../shopify.js";

const createPage = async (req, res) => {
  try {
    let _pageURL = "recipe-generator";

    // Find Page using page handle
    const _findPages = await shopify.api.rest.Page.all({
      session: res.locals.shopify.session,
    });

    const _filteredPage = await _findPages.filter(
      (x) => x.handle === _pageURL
    )[0];
    if (_filteredPage) throw new Error("Recipe generator page already exits.");

    let _newPage = new shopify.api.rest.Page({
      session: res.locals.shopify.session,
    });

    _newPage.title = "Recipe Generator";
    _newPage.body_html = `<div id="recipe-generator-container">loading......</div>`;

    await _newPage.save({
      update: true,
    });

    res.status(200).send(_newPage);
  } catch (error) {
    res.status(200).send({ error: error.message || error });
  }
};

export default createPage;
