import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { SignJWT } from "jose";
import { jwtSecret } from "@/lib/config/config";
import { cookies } from "next/headers";
import { addHours } from "date-fns";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const JWT_SECRET = jwtSecret;

async function handleGoogleAuth(token: string) {
  const res = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
  );
  if (!res.ok) {
    throw new Error("Falha ao obter dados do usuário do Google");
  }
  const userInfo = await res.json();
  console.log("🚀 ~ handleGoogleAuth ~ userInfo:", userInfo)
  return userInfo;  // ← não esqueça de retornar!
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { access_token } = z
      .object({ access_token: z.string() })
      .parse(body);

    // 1) valida token e pega info básica
    const client = new OAuth2Client();
    const tokenInfo = await client.getTokenInfo(access_token);

    if (!tokenInfo.email || !tokenInfo.email_verified) {
      throw new Error("E-mail inválido ou não verificado");
    }

    // 2) busca nome e foto de perfil
    const userGoogle = await handleGoogleAuth(access_token);
    const name = userGoogle.name ?? "Usuário";
    const picture = userGoogle.picture;

    // 3) procura/cria no banco
    let user = await prisma.user.findUnique({
      where: { email: tokenInfo.email },
    });
    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await prisma.user.create({
        data: {
          name,
          email: tokenInfo.email,
          password: hashedPassword,
          image: picture,
          role: "USER",
        },
      });
    }

    // 4) gera JWT e seta cookie
    const jwt = await new SignJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true });
    response.cookies.set("auth-token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[POST] Auth Google:", error);
    return NextResponse.json(
      { error: "Erro ao autenticar com Google" },
      { status: 401 }
    );
  }
}
