import Nav from "./nav";
import Footer from "./footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
  <div className="min-h-full w-7/12 mx-auto">
    <Nav />
    <div className="min-h-full text-gray-900 md:px-0 px-4">
      <main className="py-5">{children}</main>
    </div>
    <div className="sticky top-[100vh]">
      <Footer />
    </div>
  </div>
);

export default Layout;
