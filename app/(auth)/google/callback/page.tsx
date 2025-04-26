"use client";
import { useAuth } from "@/components/auth-provider";
import LoadingAnimation from "@/components/loadingAnimation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { KeySquare, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function GoogleAuthCallback() {
  const router = useRouter();
  const { checkSession } = useAuth()
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const handleGoogleAuth = useCallback(
    async (token: string) => {
      try {
        const response = await axios.post("/api/auth/google-auth", {
          access_token: token,
        });

        console.log("response", response);

        if (response.status !== 200) {
          throw new Error("Invalid login");
        }

        setSuccess(true);
        setLoading(false);
        await checkSession()
        setTimeout(() => {
          router.push("/");
        }, 1500); // pequena pausa para mostrar sucesso
      } catch (error) {
        console.error("Google auth error:", error);
        router.push("/login");
      }
    },
    [router]
  );

  useEffect(() => {
    const hash = window.location.hash.substring(1); // tira o “#”
    const params = hash.split("&");
    const token = params
      .find((p) => p.startsWith("access_token="))
      ?.split("=")[1];


    console.log("hash", hash, "token:", token);

    if (!token) {
      router.push("/login");
      return;
    }

    handleGoogleAuth(token);
  }, [router, handleGoogleAuth]);

  return (
    <section className="grid place-content-center min-h-screen">
      <Card className="p-6 w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-50">
            {loading ? "Validando seu login..." : "Login Validado!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {loading && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-40 h-40">
                <LoadingAnimation />
              </div>
              <p className="text-slate-200">Carregando seus dados...</p>
            </div>
          )}
          {!loading && success && (
            <div className="flex flex-col items-center gap-2">
              <KeySquare className="text-green-500 w-16 h-16" />
              <p className="text-green-600 font-medium">Login efetuado com sucesso!</p>
              <p className="text-gray-200 text-sm">Redirecionando para menu inicial...</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="mt-4"
          >
            Ir para menu inicial
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

