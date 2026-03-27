import React from "react";
import {
  Route,
  Navigate,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import ProductPage from "./pages/Product/ProductPage.js";
import SearchPage from "./pages/Search/SearchPage";
import SignUpPage from "./pages/Auth/SignUpPage.js";
import HomePage from "./pages/Home/HomePage";
import Navbar from "./components/Navbar/Navbar.js";
import MyOrdersPage from "./pages/MyOrders/MyOrdersPage.js";
import WishlistPage from "./pages/Wishlist/WishlistPage.js";
import CartPage from "./pages/Cart/CartPage.js";
import AccountSettings from "./pages/AccountSettings/ProfilePage.js";
import EventPage from "./pages/Events/EventPage.js";
import SignInPage from "./pages/Auth/SignInPage.js";
import CheckoutPage from "./pages/checkout/CheckoutPage.js"; // ← import CheckoutPage not CheckoutModelProduct
import PaymentPage from "./pages/payment/PaymentPage.js";

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:pid" element={<ProductPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<AccountSettings />} />
          <Route path="/myorders" element={<MyOrdersPage />} />
          <Route path="/checkout" element={<CheckoutPage />} /> {/* ← fixed */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route
            path="/premium-sale"
            element={<EventPage festive={"Premium Sale"} />}
          />
          <Route path="/lapfest" element={<EventPage festive={"LapFest"} />} />
          <Route
            path="/mobile-mania"
            element={<EventPage festive={"Mobile Mania"} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
