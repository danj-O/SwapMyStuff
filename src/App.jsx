import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Account from "components/Account/Account";
import Chains from "components/Chains";
// import TokenPrice from "components/TokenPrice";
// import ERC20Balance from "components/ERC20Balance";
// import ERC20Transfers from "components/ERC20Transfers";
// import DEX from "components/DEX";
// import NFTBalance from "components/NFTBalance";
// import Swap from "components/Swap";
// import LayoutTest from "components/LayoutTest";
// import Wallet from "components/Wallet";
import { Layout } from "antd";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
// import QuickStart from "components/QuickStart";
// import Contract from "components/Contract/Contract";
// import Text from "antd/lib/typography/Text";
// import Ramper from "components/Ramper";
import MenuItems from "./components/MenuItems";
import CreateSwap from "components/CreateSwap";
import FindSwap from "components/FindSwap";
import MyContracts from "components/MyContracts";

const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <Logo />
          <MenuItems />
          <div style={styles.headerRight}>
            <Chains />
            {/* <TokenPrice
              address="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
              chain="eth"
              image="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/"
              size="40px"
            /> */}
            <NativeBalance />
            <Account />
          </div>
        </Header>

        <div style={styles.content}>
          <Switch>
            <Route path="/CreateSwap">
              <CreateSwap />
            </Route>
            <Route path="/FindSwap">
              <FindSwap />
            </Route>
            <Route path="/MyContracts">
              <MyContracts />
            </Route>
            <Route path="/">
              <Redirect to="/CreateSwap" />
            </Route>
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
          </Switch>
        </div>
      </Router>
      <Footer style={{ textAlign: "center" }}>
        <p>Alice and Bob's SwapShop</p>
        
      </Footer>
    </Layout>
  );
};

export const Logo = () => (
  <div style={{ display: "flex", width: "95px" }}>
    <img src="/mand.jpeg" style={{width: "95px"}} alt="" srcset="" />
  </div>
);

export default App;
