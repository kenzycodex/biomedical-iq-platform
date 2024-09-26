import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "https://biomedical-iq-backend.onrender.com";

// Helper to refresh the access token
async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await axios.post(`${FLASK_API_URL}/auth/refresh`, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

// Helper to retrieve tokens from the request
const getTokens = (request: NextRequest) => {
  const accessToken = request.headers.get('Authorization')?.split(" ")[1];
  const refreshToken = request.cookies.get('refreshToken')?.value;
  return { accessToken, refreshToken };
};

// Manage cookies and headers in response
const handleResponse = (nextResponse: NextResponse, responseData: any, request: NextRequest) => {
  const isLocalhost = request.headers.get('host')?.includes('localhost');
  const isSecureCookie = !isLocalhost; // Use secure cookies only when not on localhost

  if (responseData.refresh_token) {
    nextResponse.cookies.set('refreshToken', responseData.refresh_token, {
      httpOnly: true,
      secure: isSecureCookie,  // Secure in production, not secure on localhost
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 1 week
      path: '/'
    });
  }
  if (responseData.user) {
    nextResponse.headers.set('X-User-Data', JSON.stringify(responseData.user));
  }
  if (responseData.access_token) {
    nextResponse.headers.set('X-Access-Token', responseData.access_token);
  }
};

// Handle Axios errors consistently
const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const errorMessage = error.response ? error.response.data : { error: "No response from server" };
    return NextResponse.json(errorMessage, { status: error.response?.status || 500 });
  }
  return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
};

// Helper to handle authenticated API requests with interceptor logic
async function makeAuthenticatedRequest(request: NextRequest, path: string, method: string, body?: any) {
  const { accessToken, refreshToken } = getTokens(request);
  const fullUrl = `${FLASK_API_URL}${path}`;
  const config = {
    method,
    url: fullUrl,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    ...(body && { data: body }),
  };

  try {
    const response = await axios(config);
    const nextResponse = NextResponse.json(response.data, { status: response.status });
    handleResponse(nextResponse, response.data, request);
    return nextResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401 && refreshToken) {
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (newAccessToken) {
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        try {
          const retryResponse = await axios(config);
          const nextResponse = NextResponse.json(retryResponse.data, { status: retryResponse.status });
          handleResponse(nextResponse, retryResponse.data, request);
          return nextResponse;
        } catch (retryError) {
          return handleAxiosError(retryError);
        }
      } else {
        // Refresh token is invalid, return user-friendly message
        return NextResponse.json({ error: "Session expired, please log in again" }, { status: 401 });
      }
    }
    return handleAxiosError(error);
  }
}

// POST handler for authentication routes
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/flask_proxy", "");
  const body = await request.json();

  const validPaths = [
    '/auth/register', '/auth/login', '/auth/refresh', 
    '/auth/logout', '/auth/update_profile', 
    '/auth/reset-password', '/auth/reset-password-confirm'
  ];

  if (validPaths.includes(path)) {
    return makeAuthenticatedRequest(request, path, 'POST', body);
  }
  return NextResponse.json({ error: "Unsupported route" }, { status: 404 });
}

// GET handler for authentication routes
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/flask_proxy", "");

  const validPaths = ['/auth/profile', '/auth/verify-email'];

  if (validPaths.includes(path)) {
    return makeAuthenticatedRequest(request, path, 'GET');
  }
  return NextResponse.json({ error: "Unsupported route" }, { status: 404 });
}

// PUT handler for updating profile
export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/flask_proxy", "");
  const body = await request.json();

  if (path === '/auth/update_profile') {
    return makeAuthenticatedRequest(request, path, 'PUT', body);
  }

  return NextResponse.json({ error: "Unsupported route" }, { status: 404 });
}