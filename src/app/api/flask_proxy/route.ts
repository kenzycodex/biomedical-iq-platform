import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "https://biomedical-iq-backend.onrender.com";

// Logger utility
function logError(message: string, error?: any, meta: any = {}) {
    console.error(`[ERROR] ${message}`, { error: error?.message || error, ...meta });
}

function logInfo(message: string, meta: any = {}) {
    console.log(`[INFO] ${message}`, meta);
}

function logWarning(message: string, meta: any = {}) {
    console.warn(`[WARNING] ${message}`, meta);
}

// Handle Axios errors
function handleAxiosError(error: any) {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            logError("Received error response from Flask API", error.response.data);
            return NextResponse.json(error.response.data, { status: error.response.status });
        } else if (error.request) {
            logError("No response received from Flask API", error.request);
            return NextResponse.json({ error: "No response received from the server" }, { status: 500 });
        } else {
            logError("Error in request configuration", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}

// Function to refresh access token
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
        const response = await axios.post(`${FLASK_API_URL}/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` },
        });
        logInfo('Access token refreshed successfully.');
        return response.data.access_token;
    } catch (error) {
        handleAxiosError(error);
        return null;
    }
}

// Middleware for attaching access tokens to headers for requests
async function attachAccessToken(request: NextRequest, refreshToken: string): Promise<string | null> {
    let accessToken = request.headers.get('Authorization')?.split(" ")[1];

    if (!accessToken && refreshToken) {
        accessToken = await refreshAccessToken(refreshToken);
        if (!accessToken) {
            logWarning('Failed to attach access token. User may need to re-authenticate.');
            return null;
        }
    }
    return accessToken;
}

// Handle POST requests (Registration, Login, etc.)
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const flaskPath = body.flaskPath || "/auth/register";
        const fullUrl = `${FLASK_API_URL}${flaskPath}`;
        const refreshToken = request.cookies.get('refreshToken')?.value || '';

        const accessToken = await attachAccessToken(request, refreshToken);
        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const response = await axios.post(fullUrl, body, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        logInfo(`POST request successful for ${flaskPath}`, { user: response.data?.user?.username });

        // Handle refresh token for session persistence
        const nextResponse = NextResponse.json(response.data, { status: response.status });
        if (response.data.refresh_token) {
            nextResponse.cookies.set('refreshToken', response.data.refresh_token, {
                httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60, path: '/',
            });
        }
        return nextResponse;

    } catch (error) {
        return handleAxiosError(error);
    }
}

// Handle user logout with secure token invalidation
export async function logout(request: NextRequest): Promise<NextResponse> {
    try {
        const refreshToken = request.cookies.get('refreshToken')?.value || '';

        const accessToken = await attachAccessToken(request, refreshToken);
        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const response = await axios.post(`${FLASK_API_URL}/auth/logout`, {}, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        logInfo('User logged out successfully.');

        // Clear cookies on logout
        const nextResponse = NextResponse.json({ message: 'Successfully logged out' }, { status: response.status });
        nextResponse.cookies.delete('refreshToken');
        return nextResponse;

    } catch (error) {
        return handleAxiosError(error);
    }
}

// Handle user login request
export async function login(request: NextRequest): Promise<NextResponse> {
    try {
        const { login_info, password } = await request.json();
        const refreshToken = request.cookies.get('refreshToken')?.value || '';

        if (!login_info || !password) {
            logWarning('Login information and password are required.');
            return NextResponse.json({ error: 'Login information and password are required' }, { status: 400 });
        }

        const accessToken = await attachAccessToken(request, refreshToken);
        const fullUrl = `${FLASK_API_URL}/auth/login`;

        const response = await axios.post(fullUrl, { login_info, password }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken || ''}`,
            },
        });

        logInfo('Login request successful.', { user: response.data?.user?.username });

        // Handle refresh token for session persistence
        const nextResponse = NextResponse.json(response.data, { status: response.status });
        if (response.data.refresh_token) {
            nextResponse.cookies.set('refreshToken', response.data.refresh_token, {
                httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60, path: '/',
            });
        }
        return nextResponse;

    } catch (error) {
        return handleAxiosError(error);
    }
}

// Fetch user profile for dashboard view
export async function getUserProfile(request: NextRequest): Promise<NextResponse> {
    try {
        const refreshToken = request.cookies.get('refreshToken')?.value || '';

        const accessToken = await attachAccessToken(request, refreshToken);
        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const response = await axios.get(`${FLASK_API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        logInfo('User profile fetched successfully.', { user: response.data.username });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        return handleAxiosError(error);
    }
}

// Verify 2FA code with rate limiting
export async function verify2FA(request: NextRequest): Promise<NextResponse> {
    try {
        const { email, verification_code } = await request.json();

        if (!email || !verification_code) {
            logWarning('Email and verification code are required.');
            return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
        }

        const response = await axios.post(`${FLASK_API_URL}/auth/verify`, { email, verification_code }, {
            headers: { 'Content-Type': 'application/json' },
        });

        logInfo('2FA verification successful.', { user: email });

        return NextResponse.json({ message: 'Account verified successfully. You can now log in.' }, { status: 200 });

    } catch (error) {
        return handleAxiosError(error);
    }
}

