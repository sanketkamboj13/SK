"use client";

import { useSearchParams } from "next/navigation";
import { Header, Footer, ProductCard } from "../components";
import { products } from "../../lib/products";
import { useMemo, useState } from "react";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const colors = [
  "Black",
  "White",
  "Grey",
  "Navy",
  "Beige",
  "Brown",
  "Olive",
  "Blue",
];

const fits = ["Regular", "Relaxed", "Oversized", "Slim"];

const materials = [
  "100% Cotton",
  "Cotton Blend",
  "Linen Blend",
  "Denim",
  "Polyester Blend",
];

const priceRanges = [
  { label: "Under ₹1,000", min: 0, max: 999 },
  { label: "₹1,000 – ₹1,499", min: 1000, max: 1499 },
  { label: "₹1,500 – ₹1,999", min: 1500, max: 1999 },
  { label: "₹2,000+", min: 2000, max: Infinity },
];

export default function Shop() {
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get("category");
  const urlSale = searchParams.get("sale");

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFits, setSelectedFits] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [sort, setSort] = useState("Recommended");

  const toggleValue = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedFits([]);
    setSelectedMaterials([]);
    setSelectedPrices([]);
    setAvailability([]);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      // Category
      if (urlCategory && product.category !== urlCategory) {
        return false;
      }

      // Sale
      if (urlSale && !product.sale) {
        return false;
      }

      // Size
      if (
        selectedSizes.length > 0 &&
        !selectedSizes.some((size) => product.sizes.includes(size))
      ) {
        return false;
      }

      // Color
      if (
        selectedColors.length > 0 &&
        !selectedColors.some((color) => product.colors.includes(color))
      ) {
        return false;
      }

      // Fit
      if (
        selectedFits.length > 0 &&
        !selectedFits.includes(product.fit)
      ) {
        return false;
      }

      // Material
      if (
        selectedMaterials.length > 0 &&
        !selectedMaterials.includes(product.material)
      ) {
        return false;
      }

      // Price
      if (selectedPrices.length > 0) {
        const currentPrice = product.salePrice || product.price;

        const matchesPrice = selectedPrices.some((priceLabel) => {
          const range = priceRanges.find(
            (range) => range.label === priceLabel
          );

          if (!range) return false;

          return (
            currentPrice >= range.min &&
            currentPrice <= range.max
          );
        });

        if (!matchesPrice) {
          return false;
        }
      }

      // Availability
      if (availability.length > 0) {
        const status =
          product.stock === 0
            ? "Out of Stock"
            : product.stock <= 10
            ? "Low Stock"
            : "In Stock";

        if (!availability.includes(status)) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (sort === "Price: Low to High") {
      result.sort(
        (a, b) =>
          (a.salePrice || a.price) -
          (b.salePrice || b.price)
      );
    }

    if (sort === "Price: High to Low") {
      result.sort(
        (a, b) =>
          (b.salePrice || b.price) -
          (a.salePrice || a.price)
      );
    }

    if (sort === "Customer Rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "Newest") {
      result.sort(
        (a, b) =>
          Number(Boolean(b.newArrival)) -
          Number(Boolean(a.newArrival))
      );
    }

    return result;
  }, [
    urlCategory,
    urlSale,
    selectedSizes,
    selectedColors,
    selectedFits,
    selectedMaterials,
    selectedPrices,
    availability,
    sort,
  ]);

  const activeFilterCount =
    selectedSizes.length +
    selectedColors.length +
    selectedFits.length +
    selectedMaterials.length +
    selectedPrices.length +
    availability.length;

  return (
    <>
      <Header />

      <main className="listing">
        <div className="listing-head">
          <div>
            <p className="eyebrow">S.K / SHOP</p>

            <h1>
              {urlCategory
                ? `MEN'S ${urlCategory.toUpperCase()}`
                : urlSale
                ? "SALE"
                : "SHOP ALL"}
            </h1>

            <p>
              {filteredProducts.length} products
            </p>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option>Recommended</option>
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Customer Rating</option>
          </select>
        </div>

        <div className="shop-layout">

          {/* FILTER SIDEBAR */}
          <aside className="filter-sidebar">

            <div className="filter-header">
              <b>FILTERS</b>

              {activeFilterCount > 0 && (
                <button onClick={clearFilters}>
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* CATEGORY */}
<details open>
  <summary>CATEGORY</summary>

  <div className="filter-options">
    {[
      "T-Shirts",
      "Shirts",
      "Jeans",
      "Trousers",
      "Jackets",
      "Hoodies",
      "Knitwear",
      "Accessories",
    ].map((category) => {
      const selected = urlCategory === category;

      return (
        <button
          key={category}
          type="button"
          className="category-filter-button"
          onClick={() => {
            if (selected) {
              window.location.href = "/shop";
            } else {
              window.location.href = `/shop?category=${encodeURIComponent(
                category
              )}`;
            }
          }}
        >
          <span
            className={
              selected
                ? "fake-checkbox checked"
                : "fake-checkbox"
            }
          >
            {selected ? "✓" : ""}
          </span>

          <span>{category}</span>
        </button>
      );
    })}
  </div>
</details>
            {/* SIZE */}
            <details open>
              <summary>SIZE</summary>

              <div className="filter-options">
                {sizes.map((size) => (
                  <label key={size}>
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() =>
                        toggleValue(size, setSelectedSizes)
                      }
                    />

                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </details>

            {/* COLOR */}
            <details open>
              <summary>COLOR</summary>

              <div className="filter-options">
                {colors.map((color) => (
                  <label key={color}>
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() =>
                        toggleValue(color, setSelectedColors)
                      }
                    />

                    <span>{color}</span>
                  </label>
                ))}
              </div>
            </details>

            {/* PRICE */}
            <details open>
              <summary>PRICE</summary>

              <div className="filter-options">
                {priceRanges.map((range) => (
                  <label key={range.label}>
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes(range.label)}
                      onChange={() =>
                        toggleValue(
                          range.label,
                          setSelectedPrices
                        )
                      }
                    />

                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </details>

            {/* FIT */}
            <details>
              <summary>FIT</summary>

              <div className="filter-options">
                {fits.map((fit) => (
                  <label key={fit}>
                    <input
                      type="checkbox"
                      checked={selectedFits.includes(fit)}
                      onChange={() =>
                        toggleValue(fit, setSelectedFits)
                      }
                    />

                    <span>{fit}</span>
                  </label>
                ))}
              </div>
            </details>

            {/* MATERIAL */}
            <details>
              <summary>MATERIAL</summary>

              <div className="filter-options">
                {materials.map((material) => (
                  <label key={material}>
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material)}
                      onChange={() =>
                        toggleValue(
                          material,
                          setSelectedMaterials
                        )
                      }
                    />

                    <span>{material}</span>
                  </label>
                ))}
              </div>
            </details>

            {/* AVAILABILITY */}
            <details>
              <summary>AVAILABILITY</summary>

              <div className="filter-options">
                {[
                  "In Stock",
                  "Low Stock",
                  "Out of Stock",
                ].map((status) => (
                  <label key={status}>
                    <input
                      type="checkbox"
                      checked={availability.includes(status)}
                      onChange={() =>
                        toggleValue(status, setAvailability)
                      }
                    />

                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </details>
          </aside>

          {/* PRODUCTS */}
          <div>

            {filteredProducts.length === 0 ? (
              <div className="empty">
                <h2>NO PRODUCTS FOUND</h2>

                <p>
                  Try changing or removing some filters.
                </p>

                <button
                  className="btn"
                  onClick={clearFilters}
                >
                  CLEAR FILTERS
                </button>
              </div>
            ) : (
              <div className="grid four">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    p={product}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}