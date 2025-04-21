import "./globals.css";
import { Suspense } from "react";
import { Provider } from "@/components/ui/provider";
import AuthProvider from "@/context/AuthContext";
import Spinner from "@/components/Spinner";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <Suspense
            fallback={
              <div className="flex justify-center">
                <Spinner />
              </div>
            }
          >
            <AuthProvider>{children}</AuthProvider>
          </Suspense>
        </Provider>
      </body>
    </html>
  );
}
