"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

export default function AddProduct() {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "T-Shirts",
    price: "",
    salePrice: "",
    colors: "",
    sizes: "S,M,L,XL,XXL",
    material: "100% Cotton",
    fit: "Regular",
    rating: "5",
    reviews: "0",
    stock: "",
    sku: "",
    description: "",
    featured: false,
    newArrival: true,
    sale: false,
  });

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select a product image.");
      return;
    }

    setLoading(true);

    try {
      // Create a unique file name
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      // Get public image URL
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      // Save product in database
      const product = {
        id: form.id || `SK-${Date.now()}`,
        name: form.name,
        category: form.category,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,

        image: imageUrl,
        images: [imageUrl],

        colors: form.colors
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),

        sizes: form.sizes
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),

        material: form.material,
        fit: form.fit,
        rating: Number(form.rating),
        reviews: Number(form.reviews),
        stock: Number(form.stock),
        sku: form.sku,
        description: form.description,

        featured: form.featured,
        newArrival: form.newArrival,
        sale: form.sale,
      };

      const { error: insertError } = await supabase
        .from("products")
        .insert(product);

      if (insertError) {
        throw new Error(`Product save failed: ${insertError.message}`);
      }

      alert("Product added successfully!");

      window.location.href = "/admin";
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "50px auto", padding: 20 }}>
      <Link href="/admin">← Back to Admin</Link>

      <h1 style={{ marginTop: 30 }}>ADD NEW PRODUCT</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 18,
          marginTop: 30,
        }}
      >
        <input
          placeholder="Product ID"
          value={form.id}
          onChange={(e) => update("id", e.target.value)}
        />

        <input
          required
          placeholder="Product name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />

        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
        >
          <option>T-Shirts</option>
          <option>Shirts</option>
          <option>Jeans</option>
          <option>Trousers</option>
          <option>Jackets</option>
          <option>Hoodies</option>
          <option>Knitwear</option>
          <option>Accessories</option>
        </select>

        <input
          required
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}
        />

        <input
          type="number"
          placeholder="Sale price (optional)"
          value={form.salePrice}
          onChange={(e) => update("salePrice", e.target.value)}
        />

        {/* PRODUCT IMAGE */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            PRODUCT IMAGE
          </label>

          <input
            required
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(e.target.files?.[0] || null)
            }
          />

          {imageFile && (
            <p style={{ marginTop: 8 }}>
              Selected: {imageFile.name}
            </p>
          )}
        </div>

        <input
          placeholder="Colors: Black, White, Navy"
          value={form.colors}
          onChange={(e) => update("colors", e.target.value)}
        />

        <input
          placeholder="Sizes: S, M, L, XL, XXL"
          value={form.sizes}
          onChange={(e) => update("sizes", e.target.value)}
        />

        <input
          placeholder="Material"
          value={form.material}
          onChange={(e) => update("material", e.target.value)}
        />

        <select
          value={form.fit}
          onChange={(e) => update("fit", e.target.value)}
        >
          <option>Regular</option>
          <option>Relaxed</option>
          <option>Oversized</option>
          <option>Slim</option>
        </select>

        <input
          required
          type="number"
          placeholder="Stock quantity"
          value={form.stock}
          onChange={(e) => update("stock", e.target.value)}
        />

        <input
          required
          placeholder="SKU"
          value={form.sku}
          onChange={(e) => update("sku", e.target.value)}
        />

        <textarea
          placeholder="Product description"
          rows={5}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              update("featured", e.target.checked)
            }
          />{" "}
          Featured product
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.newArrival}
            onChange={(e) =>
              update("newArrival", e.target.checked)
            }
          />{" "}
          New arrival
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.sale}
            onChange={(e) =>
              update("sale", e.target.checked)
            }
          />{" "}
          On sale
        </label>

        <button
          type="submit"
          disabled={loading}
          className="btn"
        >
          {loading ? "UPLOADING..." : "ADD PRODUCT"}
        </button>
      </form>
    </main>
  );
}