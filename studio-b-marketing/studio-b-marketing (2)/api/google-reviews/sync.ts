export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

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

    return res.status(200).json({
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
}
