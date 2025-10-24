const soap = require("soap");
const url = "http://localhost:8005/product?wsdl";

async function run() {
  const client = await soap.createClientAsync(url);
  console.log("SOAP client created");

  // CREATE
  const [createRes] = await client.CreateProductAsync({
    name: "SOAP Widget",
    description: "Created via SOAP client",
    price: 9.99,
    inStock: true,
  });
  console.log("CreateProduct:", createRes);
  const id = createRes.id;

  // GET
  const [getRes] = await client.GetProductAsync({ id });
  console.log("GetProduct:", getRes);

  // UPDATE
  const [updateRes] = await client.UpdateProductAsync({ id, price: 12.49 });
  console.log("UpdateProduct:", updateRes);

  // GET ALL
  const [allRes] = await client.GetAllProductsAsync({});
  console.log("GetAllProducts count:", allRes?.products?.product?.length || 0);

  // DELETE
  const [delRes] = await client.DeleteProductAsync({ id });
  console.log("DeleteProduct:", delRes);
}

run().catch(console.error);
