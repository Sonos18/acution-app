import Footer from "../components/footer";
import { Nav } from "../components/navbar-menu";

const LayoutProfile = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Nav />
      <div className="flex flex-col min-h-screen">
        {children}
        <Footer />
      </div>
    </>
  );
};

export default LayoutProfile;
