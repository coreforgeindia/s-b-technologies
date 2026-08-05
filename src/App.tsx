import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import WhyUs from "@/pages/why-us";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Industries from "@/pages/industries";
import Projects from "@/pages/projects";
import Gallery from "@/pages/gallery";
import Resources from "@/pages/resources";
import FAQs from "@/pages/faqs";
import Contact from "@/pages/contact";
import { Layout } from "@/components/layout";

// Admin imports
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminGallery from "@/pages/admin/gallery";
import AdminProjects from "@/pages/admin/projects";
import AdminProfile from "@/pages/admin/profile";
import AdminLogs from "@/pages/admin/logs";
import { AdminAuthProvider, AdminAuthGuard, AdminLayout } from "@/components/admin-layout";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [pathname] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/why-us" component={WhyUs} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/industries" component={Industries} />
        <Route path="/projects" component={Projects} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/resources" component={Resources} />
        <Route path="/faqs" component={FAQs} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AdminRouter() {
  return (
    <AdminAuthProvider>
      <Switch>
        {/* Login page - no auth guard */}
        <Route path="/admin">
          <AdminLogin />
        </Route>

        {/* Protected admin pages */}
        <Route path="/admin/dashboard">
          <AdminAuthGuard>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminAuthGuard>
        </Route>
        <Route path="/admin/products">
          <AdminAuthGuard>
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </AdminAuthGuard>
        </Route>
        <Route path="/admin/gallery">
          <AdminAuthGuard>
            <AdminLayout>
              <AdminGallery />
            </AdminLayout>
          </AdminAuthGuard>
        </Route>
        <Route path="/admin/projects">
          <AdminAuthGuard>
            <AdminLayout>
              <AdminProjects />
            </AdminLayout>
          </AdminAuthGuard>
        </Route>
        <Route path="/admin/profile">
          <AdminAuthGuard>
            <AdminLayout>
              <AdminProfile />
            </AdminLayout>
          </AdminAuthGuard>
        </Route>
        <Route path="/admin/logs">
          <AdminAuthGuard>
            <AdminLayout>
              <AdminLogs />
            </AdminLayout>
          </AdminAuthGuard>
        </Route>
      </Switch>
    </AdminAuthProvider>
  );
}

function App() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  return isAdmin ? <AdminRouter /> : <Router />;
}

function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ScrollToTop />
          <App />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default AppWrapper;
