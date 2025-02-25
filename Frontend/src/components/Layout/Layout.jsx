import React, { Fragment } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Routers from "../../routers/Routers";
import { AuthProvider } from '../../pages/authContext';

const Layout = () => {
  const location = useLocation();

  const hideHeaderFooter = location.pathname.includes('/AdminPanel') || location.pathname.includes('/UserPanel');

  return (
    <Fragment>
      {/* {!hideHeaderFooter && <Header />} */}
      <div>
        <AuthProvider>
          <Routers />
        </AuthProvider>
      </div>
      {/* {!hideHeaderFooter && <Footer />} */}
    </Fragment>
  );
};

export default Layout;
