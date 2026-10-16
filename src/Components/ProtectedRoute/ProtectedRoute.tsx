import Login from "../../Pages/Login/Login";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!localStorage.getItem("userToken")) {
    return <Login />;
  } else {
    return <>{children}</>;
  }
}
