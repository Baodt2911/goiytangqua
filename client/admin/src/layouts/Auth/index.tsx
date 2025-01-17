import { Outlet } from "react-router-dom";
// import logo from "../../assets/logos/logo-dark.png";
import { Layout } from "antd";
function AuthLayout() {
  return (
    <Layout
      style={{
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Outlet />
    </Layout>
  );
}

export default AuthLayout;
