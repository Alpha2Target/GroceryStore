import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Auth = () => {
  const [state, setState] = useState("login"); // or "register"
  const [authType, setAuthType] = useState("user"); // or "seller"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    setShowUserLogin,
    setShowSellerLogin,
    setUser,
    setIsSeller,
    axios,
    navigate,
  } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload =
        state === "register" ? { name, email, password } : { email, password };

      const endpoint = `/api/${authType}/${state}`;
      const { data } = await axios.post(endpoint, payload);

      if (data.success) {
        toast.success(data.message);

        if (authType === "user") {
          setUser(data.user);
          setShowUserLogin(false);
          navigate("/");
        } else {
          setIsSeller(true);
          setShowSellerLogin(false);
          navigate("/seller");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Auth error:", error);
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      onClick={() => {
        setShowUserLogin(false);
        setShowSellerLogin(false);
      }}
      className="fixed top-0 left-0 bottom-0 right-0 z-30 flex items-center justify-center bg-black/50 text-gray-600"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-indigo-500 capitalize">{authType}</span>{" "}
          {state === "login" ? "Login" : "Register"}
        </p>

        {/* Auth Type Toggle */}
        <div className="flex gap-4 w-full">
          <button
            type="button"
            onClick={() => setAuthType("user")}
            className={`flex-1 border p-2 rounded-md ${
              authType === "user"
                ? "bg-indigo-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setAuthType("seller")}
            className={`flex-1 border p-2 rounded-md ${
              authType === "seller"
                ? "bg-indigo-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Seller
          </button>
        </div>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            type="password"
            required
          />
        </div>

        <p className="text-sm">
          {state === "register" ? (
            <>
              Already have an account?{" "}
              <span
                className="text-indigo-500 cursor-pointer"
                onClick={() => setState("login")}
              >
                Login
              </span>
            </>
          ) : (
            <>
              New here?{" "}
              <span
                className="text-indigo-500 cursor-pointer"
                onClick={() => setState("register")}
              >
                Register
              </span>
            </>
          )}
        </p>

        <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
