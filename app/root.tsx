import {
  Links,
  Meta,
  Outlet,
  NavLink,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  useLocation,
} from "@remix-run/react";
import "./tailwind.css";
import { useChangeLanguage } from "remix-i18next/react";
import { useTranslation } from "react-i18next";
import i18next from "./i18next.server";
import {
  LoaderFunctionArgs,
  MetaFunction,
  LinksFunction,
  json,
} from "@remix-run/cloudflare";
import { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request);
  const t = await i18next.getFixedT(request);
  const title = t("ui.title");
  return json({ locale, title });
}
export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data ? data.title : "" },
    { name: "description", content: "Welcome to DST Cooking Simulator" },
  ];
};
export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "/font/hwmct/result.css",
      crossOrigin: "anonymous",
    },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  // Get the locale from the loader
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);
  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body className="flex justify-center max-h-dvh h-dvh max-w-dvw w-dvw bg-full bg-clip-border bg-bottom bg-no-repeat bg-cover backdrop-blur-lg backdrop-brightness-75">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigate = useNavigate();
  const { locale } = useLoaderData<typeof loader>();
  const [show, setShow] = useState<boolean>(false);
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <div className="font-hwmct p-4 flex flex-col items-center w-full xl:w-3/5 fixed">
      <div className="w-full flex justify-between items-cente ">
        <NavLink to={"/?lang=" + locale}>
          <h1 className="font-medium content-center text-center text-base">
            {t("ui.title")}
          </h1>
        </NavLink>
        <div className="flex">
          <h1
            className={`w-20 h-9 bg-button bg-cover bg-no-repeat content-center text-center font-medium hover:brightness-75 brightness-100 ${
              location.pathname.indexOf("cookpot") != -1 && "saturate-200"
            }`}
          >
            <NavLink className="-ml-1" to={"cookpot?lang=" + locale}>
              {t("ui.cookpot")}
            </NavLink>
          </h1>
          <h1
            className={`w-20 h-9 bg-button bg-cover bg-no-repeat content-center text-center font-medium hover:brightness-75 brightness-100 ${
              location.pathname.indexOf("foods") != -1 && "saturate-200"
            }`}
          >
            <NavLink className="-ml-1" to={"foods?lang=" + locale}>
              {t("ui.foods")}
            </NavLink>
          </h1>
        </div>
      </div>
      <div className="w-dvw border-b border-b-black"></div>
      <div className="flex w-full mt-6 text-center content-center">
        <Outlet />
      </div>
      <div
        className={`w-20 flex flex-col fixed bottom-1 justify-center items-center ${
          location.pathname.indexOf("foods") != -1 ? "left-1" : "right-0"
        }`}
      >
        {show && (
          <span className="flex flex-col ">
            <button
              onClick={() => {
                setShow(false);
                navigate("?lang=en-US");
              }}
            >
              <p className="w-20 h-8 mb-2 bg-button bg-cover bg-no-repeat text-center content-center font-medium">
                English
              </p>
            </button>
            <button
              onClick={() => {
                setShow(false);
                navigate("?lang=zh-CN");
              }}
            >
              <p className="w-20 h-8 mb-2 bg-button bg-cover bg-no-repeat text-center content-center font-medium">
                简体中文
              </p>
            </button>
          </span>
        )}
        <button
          onClick={() => {
            setShow(!show);
          }}
        >
          <p className="w-14 h-14 rounded-full bg-book text-center content-center bg-cover"></p>
        </button>
      </div>
      <div className="fixed bottom-1 text-sm">
        <NavLink to="https://github.com/lolligoo/DST-Cooking-Simulator">
          © {new Date().getFullYear()} Lolligoo
        </NavLink>
      </div>
    </div>
  );
}
