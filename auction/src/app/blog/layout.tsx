import Footer from "../components/footer";
import { Nav } from "../components/navbar-menu";

const LayoutBlog = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
};

export default LayoutBlog;
