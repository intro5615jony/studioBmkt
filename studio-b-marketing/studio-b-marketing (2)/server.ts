import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { sendAuthEmail } from "./server/emailService.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to determine the public app base URL (Never return localhost)
  function resolveBaseAppUrl(req?: express.Request): string {
    const envUrl = process.env.APP_URL || process.env.VITE_APP_URL;
    if (envUrl && envUrl.trim() && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl.trim().replace(/\/$/, '');
    }
    if (req) {
      const forwardedHost = req.get('x-forwarded-host');
      const host = forwardedHost || req.get('host') || '';
      const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
      if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
        return `${protocol}://${host}`.replace(/\/$/, '');
      }
    }
    return 'https://ais-dev-pgw6p22matpwpq3qeqijvp-514008090755.us-east1.run.app';
  }

  // API Routes for Auth Custom Email Service
  app.get("/api/auth/email-status", (req, res) => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const resendKey = process.env.RESEND_API_KEY;

    const isSmtpConfigured = !!(smtpHost && smtpUser && smtpPass);
    const isResendConfigured = !!resendKey;

    res.json({
      configured: isSmtpConfigured || isResendConfigured,
      provider: isSmtpConfigured ? 'SMTP' : isResendConfigured ? 'Resend' : 'Nenhum',
      senderEmail: process.env.SMTP_USER || 'contato@studiobmkt.com.br',
      senderName: 'Studio B Marketing',
      smtpHost: smtpHost || null,
      appUrl: resolveBaseAppUrl(req),
    });
  });

  app.post("/api/auth/send-custom-email", async (req, res) => {
    const { type, email, firstName, actionUrl } = req.body;

    if (!email || !type) {
      return res.status(400).json({ success: false, error: 'E-mail e tipo de mensagem são obrigatórios.' });
    }

    const baseUrl = resolveBaseAppUrl(req);
    let finalActionUrl = actionUrl;

    // Clean any existing actionUrl if provided but contains localhost
    if (finalActionUrl && typeof finalActionUrl === 'string') {
      finalActionUrl = finalActionUrl.replace(/http:\/\/localhost:\d+/g, baseUrl)
                                     .replace(/http:\/\/127\.0\.0\.1:\d+/g, baseUrl)
                                     .replace(/https:\/\/localhost:\d+/g, baseUrl);
    }

    if (!finalActionUrl) {
      try {
        const apiKey = process.env.VITE_FIREBASE_API_KEY || "AIzaSyCeMNtT4vo3-njJJiFLT2oCuXVFx1ZATng";
        const continueUrl = `${baseUrl}/admin/definir-senha`;
        
        let fbRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestType: 'PASSWORD_RESET',
            email: email,
            continueUrl: continueUrl
          })
        });

        let fbData = await fbRes.json();

        // If email not registered yet in Firebase Auth (e.g., initial user invite), create account first
        if (!fbRes.ok && fbData.error?.message?.includes('EMAIL_NOT_FOUND')) {
          console.log(`[SERVER] Provisioning new Firebase Auth account for invite: ${email}`);
          const tempPassword = `StudioB!${Math.random().toString(36).substring(2, 10)}${Math.floor(Math.random() * 1000)}`;
          
          await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              password: tempPassword,
              returnSecureToken: true
            })
          });

          // Retry sendOobCode after provisioning
          fbRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requestType: 'PASSWORD_RESET',
              email: email,
              continueUrl: continueUrl
            })
          });
          fbData = await fbRes.json();
        }

        if (fbRes.ok && fbData.oobLink) {
          const rawOobLink = fbData.oobLink as string;
          // Extract oobCode from the generated Firebase link
          const oobCodeMatch = rawOobLink.match(/[?&]oobCode=([^&]+)/);
          const oobCode = oobCodeMatch ? oobCodeMatch[1] : null;

          if (oobCode) {
            finalActionUrl = `${baseUrl}/admin/definir-senha?oobCode=${oobCode}&mode=resetPassword`;
          } else {
            finalActionUrl = rawOobLink.replace(/http:\/\/localhost:\d+/g, baseUrl)
                                       .replace(/http:\/\/127\.0\.0\.1:\d+/g, baseUrl);
          }
        } else {
          console.warn("[SERVER] Firebase sendOobCode response notice:", fbData);
          finalActionUrl = `${baseUrl}/admin/definir-senha`;
        }
      } catch (err) {
        console.warn("[SERVER] Could not retrieve oobLink directly from Firebase, falling back to default route:", err);
        finalActionUrl = `${baseUrl}/admin/definir-senha`;
      }
    }

    const result = await sendAuthEmail({
      type: type === 'invite' ? 'invite' : 'reset_password',
      to: email,
      firstName: firstName || email.split('@')[0],
      actionUrl: finalActionUrl,
      origin: baseUrl,
    });

    return res.json(result);
  });

  // API Routes for Google Business Profile Reviews
  app.get("/api/google-reviews/status", (req, res) => {
    const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
    const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    const missingVars = [];
    if (!accountId) missingVars.push("GOOGLE_BUSINESS_ACCOUNT_ID");
    if (!locationId) missingVars.push("GOOGLE_BUSINESS_LOCATION_ID");
    if (!clientId) missingVars.push("GOOGLE_CLIENT_ID");
    if (!clientSecret) missingVars.push("GOOGLE_CLIENT_SECRET");
    if (!refreshToken) missingVars.push("GOOGLE_REFRESH_TOKEN");

    res.json({
      configured: missingVars.length === 0,
      missingVars,
    });
  });

  app.post("/api/google-reviews/sync", async (req, res) => {
    const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
    const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    const missingVars = [];
    if (!accountId) missingVars.push("GOOGLE_BUSINESS_ACCOUNT_ID");
    if (!locationId) missingVars.push("GOOGLE_BUSINESS_LOCATION_ID");
    if (!clientId) missingVars.push("GOOGLE_CLIENT_ID");
    if (!clientSecret) missingVars.push("GOOGLE_CLIENT_SECRET");
    if (!refreshToken) missingVars.push("GOOGLE_REFRESH_TOKEN");

    if (missingVars.length > 0) {
      return res.status(400).json({
        configured: false,
        message: "Credenciais do Google Business Profile não configuradas no servidor.",
        missingVars,
      });
    }

    try {
      // 1. Refresh OAuth Access Token
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId!,
          client_secret: clientSecret!,
          refresh_token: refreshToken!,
          grant_type: "refresh_token",
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Erro ao renovar token OAuth do Google:", errorText);
        return res.status(500).json({
          configured: true,
          error: "Falha na autenticação OAuth do Google. Verifique Client ID, Secret e Refresh Token.",
        });
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // 2. Fetch Reviews from Google Business Profile API
      const reviewsResponse = await fetch(
        `https://mybusinessreviews.googleapis.com/v1/accounts/${accountId}/locations/${locationId}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!reviewsResponse.ok) {
        const errorText = await reviewsResponse.text();
        console.error("Erro na API de Avaliações do Google Business Profile:", errorText);
        return res.status(500).json({
          configured: true,
          error: "Erro ao buscar avaliações no Google Business Profile API.",
        });
      }

      const reviewsData = await reviewsResponse.json();
      const rawReviews = reviewsData.reviews || [];

      // Format standard Google reviews structure
      const formattedReviews = rawReviews.map((rev: any) => {
        let ratingNumber = 5;
        if (typeof rev.starRating === "number") {
          ratingNumber = rev.starRating;
        } else if (rev.starRating === "FIVE") ratingNumber = 5;
        else if (rev.starRating === "FOUR") ratingNumber = 4;
        else if (rev.starRating === "THREE") ratingNumber = 3;
        else if (rev.starRating === "TWO") ratingNumber = 2;
        else if (rev.starRating === "ONE") ratingNumber = 1;

        return {
          googleReviewId: rev.reviewId || rev.name,
          authorName: rev.reviewer?.displayName || "Cliente do Google",
          authorPhoto: rev.reviewer?.profilePhotoUrl || "",
          rating: ratingNumber,
          comment: rev.comment || "",
          reviewDate: rev.createTime || new Date().toISOString(),
          updatedAt: rev.updateTime || new Date().toISOString(),
        };
      });

      return res.json({
        configured: true,
        reviews: formattedReviews,
      });
    } catch (error: any) {
      console.error("Exceção na sincronização com Google Business Profile:", error);
      return res.status(500).json({
        configured: true,
        error: error.message || "Erro interno no servidor ao conectar com o Google.",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
