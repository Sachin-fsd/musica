import { NextResponse } from "next/server";

const getRemoteBaseUrl = () => {
  return process.env.FETCH_URL || process.env.NEXT_PUBLIC_FETCH_URL || "";
};

const buildRemoteUrl = (req, params) => {
  const remoteBaseUrl = getRemoteBaseUrl();
  if (!remoteBaseUrl) {
    throw new Error("Remote API URL is not configured.");
  }

  const pathSegments = Array.isArray(params?.path)
    ? params.path
    : params?.path
    ? [params.path]
    : [];

  const sanitizedBaseUrl = remoteBaseUrl.replace(/\/$/, "");
  const remoteUrl = new URL(
    `${sanitizedBaseUrl}/${pathSegments.join("/")}`,
    "http://localhost"
  );
  remoteUrl.search = new URL(req.url).search;
  return remoteUrl.toString();
};

const forwardRequest = async (req, params) => {
  const remoteUrl = buildRemoteUrl(req, params);
  const response = await fetch(remoteUrl, {
    method: req.method,
    headers: {
      accept: req.headers.get("accept") || "*/*",
    },
  });

  const body = await response.arrayBuffer();
  const headers = new Headers(response.headers);
  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  headers.set("x-proxied-by", "nextjs");

  return new Response(body, {
    status: response.status,
    headers,
  });
};

export async function GET(req, { params }) {
  try {
    return await forwardRequest(req, params);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to proxy request" },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    return await forwardRequest(req, params);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to proxy request" },
      { status: 500 }
    );
  }
}
