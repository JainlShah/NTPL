import Footer from "./footer/Footer";

const ProtectedRoute = ({ children }) => {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken"); // Check both local and session storage

  return (
    <div id="root">
      <div className="content">{children}</div>
      <Footer />
    </div>
  );
};

export default ProtectedRoute;
