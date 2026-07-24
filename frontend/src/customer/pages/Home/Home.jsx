import MainLayout from "../../layouts/MainLayout";
import Hero from "../../components/Hero/Hero";
import TrustStrip from "../../components/TrustStrip/TrustStrip";
import Categories from "../../components/Categories/Categories";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import OffersBanner from "../../components/OffersBanner/OffersBanner";
import WhyChoose from "../../components/WhyChoose/WhyChoose";
import Testimonials from "../../components/Testimonials/Testimonials";
import InstagramSection from "../../components/InstagramSection/InstagramSection";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";

function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <Hero />

      {/* Trust Badges */}
      <TrustStrip />

      {/* Shop by Category */}
      <Categories />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Limited Time Offer */}
      <OffersBanner />

      {/* Why Choose MK Jewellers */}
      <WhyChoose />

      {/* Customer Reviews */}
      <Testimonials />

      {/* Instagram Gallery */}
      <InstagramSection />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </MainLayout>
  );
}

export default Home;