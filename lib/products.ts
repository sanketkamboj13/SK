export type Product = {
  id: string; name: string; category: string; price: number; salePrice?: number;
  image: string; images: string[]; colors: string[]; sizes: string[]; material: string;
  fit: string; rating: number; reviews: number; stock: number; sku: string;
  description: string; featured?: boolean; newArrival?: boolean; sale?: boolean;
};

const img = (seed: string) => `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=900&q=85`;

const seeds = [
"1521572163474-6864f9cf17ab","1503341504253-dff4815485f1","1596755389378-c31d21fd1273",
"1515886657613-9f3515b0c78f","1551488831-00ddcb6c6bd3","1551028719-00167b16eac5",
"1516826957135-700dedea698c","1525507119028-ed4c629a60a3","1485230895905-ec40ba36b916",
"1496747611176-843222e1e57c","1542291026-7eec264c27ff","1529139574466-a303027c1d8b"
];

const names = [
"Essential Cotton T-Shirt","Heavyweight Oversized Tee","Relaxed Fit T-Shirt","Premium Basic Tee",
"Oxford Cotton Shirt","Relaxed Linen Shirt","Oversized Casual Shirt","Textured Resort Shirt",
"Straight Fit Jeans","Relaxed Fit Jeans","Slim Taper Jeans","Wide Leg Jeans",
"Relaxed Tailored Trousers","Straight Fit Trousers","Cargo Trousers","Pleated Trousers",
"Denim Jacket","Lightweight Bomber","Overshirt Jacket","Utility Jacket",
"Essential Hoodie","Oversized Hoodie","Zip Hoodie","Heavyweight Sweatshirt",
"Leather Belt","Minimal Wallet","Baseball Cap","Sunglasses","Crossbody Bag"
];

const cats = ["T-Shirts","T-Shirts","T-Shirts","T-Shirts","Shirts","Shirts","Shirts","Shirts","Jeans","Jeans","Jeans","Jeans","Trousers","Trousers","Trousers","Trousers","Jackets","Jackets","Jackets","Jackets","Hoodies","Hoodies","Hoodies","Hoodies","Accessories","Accessories","Accessories","Accessories","Accessories"];

export const products: Product[] = Array.from({length: 50}, (_, i) => {
  const category = cats[i % cats.length];
  const name = names[i % names.length] + (i >= names.length ? ` ${Math.floor(i/names.length)+1}` : "");
  const price = [799,999,1299,1499,1999,2499][i % 6];
  const sale = i % 5 === 0;
  const seed = seeds[i % seeds.length];
  return {
    id: `SK-${String(i+1).padStart(3,"0")}`, name, category,
    price, salePrice: sale ? Math.round(price * .8) : undefined,
    image: img(seed), images: [img(seed), img(seeds[(i+3)%seeds.length])],
    colors: [["Black","White","Grey"],["Navy","Beige","Olive"],["Brown","Black"],["White","Blue"]][i%4],
    sizes: category === "Accessories" ? ["One Size"] : ["XS","S","M","L","XL","XXL"],
    material: ["100% Cotton","Cotton Blend","Linen Blend","Denim","Polyester Blend"][i%5],
    fit: ["Regular","Relaxed","Oversized","Slim"][i%4],
    rating: +(4.2 + (i%8)/10).toFixed(1), reviews: 18 + i*7, stock: 5 + (i*13)%60,
    sku: `SK-${category.slice(0,2).toUpperCase()}-${1000+i}`,
    description: "A refined everyday essential built around a clean silhouette, premium feel and effortless versatility.",
    featured: i < 8, newArrival: i < 12, sale
  };
});
export const categories = ["T-Shirts","Shirts","Jeans","Trousers","Jackets","Hoodies","Knitwear","Accessories"];
