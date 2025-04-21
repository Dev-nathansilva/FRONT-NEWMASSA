"use client";

import "@/app/globals.css";
import { createContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
} from "@/components/ui/dialog";
import { Button, DialogCloseTrigger, DialogTrigger } from "@chakra-ui/react";
import { TbAlertOctagonFilled } from "react-icons/tb";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false); // Estado para exibir o diálogo
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("token");
      const urlTokenVerify = searchParams.get("token");

      if (pathname === "/") return;

      if (!token && !urlTokenVerify) {
        router.push("/login");
        return;
      }

      if (urlTokenVerify) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/home`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data.user);
      } catch (error) {
        Cookies.remove("token");
        setError(true); // Ativa o diálogo de erro
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [searchParams, pathname, router]);

  const handleClose = () => {
    setError(false);
    router.push("/login"); // Redireciona somente após o usuário clicar em OK
  };

  return (
    <AuthContext.Provider value={{ user }}>
      {error && (
        <DialogRoot open={error} role="alertdialog" className="z-[1300]">
          <DialogBackdrop className="z-[1200]" />
          <DialogContent className="dialog-content">
            <DialogHeader>
              <DialogTitle className="title-dialog">
                <TbAlertOctagonFilled style={{ marginRight: "10px" }} />
                Sessão Expirada
              </DialogTitle>
            </DialogHeader>
            <DialogBody className="dialog-body">
              <p>Sua sessão expirou. Faça login novamente...</p>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button onClick={handleClose} className="button-dialog">
                  Ok
                </Button>
              </DialogActionTrigger>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogRoot>
      )}
      {children}
    </AuthContext.Provider>
  );
}
