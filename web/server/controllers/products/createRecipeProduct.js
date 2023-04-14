import shopify from "../../../shopify.js";
import getSessionForStoreFront from "../../configs/getSessionForStoreFront.js";

const createRecipeProduct = async (req, res) => {
  try {
    const shopSession = await getSessionForStoreFront(req.headers.shop);

    if (!shopSession) throw new Error("UnAuthorized.");

    // Find Existing Product by Tilte
    const _finProductByTitles = await shopify.api.rest.Product.all({
      session: shopSession,
      title: req.body.title,
    });

    if (_finProductByTitles[0]) {
      // Find MetaField
      const metaFields = await shopify.api.rest.Metafield.all({
        session: shopSession,
        metafield: {
          owner_id: _finProductByTitles[0].id,
          owner_resource: "product",
        },
        key: "searchRecipePrompt",
      });

      try {
        // Update MetaField
        if (metaFields[0]) {
          const metafield = new shopify.api.rest.Metafield({
            session: shopSession,
          });

          metafield.product_id = _finProductByTitles[0].id;
          metafield.id = metaFields[0].id;
          metafield.value = req.body.searchPrompt;

          await metafield.save({
            update: true,
          });

          // console.log("Product metaField updated...");
        } else {
          // Create MetaField if not exits
          const newMetaField = new shopify.api.rest.Metafield({
            session: shopSession,
          });

          newMetaField.product_id = _finProductByTitles[0].id;
          newMetaField.namespace = "global";
          newMetaField.key = "searchRecipePrompt";
          newMetaField.value = req.body.searchPrompt;
          newMetaField.type = "single_line_text_field";

          await newMetaField.save({
            update: true,
          });
        }
      } catch (error) {
        return res.status(200).send({ error: error.message || error });
      }

      return res.status(200).send(_finProductByTitles[0]);
    }

    // Create New product
    let _newProduct = new shopify.api.rest.Product({ session: shopSession });

    _newProduct.title = req.body.title;

    const _ingredients =
      req.body.ingredients
        ?.map((x, index) => `<p id=${index}>${x}</p>`)
        .toString() || "";

    const _instructions =
      req.body.instructions
        ?.map((x, index) => `<p id=${index}>${x}</p>`)
        .toString() || "";

    const _nutritionals =
      req.body.nutritions
        ?.map((x, index) => `<p id=${index}>${x}</p>`)
        .toString() || "";

    const _allergens =
      req.body.allergens
        ?.map((x, index) => `<p id=${index}>${x}</p>`)
        .toString() || "";

    const TempString =
      `<p style="font-weight:bold;">Ingredients:</p>${_ingredients}<p style="font-weight:bold;">Instructions:</p>${_instructions}<p style="font-weight:bold;">Nutritional information per serving:</p>${_nutritionals}<p style="font-weight:bold;">Allergens:</p>${_allergens}`.replaceAll(
        "p>,<p",
        "p><p"
      );

    _newProduct.body_html = TempString;

    _newProduct.status = "active";

    _newProduct.metafields = [
      {
        key: "searchRecipePrompt",
        value: req.body.searchPrompt,
        type: "single_line_text_field",
        namespace: "global",
      },
    ];

    await _newProduct.save({
      update: true,
    });

    res.status(200).send(_newProduct);
  } catch (error) {
    res.status(200).send({ error: error.message || error });
  }
};

export default createRecipeProduct;
