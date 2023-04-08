import Nav from "./nav";
import Footer from "./footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
  <div className="min-h-full sm:w-10/12 md:w-9/12 lg:w-8/12 2xl:w-7/12 max-w-4xl mx-auto">
    <Nav />
    <div className="min-h-full text-gray-900 sm:px-0 px-3">
      <main className="py-5">{children}</main>
    </div>
    <div className="sticky top-[100vh]">
      <Footer />
    </div>
  </div>
);

export default Layout;
