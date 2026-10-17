import { useContext, useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaRegEye,
  FaRegEyeSlash,
  FaRegEnvelope,
  FaLock,
  FaRegUser,
  FaBirthdayCake,
  FaSpinner,
} from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";
import { useLanguage } from "../../Context/LanguageContext";
import {
  LoginSchema,
  type LoginSchemaType,
  RegisterSchema,
  type RegisterSchemaType,
} from "../../schemas/auth.schema";
import authSide from "../../assets/auth-side.jpg";

type Mode = "login" | "register";

/* ---------- input wrapper: icon + field + error ---------- */
function InputShell({
  icon,
  error,
  trailing,
  children,
}: {
  icon: ReactElement;
  error?: string;
  trailing?: ReactElement;
  children: ReactElement;
}) {
  return (
    <div>
      <div className="relative">
        <span className="absolute top-[50%] start-3 translate-y-[-50%] text-slate-400">
          {icon}
        </span>
        {children}
        {trailing}
      </div>
      {error && <p className="mt-1 text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white p-3 ps-10 pe-10 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition";

export default function AuthTemplate({
  initialMode = "login",
}: {
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode); // switch WITHOUT refresh
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegRe, setShowRegRe] = useState(false);

  const { setuserLogin } = useContext(AuthContext);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const loginForm = useForm<LoginSchemaType>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
  });

  const registerForm = useForm<RegisterSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "male",
    },
    resolver: zodResolver(RegisterSchema),
    mode: "onTouched",
  });

  function switchTo(m: Mode) {
    setMode(m);
    setApiError(null);
  }

  /* ---------- same API logic as before ---------- */
  function handleLogin(values: LoginSchemaType) {
    setIsLoading(true);
    setApiError(null);
    axios
      .post(`https://route-posts.routemisr.com/users/signin`, values)
      .then((res) => {
        const token = res.data?.data?.token ?? res.data?.token; // tolerate both shapes
        if (!token) {
          setApiError(res.data?.message ?? "login failed: no token returned");
          return;
        }
        localStorage.setItem("userToken", token);
        setuserLogin(token);
        toast.success(res.data?.message ?? "welcome back");
        navigate("/", { replace: true });
      })
      .catch((err) =>
        setApiError(err.response?.data?.message ?? "login failed"),
      )
      .finally(() => setIsLoading(false));
  }

  function handleRegister(values: RegisterSchemaType) {
    setIsLoading(true);
    setApiError(null);
    axios
      .post(`https://route-posts.routemisr.com/users/signup`, values)
      .then((res) => {
        // axios only reaches .then on 2xx → signup really succeeded
        toast.success(res.data?.message ?? "account created");
        registerForm.reset();
        switchTo("login"); // pure state change → login panel appears, NO refresh
      })
      .catch((err) =>
        setApiError(err.response?.data?.message ?? "register failed"),
      )
      .finally(() => setIsLoading(false));
  }
  const pillCls = (active: boolean) =>
    `flex-1 rounded-full p-2.5 text-sm font-bold cursor-pointer transition-all ${
      active
        ? "bg-indigo-600 text-white shadow"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
    }`;

  /* shared error banner (rendered inside both panels) */
  const apiErrorBanner = apiError && (
    <p className="mb-4 rounded-xl bg-red-500 text-white text-center font-bold p-2 text-sm wrap-break-word">
      {apiError}
    </p>
  );

  return (
    <div className="flex items-center justify-center px-4 py-10 md:min-h-full">
      {/* card: grid KEPT + relative so the image layer can slide over it */}
      <div className="relative w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800">
        {/* ===== mobile-only header + pill (row 1 on mobile, hidden on md) ===== */}
        <div className="md:hidden p-8 pb-0">
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
            Logo
          </p>
          <div className="flex rounded-full bg-slate-100 dark:bg-slate-700 p-1">
            <button
              onClick={() => switchTo("login")}
              className={pillCls(mode === "login")}
            >
              {t("login")}
            </button>
            <button
              onClick={() => switchTo("register")}
              className={pillCls(mode === "register")}
            >
              {t("register")}
            </button>
          </div>
        </div>

        {/* ===== LOGIN panel — column 2 on md, ALWAYS mounted ===== */}
        <div
          className={`p-8 md:p-10 md:order-2 md:flex md:flex-col md:justify-center ${
            mode === "login" ? "block" : "hidden"
          }`}
        >
          {apiErrorBanner}
          <form
            onSubmit={loginForm.handleSubmit(handleLogin)}
            className="flex flex-col gap-4"
          >
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">
              {t("login")}
            </h1>
            <InputShell
              icon={<FaRegEnvelope />}
              error={loginForm.formState.errors.email?.message}
            >
              <input
                {...loginForm.register("email")}
                type="email"
                placeholder="Enter your email"
                className={inputCls}
              />
            </InputShell>
            <InputShell
              icon={<FaLock />}
              error={loginForm.formState.errors.password?.message}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowLoginPass((p) => !p)}
                  className="absolute top-[50%] end-3 translate-y-[-50%] text-slate-500 dark:text-slate-300 cursor-pointer"
                >
                  {showLoginPass ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              }
            >
              <input
                {...loginForm.register("password")}
                type={showLoginPass ? "text" : "password"}
                placeholder="Enter your password"
                className={inputCls}
              />
            </InputShell>

            <button
              disabled={isLoading}
              type="submit"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold p-3 cursor-pointer flex items-center justify-center gap-2 transition"
            >
              {isLoading && <FaSpinner className="animate-spin" />} {t("login")}
            </button>
          </form>
        </div>

        {/* ===== REGISTER panel — column 1 on md, ALWAYS mounted ===== */}
        <div
          className={`p-8 md:p-10 md:order-1 ${
            mode === "register" ? "block" : "hidden"
          } md:block`}
        >
          {apiErrorBanner}
          <form
            onSubmit={registerForm.handleSubmit(handleRegister)}
            className="flex flex-col gap-4"
          >
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">
              {t("register")}
            </h1>
            <InputShell
              icon={<FaRegUser />}
              error={registerForm.formState.errors.name?.message}
            >
              <input
                {...registerForm.register("name")}
                type="text"
                placeholder="Enter your name"
                className={inputCls}
              />
            </InputShell>
            <InputShell
              icon={<FaRegEnvelope />}
              error={registerForm.formState.errors.email?.message}
            >
              <input
                {...registerForm.register("email")}
                type="email"
                placeholder="Enter your email"
                className={inputCls}
              />
            </InputShell>
            <InputShell
              icon={<FaBirthdayCake />}
              error={registerForm.formState.errors.dateOfBirth?.message}
            >
              <input
                {...registerForm.register("dateOfBirth")}
                type="date"
                className={inputCls}
              />
            </InputShell>
            <InputShell
              icon={<FaLock />}
              error={registerForm.formState.errors.password?.message}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowRegPass((p) => !p)}
                  className="absolute top-[50%] inset-e-3 translate-y-[-50%] text-slate-500 dark:text-slate-300 cursor-pointer"
                >
                  {showRegPass ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              }
            >
              <input
                {...registerForm.register("password")}
                type={showRegPass ? "text" : "password"}
                placeholder="Password"
                className={inputCls}
              />
            </InputShell>
            <InputShell
              icon={<FaLock />}
              error={registerForm.formState.errors.rePassword?.message}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowRegRe((p) => !p)}
                  className="absolute top-[50%] inset-e-3 translate-y-[-50%] text-slate-500 dark:text-slate-300 cursor-pointer"
                >
                  {showRegRe ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              }
            >
              <input
                {...registerForm.register("rePassword")}
                type={showRegRe ? "text" : "password"}
                placeholder="Confirm password"
                className={inputCls}
              />
            </InputShell>
            <div className="flex gap-3">
              {(["male", "female"] as const).map((g) => (
                <label
                  key={g}
                  className={`flex-1 cursor-pointer rounded-xl border p-2.5 text-center text-sm font-bold capitalize transition ${
                    registerForm.watch("gender") === g
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                      : "border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={g}
                    {...registerForm.register("gender")}
                    className="hidden"
                  />
                  {g}
                </label>
              ))}
            </div>
            {registerForm.formState.errors.gender?.message && (
              <p className="text-xs font-bold text-red-500">
                {registerForm.formState.errors.gender.message}
              </p>
            )}
            <button
              disabled={isLoading}
              type="submit"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold p-3 cursor-pointer flex items-center justify-center gap-2 transition"
            >
              {isLoading && <FaSpinner className="animate-spin" />}{" "}
              {t("register")}
            </button>
          </form>
        </div>

        {/* ===== mobile-only bottom switch link ===== */}
        <p className="md:hidden px-8 pb-8 text-center text-sm text-slate-600 dark:text-slate-300">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() => switchTo(mode === "login" ? "register" : "login")}
            className="text-indigo-600 dark:text-indigo-400 font-bold underline cursor-pointer"
          >
            {mode === "login" ? t("register") : t("login")}
          </button>
        </p>

        {/* ===== SLIDING IMAGE LAYER (the only moving element) ===== */}
        <div
          className={`hidden md:block absolute inset-y-0 start-0 w-1/2 z-10 overflow-hidden transition-transform duration-700 ease-in-out ${
            mode === "register"
              ? "md:translate-x-full md:rtl:-translate-x-full"
              : ""
          }`}
        >
          <img
            src={authSide}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-indigo-800/85 via-indigo-500/50 to-transparent" />
          {/* key={mode} ONLY here → text re-enters while panel slides */}
          <div
            key={mode}
            className="relative z-10 h-full flex flex-col justify-center gap-4 p-10 text-white animate-auth-in"
          >
            <h2 className="text-4xl font-extrabold leading-tight">
              {mode === "login" ? (
                <>
                  Welcome to <span className="text-amber-300">Logo</span>
                </>
              ) : (
                "Welcome Back!"
              )}
            </h2>
            <p className="text-white/85 text-sm leading-relaxed">
              Share posts, comment, reply, follow friends and bookmark what you
              love — all in one place.
            </p>
            {mode === "login" && (
              <ul className="space-y-2 text-sm text-white/90">
                <li>✅ Real-time feed & notifications</li>
                <li>💬 Comments, replies & mentions</li>
                <li>🌙 Dark mode + 7 languages</li>
              </ul>
            )}
            <button
              onClick={() => switchTo(mode === "login" ? "register" : "login")}
              className="mt-2 w-fit border-2 border-white rounded-full px-8 py-2.5 font-bold cursor-pointer hover:bg-white hover:text-indigo-600 transition-colors"
            >
              {mode === "login" ? t("register") : t("login")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
