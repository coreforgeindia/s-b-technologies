import { Link } from "wouter";
import { accessories, tests } from "@/data/content";
import { useProducts, useServices } from "@/hooks/use-content";
import { Check, Settings, Zap, Factory, Wrench, Layers, ShieldCheck, ArrowRight, Activity, Package, Cpu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Icon mapping for services loaded from Supabase
const iconMap: Record<string, React.ReactNode> = {
  Settings: <Settings className="w-8 h-8 text-primary" />,
  Factory: <Factory className="w-8 h-8 text-primary" />,
  Layers: <Layers className="w-8 h-8 text-primary" />,
  Wrench: <Wrench className="w-8 h-8 text-primary" />,
  Zap: <Zap className="w-8 h-8 text-primary" />,
  Shield: <Shield className="w-8 h-8 text-primary" />,
  Cpu: <Cpu className="w-8 h-8 text-primary" />,
  Package: <Package className="w-8 h-8 text-primary" />,
};

export default function Products() {
  const { products, loading: productsLoading } = useProducts();
  const { services, loading: servicesLoading } = useServices();

  // Loading skeleton
  const ProductSkeleton = () => (
    <div className="bg-white rounded-3xl border border-zinc-150 overflow-hidden animate-pulse">
      <div className="h-64 bg-zinc-200" />
      <div className="p-8 space-y-4">
        <div className="h-6 bg-zinc-200 rounded w-3/4" />
        <div className="h-3 bg-zinc-100 rounded w-full" />
        <div className="h-3 bg-zinc-100 rounded w-5/6" />
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="space-y-2">
            <div className="h-3 bg-zinc-100 rounded w-1/2" />
            <div className="h-3 bg-zinc-100 rounded w-3/4" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-zinc-100 rounded w-1/2" />
            <div className="h-3 bg-zinc-100 rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-zinc-50 min-h-screen">
      {/* Page Header */}
      <section className="bg-zinc-950 py-24 border-b-4 border-primary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-transparent z-10" />
          <div className="w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Products & Services</h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Comprehensive PCB assembly and Implementing Technology engineered for precision, reliabilityand rapid turnaround.
          </p>
        </div>
      </section>

      {/* Full Range Banner */}
      <section className="py-12 bg-white border-b border-zinc-100">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="bg-zinc-950 rounded-3xl overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="p-10 md:p-16 md:w-1/2 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Complete EMS Solutions</h2>
                <div className="h-1 w-16 bg-primary mb-6 animate-pulse"></div>
                <p className="text-zinc-400 text-base leading-relaxed">
                  From single prototype boards to high-volume production runs, our complete range of SMT, through-holeand mixed-technology assembly services is built to handle diverse and demanding electronics manufacturing needs.
                </p>
              </div>
              <div className="md:w-1/2 bg-black h-64 md:h-auto self-stretch relative flex items-center justify-center p-8">
                {products.length > 0 && products[0].image_url ? (
                  <img
                    src={products[0].image_url}
                    alt="S.B. Technologies Service Range"
                    className="w-full h-full object-contain max-h-[300px]"
                  />
                ) : (
                  <div className="text-center text-zinc-600">
                    <Package size={64} className="mx-auto mb-4" />
                    <p className="text-sm font-bold">Product Range</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">Our Products</h2>
            <div className="h-1 w-20 bg-primary mb-4"></div>
            <p className="text-zinc-600 text-lg">
              A complete range of PCB assembly and soldering services, built and tested to the highest IPC standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {productsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-zinc-150 overflow-hidden flex flex-col hover:shadow-xl hover:border-primary/40 transition-all duration-300 group"
                >
                  <Link href={`/products/${product.id}`} className="block overflow-hidden bg-zinc-950 p-8 h-64 border-b-[3px] border-primary">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Zap size={48} />
                      </div>
                    )}
                  </Link>

                  <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                          <Zap size={22} />
                        </div>
                        <h3 className="text-2xl font-bold text-navy group-hover:text-primary transition-colors leading-tight">
                          {product.title}
                        </h3>
                      </div>

                      <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
                        {product.description}
                      </p>

                      {/* Features & Applications */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
                        <div>
                          <h4 className="font-bold text-navy text-xs uppercase tracking-wider mb-3">Key Features</h4>
                          <ul className="space-y-2">
                            {(product.features || []).map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-zinc-700 text-xs font-semibold">
                                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-navy text-xs uppercase tracking-wider mb-3">Applications</h4>
                          <ul className="space-y-2">
                            {(product.applications || []).map((app, i) => (
                              <li key={i} className="flex items-start gap-2 text-zinc-700 text-xs font-semibold">
                                <Activity className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{app}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Link href={`/products/${product.id}`} className="block">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold transition-all h-12 rounded-xl group-hover:shadow-md">
                          Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Accessories & Tests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-navy flex items-center gap-3">
                <span className="w-8 h-1 bg-primary inline-block"></span> Standard Accessories
              </h3>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-150 h-full">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accessories.map((acc, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-semibold text-zinc-700">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                      <span>{acc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 text-navy flex items-center gap-3">
                <span className="w-8 h-1 bg-primary inline-block"></span> Routine & Type Tests
              </h3>
              <div className="bg-zinc-950 text-white p-8 rounded-2xl shadow-lg border-b-4 border-primary h-full">
                <p className="text-zinc-400 mb-6 text-sm">
                  We maintain rigorous testing protocols to ensure maximum reliability in the field.
                </p>
                <ul className="space-y-4">
                  {tests.map((test, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 font-semibold">
                      <Check className="text-primary w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{test}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section (from Supabase) */}
      <section className="py-24 bg-white border-t border-zinc-100">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">Our Services</h2>
            <div className="h-1 w-20 bg-primary mb-4"></div>
            <p className="text-zinc-600 text-lg">
              Beyond assembly, we offer end-to-end Implementing Technology — from prototype development to turnkey box-build production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-zinc-50 border border-zinc-150 rounded-3xl p-8 animate-pulse">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-zinc-200 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-zinc-200 rounded w-3/4" />
                      <div className="h-3 bg-zinc-100 rounded w-full" />
                      <div className="h-3 bg-zinc-100 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-50 border border-zinc-150 rounded-3xl p-8 hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-6">
                    <div className="flex items-start gap-5">
                      <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        {iconMap[service.icon] || <Settings className="w-8 h-8" />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-navy group-hover:text-primary transition-colors mb-2">{service.title}</h3>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {(service.industries || []).map((ind) => (
                            <span key={ind} className="bg-white border border-zinc-200 text-zinc-600 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                              {ind}
                            </span>
                          ))}
                        </div>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-6">{service.description}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-200/50">
                      <h4 className="font-bold text-navy text-xs uppercase tracking-wider mb-3">Service Benefits</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(service.benefits || []).map((h, j) => (
                          <li key={j} className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link href="/contact" className="block">
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white font-bold h-12 rounded-xl transition-all">
                        Inquire About Service <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Quality Banner */}
      <section className="py-16 bg-zinc-950 text-white border-t-4 border-primary">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-primary/10 rounded-xl">
                <ShieldCheck className="text-primary w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">IPC-A-610 Compliant & Quality Assured</h3>
                <p className="text-zinc-400 mt-1">Every assembly leaves our facility fully inspected and certified.</p>
              </div>
            </div>
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 text-base shadow-lg shadow-primary/20 flex-shrink-0">
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
