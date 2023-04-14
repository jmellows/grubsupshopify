const checkStorePageExits = async (req, res) => {
  console.log({ body: req.body, params: req.params });
  res.status(200).send({ message: "Hello This is page" });
};

export default checkStorePageExits;
