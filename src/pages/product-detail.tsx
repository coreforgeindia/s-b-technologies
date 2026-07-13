import { useParams, Link } from "wouter";
import { products } from "@/data/content";
import { motion } from "framer-motion";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-zinc-50">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">Product Not Found</h1>
        <p className="text-zinc-600 mb-8">The product you are looking for does not exist.</p>
        <Link href="/products">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Product Hero */}
      <section className="bg-zinc-50 py-12 md:py-20 border-b border-zinc-200">
        <div className="container mx-auto px-4 md:px-8">
          <Link href="/products" className="inline-flex items-center text-zinc-500 hover:text-primary font-medium mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to all products
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/2"
            >
              <div className="bg-zinc-950 rounded-3xl p-8 md:p-16 border-4 border-zinc-900 shadow-2xl flex items-center justify-center min-h-[400px]">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full max-h-[500px] object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full lg:w-1/2"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">{product.title}</h1>
              <div className="h-1 w-20 bg-primary mb-8"></div>
              <p className="text-xl text-zinc-600 leading-relaxed mb-10">
                {product.description}
              </p>
              
              <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm mb-10">
                <h3 className="font-bold text-lg mb-4 text-zinc-900">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-zinc-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 w-full sm:w-auto shadow-lg shadow-primary/20">
                  Request a Quote
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Detail Description */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-zinc lg:prose-lg max-w-none text-zinc-600 leading-relaxed"
          >
            <h2 className="text-3xl font-bold text-zinc-900 mb-6 flex items-center gap-4">
              <span className="w-8 h-1 bg-primary inline-block"></span> Product Overview
            </h2>
            <p>{product.detail}</p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      {product.gallery && product.gallery.length > 0 && (
        <section className="py-20 bg-zinc-950 text-white border-t-4 border-primary">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Construction & Details</h2>
              <div className="h-1 w-20 bg-primary mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {product.gallery.map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800"
                >
                  <div className="aspect-[4/3] bg-black flex items-center justify-center p-6">
                    <img 
                      src={img.url} 
                      alt={img.caption} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4 bg-zinc-900 border-t border-zinc-800 text-center">
                    <span className="font-bold text-zinc-300">{img.caption}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Need a Custom Configuration?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Our engineering team can tailor {product.title} strictly to your facility's requirements.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-zinc-950 hover:bg-zinc-900 text-white font-bold h-14 px-10">
              Discuss Your Requirements <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
