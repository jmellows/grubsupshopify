import shopify from "../../shopify.js";

const getSessionForStoreFront = async (shopDomain) => {
  try {
    let sessions = await shopify.config.sessionStorage.findSessionsByShop(
      shopDomain
    );

    let storeSession;

    for (const session of sessions) {
      if (shopDomain === session.shop) {
        storeSession = session;
        break;
      }
    }

    return storeSession;
  } catch (error) {
    return;
  }
};

export default getSessionForStoreFront;
