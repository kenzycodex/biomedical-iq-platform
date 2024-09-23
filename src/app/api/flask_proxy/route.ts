import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "https://biomedical-iq-backend.onrender.com";

console.log('FLASK_API_URL:', FLASK_API_URL);

async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await axios.post(`${FLASK_API_URL}/auth/refresh`, {}, {
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
  try {
    const { body } = await request.json();
    const flaskPath = "/auth/register";
    const fullUrl = `${FLASK_API_URL}${flaskPath}`;

    console.log('Proxying POST request to:', fullUrl);

    const accessToken = request.headers.get('Authorization')?.split(" ")[1];
    const refreshToken = request.cookies.get('refreshToken')?.value;

    const config = {
      method: 'POST',
      url: fullUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      data: body,
    };

    console.log('Sending POST request with config:', JSON.stringify(config, null, 2));
    const response = await axios(config);
    console.log('Received response from Flask:', response.data);

    let nextResponse = NextResponse.json(response.data, { status: response.status });

    if (flaskPath === "/auth/register") {
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
    console.error('Error in Flask POST proxy:', error);

    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 401) {
        const refreshToken = request.cookies.get('refreshToken')?.value;
        if (refreshToken) {
          const newAccessToken = await refreshAccessToken(refreshToken);
          if (newAccessToken) {
            return retryRequestWithNewAccessToken(request, newAccessToken);
          }
        }
        return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
      }

      return handleAxiosError(error);
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const flaskPath = url.pathname.replace("/api/flask_proxy", "");
  const fullUrl = `${FLASK_API_URL}${flaskPath}${url.search}`;

  console.log('Proxying GET request to:', fullUrl);

  const accessToken = request.headers.get('Authorization')?.split(" ")[1];
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const config = {
    method: 'GET',
    url: fullUrl,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  };

  try {
    console.log('Sending GET request with config:', JSON.stringify(config, null, 2));
    const response = await axios(config);
    console.log('Received GET response from Flask:', response.data);

    return NextResponse.json(response.data, { status: response.status });

  } catch (error) {
    console.error('Error in Flask GET proxy:', error);

    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 401) {
        const refreshToken = request.cookies.get('refreshToken')?.value;
        if (refreshToken) {
          const newAccessToken = await refreshAccessToken(refreshToken);
          if (newAccessToken) {
            return retryRequestWithNewAccessToken(request, newAccessToken);
          }
        }
        return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
      }

      return handleAxiosError(error);
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

async function retryRequestWithNewAccessToken(request: NextRequest, newAccessToken: string) {
  const { body } = await request.json();
  const flaskPath = "/auth/register";
  const fullUrl = `${FLASK_API_URL}${flaskPath}`;

  const config = {
    method: 'POST',
    url: fullUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newAccessToken}`,
    },
    data: body,
  };

  try {
    const retryResponse = await axios(config);
    return NextResponse.json(retryResponse.data, { status: retryResponse.status });
  } catch (retryError) {
    console.error('Error on retry request:', retryError);
    return handleAxiosError(retryError);
  }
}

function handleAxiosError(error: any) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error(`Received error response from Flask API:`, error.response.data);
      return NextResponse.json(error.response.data, { status: error.response.status });
    } else if (error.request) {
      console.error("No response received from Flask API:", error.request);
      return NextResponse.json({ error: "No response received from the server" }, { status: 500 });
    } else {
      console.error("Error in request configuration:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}