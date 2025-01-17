import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <div className="card">
        <p>Goiytangqua</p>
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
