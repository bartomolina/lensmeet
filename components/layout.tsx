import Nav from "./nav";
import Footer from "./footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
  <div className="min-h-full">
    <div className="max-w-2xl mx-auto text-gray-900 md:px-0 px-4">
      <Nav />
      <main className="py-5">{children}</main>
      <div className="sticky top-[100vh]">
        <Footer />
      </div>
    </div>
  </div>
);

export default Layout;
