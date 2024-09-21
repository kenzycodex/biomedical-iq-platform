import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

// Set the Flask API URL from environment variables or use a default
const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "https://biomedical-iq-backend.onrender.com";

console.log('FLASK_API_URL:', FLASK_API_URL);

// Function to refresh access tokens
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

// Proxy POST requests to Flask API
export async function POST(request: NextRequest) {
  try {
    // Get body and construct URL for Flask
    const { body } = await request.json();
    const flaskPath = "/auth/register";  // Set the proper Flask endpoint
    const fullUrl = `${FLASK_API_URL}${flaskPath}`;

    console.log('Proxying POST request to:', fullUrl);

    const accessToken = request.headers.get('Authorization')?.split(" ")[1];
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Axios config for POST request
    const config = {
      method: 'POST',  // Explicit method
      url: fullUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),  // Use access token if available
      },
      data: body,  // Send the body as-is
    };

    // Send the request to Flask API
    console.log('Sending POST request with config:', JSON.stringify(config, null, 2));
    const response = await axios(config);
    console.log('Received response from Flask:', response.data);

    // Create the response object to send back to the client
    let nextResponse = NextResponse.json(response.data, { status: response.status });

    // Handle setting tokens and headers for authentication routes
    if (flaskPath === "/auth/register" || flaskPath === "/auth/google-signin") {
      if (response.data.refresh_token) {
        nextResponse.cookies.set('refreshToken', response.data.refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60,  // 1 week expiration
          path: '/'
        });
      }
      // Set additional headers with user info and tokens
      nextResponse.headers.set('X-User-Data', JSON.stringify(response.data.user));
      nextResponse.headers.set('X-Access-Token', response.data.access_token);
    }

    return nextResponse;

  } catch (error) {
    console.error('Error in Flask POST proxy:', error);

    // Handle 401 and refresh token if necessary
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

// Proxy GET requests to Flask API
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const flaskPath = url.pathname.replace("/api/flask_proxy", "");
  const fullUrl = `${FLASK_API_URL}${flaskPath}${url.search}`;

  console.log('Proxying GET request to:', fullUrl);

  const accessToken = request.headers.get('Authorization')?.split(" ")[1];
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // Axios config for GET request
  const config = {
    method: 'GET',
    url: fullUrl,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),  // Use access token if available
    },
  };

  try {
    console.log('Sending GET request with config:', JSON.stringify(config, null, 2));
    const response = await axios(config);
    console.log('Received GET response from Flask:', response.data);

    return NextResponse.json(response.data, { status: response.status });

  } catch (error) {
    console.error('Error in Flask GET proxy:', error);

    // Handle 401 and refresh token if necessary
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

// Retry request with new access token after refreshing
async function retryRequestWithNewAccessToken(request: NextRequest, newAccessToken: string) {
  const { body } = await request.json();
  const flaskPath = "/auth/google-signin";  // Adjust the route for retries
  const fullUrl = `${FLASK_API_URL}${flaskPath}`;

  const config = {
    method: 'POST',
    url: fullUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newAccessToken}`,
    },
    data: body,  // Send the original body
  };

  try {
    const retryResponse = await axios(config);
    return NextResponse.json(retryResponse.data, { status: retryResponse.status });
  } catch (retryError) {
    console.error('Error on retry request:', retryError);
    return handleAxiosError(retryError);
  }
}

// Handle Axios error responses
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