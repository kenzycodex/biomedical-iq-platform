import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "https://biomedical-iq-backend.onrender.com";

console.log('FLASK_API_URL:', FLASK_API_URL);

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

export async function POST(request: NextRequest) {
  const { method, url, headers, body } = await request.json();
  const flaskPath = url?.replace("/api/flask_proxy", "") || "";
  const fullUrl = `${FLASK_API_URL}${flaskPath}`;

  console.log('Proxying request to:', fullUrl);

  let accessToken = headers.authorization?.split(" ")[1];
  const refreshToken = request.cookies.get('refreshToken')?.value;

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
    console.log('Sending request with config:', JSON.stringify(config, null, 2));
    const response = await axios(config);
    console.log('Received response:', response.data);

    let nextResponse = NextResponse.json(response.data, { status: response.status });

    if (flaskPath === "/register" || flaskPath === "/google-signin") {
      if (response.data.refresh_token) {
        nextResponse.cookies.set('refreshToken', response.data.refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60,
          path: '/'
        });
      }
      nextResponse.headers.set('X-User-Data', JSON.stringify(response.data.user));
      nextResponse.headers.set('X-Access-Token', response.data.access_token);
    }

    return nextResponse;
  } catch (error) {
    console.error('Error in Flask proxy:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401 && refreshToken) {
          const newAccessToken = await refreshAccessToken(refreshToken);
          if (newAccessToken) {
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            try {
              const retryResponse = await axios(config);
              return NextResponse.json(retryResponse.data, { status: retryResponse.status });
            } catch (retryError) {
              if (axios.isAxiosError(retryError) && retryError.response) {
                return NextResponse.json(retryError.response.data, { status: retryError.response.status });
              } else {
                return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
              }
            }
          } else {
            return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
          }
        } else {
          return NextResponse.json(error.response.data, { status: error.response.status });
        }
      } else if (error.request) {
        return NextResponse.json({ error: "No response received from the server" }, { status: 500 });
      } else {
        return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
  }
}