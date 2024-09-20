import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "https://biomedical-iq-backend.onrender.com";

console.log('FLASK_API_URL:', FLASK_API_URL);  // Log the API URL

// Helper function to refresh the access token
async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await axios.post(`${FLASK_API_URL}/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { method, url, headers, body } = await req.json();
  const flaskPath = url?.replace("/api/flask_proxy", "") || "";
  const fullUrl = `${FLASK_API_URL}${flaskPath}`;

  console.log('Proxying request to:', fullUrl);  // Log the full URL

  let accessToken = headers.authorization?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  const config = {
    method: method as any,
    url: fullUrl,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    data: body,
  };

  try {
    console.log('Sending request with config:', JSON.stringify(config, null, 2));  // Log the request config
    const response = await axios(config);
    console.log('Received response:', response.data);  // Log the response

    if (flaskPath === "/register" || flaskPath === "/google-signin") {
      if (response.data.refresh_token) {
        res.setHeader('Set-Cookie', `refreshToken=${response.data.refresh_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`);
      }
      res.setHeader('X-User-Data', JSON.stringify(response.data.user));
      res.setHeader('X-Access-Token', response.data.access_token);
    }

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in Flask proxy:', error);  // Log any errors
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401 && refreshToken) {
          const newAccessToken = await refreshAccessToken(refreshToken);
          if (newAccessToken) {
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            try {
              const retryResponse = await axios(config);
              return res.status(retryResponse.status).json(retryResponse.data);
            } catch (retryError) {
              if (axios.isAxiosError(retryError) && retryError.response) {
                return res.status(retryError.response.status).json(retryError.response.data);
              } else {
                return res.status(500).json({ error: "An unexpected error occurred" });
              }
            }
          } else {
            return res.status(401).json({ error: "Authentication failed" });
          }
        } else {
          return res.status(error.response.status).json(error.response.data);
        }
      } else if (error.request) {
        return res.status(500).json({ error: "No response received from the server" });
      } else {
        return res.status(500).json({ error: "An error occurred while processing your request" });
      }
    } else {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
}