"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Header, Footer } from "../components";

const categories = [
  "T-Shirts",
  "Shirts",
  "Jeans",
  "Trousers",
  "Jackets",
  "Hoodies",
  "Accessories",
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("T-Shirts");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [material, setMaterial] = useState("100% Cotton");
  const [fit, setFit] = useState("Regular");
  const [description, setDescription] = useState("");

  const [selectedSizes, setSelectedSizes] = useState<string[]>([
    "S",
    "M",
    "L",
    "XL",
  ]);

  const [colors, setColors] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(true);
  const [sale, setSale] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      window.location.href = "/admin-login";
      return;
    }

    setLoading(false);

    await Promise.all([
      loadProducts(),
      loadOrders(),
    ]);
  }

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("PRODUCTS ERROR:", error);
      return;
    }

    setProducts(data || []);
  }

  async function loadOrders() {
    setOrdersLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("ORDERS ERROR:", error);
      setOrders([]);
    } else {
      setOrders(data || []);
    }

    setOrdersLoading(false);
  }

  async function updateOrderStatus(
    orderId: string,
    status: string
  ) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      console.error("STATUS ERROR:", error);
      alert("Could not update order status.");
      return;
    }

    await loadOrders();
  }

  function toggleSize(size: string) {
    setSelectedSizes((current) =>
      current.includes(size)
        ? current.filter((x) => x !== size)
        : [...current, size]
    );
  }

  async function uploadImages(productId: string) {
    const imageUrls: string[] = [];

    for (const file of files) {
      const extension =
        file.name.split(".").pop() || "jpg";

      const fileName =
        `${productId}/${crypto.randomUUID()}.${extension}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      imageUrls.push(data.publicUrl);
    }

    return imageUrls;
  }

  async function addProduct(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setMessage("");

    if (!name || !price || !stock || !sku) {
      setMessage(
        "Please fill all required fields."
      );
      return;
    }

    if (files.length === 0) {
      setMessage(
        "Please upload at least one product photo."
      );
      return;
    }

    setSaving(true);

    try {
      const productId =
        `SK-${crypto.randomUUID()}`;

      const imageUrls =
        await uploadImages(productId);

      const colorArray = colors
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      const { error } = await supabase
        .from("products")
        .insert({
          id: productId,
          name,
          category,
          price: Number(price),
          sale_price: salePrice
            ? Number(salePrice)
            : null,
          image: imageUrls[0],
          images: imageUrls,
          colors: colorArray,
          sizes: selectedSizes,
          material,
          fit,
          rating: 0,
          reviews: 0,
          stock: Number(stock),
          sku,
          description,
          featured,
          new_arrival: newArrival,
          sale,
        });

      if (error) {
        throw error;
      }

      setMessage(
        "Product added successfully!"
      );

      setName("");
      setPrice("");
      setSalePrice("");
      setStock("");
      setSku("");
      setColors("");
      setDescription("");
      setFiles([]);

      setSelectedSizes([
        "S",
        "M",
        "L",
        "XL",
      ]);

      setFeatured(false);
      setNewArrival(true);
      setSale(false);

      await loadProducts();

    } catch (error: any) {
      console.error(error);

      setMessage(
        error?.message ||
        "Failed to add product."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        Loading admin...
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="admin">

        {/* ================================
            ADMIN HEADER
        ================================= */}

        <div className="admin-head">
          <div>
            <p className="eyebrow">
              S.K / ADMIN
            </p>

            <h1>
              COMMAND CENTER
            </h1>
          </div>
        </div>

        {/* ================================
            ADD PRODUCT
        ================================= */}

        <section
          className="panel"
          style={{ marginBottom: 30 }}
        >
          <h2>
            ADD NEW PRODUCT
          </h2>

          {message && (
            <div
              style={{
                padding: 14,
                margin: "20px 0",
                border: "1px solid #444",
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={addProduct}>

            <div className="two">

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Product name *"
              />

              <input
                value={sku}
                onChange={(e) =>
                  setSku(e.target.value)
                }
                placeholder="SKU *"
              />

            </div>

            <div className="two">

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>

              <input
                value={material}
                onChange={(e) =>
                  setMaterial(e.target.value)
                }
                placeholder="Material"
              />

            </div>

            <div className="two">

              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                placeholder="Price ₹ *"
              />

              <input
                type="number"
                value={salePrice}
                onChange={(e) =>
                  setSalePrice(e.target.value)
                }
                placeholder="Sale price ₹"
              />

            </div>

            <div className="two">

              <input
                type="number"
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value)
                }
                placeholder="Stock quantity *"
              />

              <select
                value={fit}
                onChange={(e) =>
                  setFit(e.target.value)
                }
              >
                <option value="Regular">
                  Regular
                </option>

                <option value="Relaxed">
                  Relaxed
                </option>

                <option value="Oversized">
                  Oversized
                </option>

                <option value="Slim">
                  Slim
                </option>
              </select>

            </div>

            <input
              value={colors}
              onChange={(e) =>
                setColors(e.target.value)
              }
              placeholder="Colours — Black, White, Grey"
            />

            <h3>
              SELECT SIZES
            </h3>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {sizes.map((size) => (
                <label key={size}>
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(
                      size
                    )}
                    onChange={() =>
                      toggleSize(size)
                    }
                  />

                  {" "}
                  {size}
                </label>
              ))}
            </div>

            <h3>
              PRODUCT PHOTOS
            </h3>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setFiles(
                  Array.from(
                    e.target.files || []
                  )
                )
              }
            />

            {files.length > 0 && (
              <p>
                {files.length} photo(s) selected
              </p>
            )}

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Product description"
              rows={5}
            />

            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >

              <label>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) =>
                    setFeatured(
                      e.target.checked
                    )
                  }
                />

                {" "}
                Featured product
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={newArrival}
                  onChange={(e) =>
                    setNewArrival(
                      e.target.checked
                    )
                  }
                />

                {" "}
                New arrival
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={sale}
                  onChange={(e) =>
                    setSale(
                      e.target.checked
                    )
                  }
                />

                {" "}
                Sale product
              </label>

            </div>

            <button
              className="btn full"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "ADDING PRODUCT..."
                : "ADD PRODUCT"}
            </button>

          </form>
        </section>

        {/* ================================
            REAL PRODUCTS
        ================================= */}

        <section className="panel">

          <h2>
            REAL PRODUCTS
          </h2>

          {products.length === 0 ? (

            <p>
              No products added yet.
            </p>

          ) : (

            <div className="admin-table">

              {products.map((product) => (

                <div
                  className="row"
                  key={product.id}
                >

                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: 60,
                      height: 70,
                      objectFit: "cover",
                    }}
                  />

                  <b>
                    {product.name}
                  </b>

                  <span>
                    {product.category}
                  </span>

                  <span>
                    ₹{product.price}
                  </span>

                  <span>
                    Stock: {product.stock}
                  </span>

                  <span>
                    {product.sku}
                  </span>

                </div>

              ))}

            </div>
          )}

        </section>

        {/* ================================
            ORDER MANAGEMENT
        ================================= */}

        <section
          className="panel"
          style={{ marginTop: 30 }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: 20,
              marginBottom: 25,
              flexWrap: "wrap",
            }}
          >

            <div>

              <p className="eyebrow">
                S.K / ORDERS
              </p>

              <h2>
                ORDER MANAGEMENT
              </h2>

            </div>

            <button
              type="button"
              className="btn"
              onClick={loadOrders}
            >
              REFRESH ORDERS
            </button>

          </div>

          {ordersLoading ? (

            <p>
              Loading orders...
            </p>

          ) : orders.length === 0 ? (

            <div
              style={{
                padding: 30,
                textAlign: "center",
                border: "1px solid #ddd",
              }}
            >

              <h3>
                NO ORDERS YET
              </h3>

              <p>
                Customer orders will appear
                here automatically.
              </p>

            </div>

          ) : (

            <div
              style={{
                display: "grid",
                gap: 20,
              }}
            >

              {orders.map((order) => (

                <div
                  key={order.id}
                  style={{
                    border:
                      "1px solid #ddd",
                    padding: 24,
                    display: "grid",
                    gap: 18,
                  }}
                >

                  {/* ORDER NUMBER */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 15,
                    }}
                  >

                    <div>

                      <strong>
                        ORDER #
                        {String(
                          order.id
                        ).slice(0, 8)}
                      </strong>

                      {order.created_at && (
                        <small
                          style={{
                            display: "block",
                            marginTop: 6,
                          }}
                        >
                          {new Date(
                            order.created_at
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </small>
                      )}

                    </div>

                    <strong>
                      ₹
                      {Number(
                        order.total_amount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                  {/* CUSTOMER */}

                  <div>

                    <h3>
                      CUSTOMER
                    </h3>

                    <p>
                      <strong>
                        {order.customer_name}
                      </strong>
                    </p>

                    <p>
                      📞 {order.phone}
                    </p>

                    <p>
                      ✉️ {order.email}
                    </p>

                  </div>

                  {/* ADDRESS */}

                  <div>

                    <h3>
                      SHIPPING ADDRESS
                    </h3>

                    <p>
                      {order.address}
                    </p>

                  </div>

                  {/* PRODUCTS */}

                  <div>

                    <h3>
                      ORDER ITEMS
                    </h3>

                    {Array.isArray(
                      order.products
                    ) ? (

                      order.products.map(
                        (
                          item: any,
                          index: number
                        ) => (

                          <p
                            key={index}
                            style={{
                              margin:
                                "6px 0",
                            }}
                          >
                            <strong>
                              {item.name}
                            </strong>

                            {" × "}

                            {item.quantity}

                            {" — ₹"}

                            {Number(
                              item.price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        )
                      )

                    ) : (

                      <p>
                        Order item information
                        unavailable.
                      </p>

                    )}

                  </div>

                  {/* PAYMENT */}

                  <div>

                    <h3>
                      PAYMENT
                    </h3>

                    <p>
                      {order.payment_method}
                    </p>

                  </div>

                  {/* STATUS */}

                  <div>

                    <h3>
                      ORDER STATUS
                    </h3>

                    <select
                      value={
                        order.status ||
                        "pending"
                      }
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      style={{
                        padding:
                          "10px 14px",
                        minWidth: 180,
                      }}
                    >

                      <option value="pending">
                        Pending
                      </option>

                      <option value="confirmed">
                        Confirmed
                      </option>

                      <option value="processing">
                        Processing
                      </option>

                      <option value="shipped">
                        Shipped
                      </option>

                      <option value="delivered">
                        Delivered
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>

                    </select>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

      <Footer />
    </>
  );
}