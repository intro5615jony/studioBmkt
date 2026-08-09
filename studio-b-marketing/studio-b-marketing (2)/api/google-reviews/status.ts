export default async function handler(req: any, res: any) {
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

  return res.status(200).json({
    configured: missingVars.length === 0,
    missingVars,
  });
}
