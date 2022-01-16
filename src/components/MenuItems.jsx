import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/CreateSwap">
        <NavLink to="/CreateSwap">🚀 CREATE NEW SWAP🚀 </NavLink>
      </Menu.Item>
      <Menu.Item key="/FindSwap">
        <NavLink to="/FindSwap">🚀 FIND SWAP🚀 </NavLink>
      </Menu.Item>
      <Menu.Item key="/MyContracts">
        <NavLink to="/MyContracts">🚀 MY SWAP CONTRACTS🚀 </NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
