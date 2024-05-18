import LeftSideBar from "./_component/left-side-bar";
import TopBar from "./_component/top-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-lg:flex-col text-grey-1">
    <LeftSideBar />
    <TopBar />
  <div className="flex-1">{children}</div>
  </div>
  );
}

