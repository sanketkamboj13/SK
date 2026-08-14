import Link from "next/link";
import { Header, Footer, ProductCard, SectionTitle } from "./components";
import { products, categories } from "../lib/products";
import { ArrowRight } from "lucide-react";
export default function Home(){
 const featured=products.filter(p=>p.featured).slice(0,6);
 return <><Header/>
 <main>
  <section className="hero"><img src="/images/hero-model.jpg" alt="S.K men's fashion editorial"/><div className="hero-copy"><p>S.K / 2026 EDIT</p><h1>DEFINE YOUR<br/>EVERYDAY.</h1><p>Modern essentials designed for the way you move.</p><div><Link className="btn light" href="/shop">SHOP MEN</Link><Link className="btn outline-light" href="/new-arrivals">NEW ARRIVALS</Link></div></div></section>
  <section className="section"><SectionTitle eyebrow="JUST IN" title="NEW ARRIVALS"/><div className="grid four">{featured.map(p=><ProductCard key={p.id} p={p}/>)}</div></section>
  <section className="section"><SectionTitle eyebrow="EXPLORE" title="SHOP BY CATEGORY"/><div className="category-grid">{categories.slice(0,6).map((c,i)=><Link key={c} href={`/shop?category=${c}`} className="cat"><img src={products[i*4].image} alt={c}/><span>{c.toUpperCase()} <ArrowRight/></span></Link>)}</div></section>
  <section className="editorial"><img src={products[17].images[1]} alt="S.K seasonal collection"/><div><p>THE AUTUMN EDIT</p><h2>Layer up.<br/>Dress better.</h2><Link className="btn" href="/shop">EXPLORE COLLECTION</Link></div></section>
  <section className="section"><SectionTitle eyebrow="THE S.K APPROACH" title="STYLE, SIMPLIFIED."/><div className="style-grid">{["Everyday Essentials","Smart Casual","Weekend Fits","Streetwear"].map((x,i)=><Link href="/shop" className="style-card" key={x}><img src={products[10+i].image} alt={x}/><h3>{x}</h3><span>EXPLORE →</span></Link>)}</div></section>
  <section className="newsletter"><p>STAY IN THE LOOP</p><h2>New drops. Exclusive offers.<br/>Style inspiration.</h2><form><input placeholder="Email address"/><button>SUBSCRIBE</button></form></section>
 </main><Footer/></>
}