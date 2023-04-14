import shopify from "../../../shopify.js";
import getSessionForStoreFront from "../../configs/getSessionForStoreFront.js";

const saveCustomerRecipesPrompt = async (orderData) => {
  try {
    const shopSession = await getSessionForStoreFront(orderData.shop);
    if (!shopSession) throw new Error("Unauthorized..");

    // Get Customer  metaFields
    const customerMetaFields = await shopify.api.rest.Metafield.all({
      session: shopSession,
      metafield: {
        owner_id: orderData.payload.customer.id,
        owner_resource: "customer",
      },
      key: "searchRecipePrompt",
    });

    // Apply loop on line_items or products
    for (var i = 0; i < orderData.payload.line_items.length; i++) {
      // ordered product
      const product = orderData.payload.line_items[i];

      // product metafields
      const productMetaFields = await shopify.api.rest.Metafield.all({
        session: shopSession,
        metafield: {
          owner_id: product.product_id,
          owner_resource: "product",
        },
        key: "searchRecipePrompt",
      });

      const productMetaField = productMetaFields[0];
      if (productMetaField) {
        // check metafield value already exits or not
        const exitsMetafieldValue = await customerMetaFields.filter(
          (x) => x.value === productMetaField.value
        );

        if (!exitsMetafieldValue[0]) {
          // add metafield into customer metaFields
          const newMetaField = new shopify.api.rest.Metafield({
            session: shopSession,
          });

          newMetaField.customer_id = orderData.payload.customer.id;
          newMetaField.namespace = "global";
          newMetaField.key = "searchRecipePrompt";
          newMetaField.value = productMetaField.value;
          newMetaField.type = "single_line_text_field";

          await newMetaField.save({
            update: true,
          });

          // Delete metaField from product
          await shopify.api.rest.Metafield.delete({
            session: shopSession,
            product_id: product.id,
            id: productMetaField.id,
          });
        }
      }
    }
  } catch (error) {
    // console.log("Metafield added Error:", error);
  }
};

export default saveCustomerRecipesPrompt;
