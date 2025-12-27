import SidebarAdmin from "./SidebarAdmin";
import HeaderAdmin from "./HeaderAdmin";

export default function LayoutAdmin({ title, children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdmin />
      <div className="flex-1 flex flex-col">
        <HeaderAdmin title={title} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
