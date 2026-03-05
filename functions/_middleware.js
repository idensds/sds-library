export async function onRequest({ request, next }) {

  const PASSWORD = "sdsaccess";

  const auth = request.headers.get("Authorization") || "";
  const [scheme, encoded] = auth.split(" ");

  if (scheme !== "Basic" || !encoded) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="SDS Library"'
      }
    });
  }

  const decoded = atob(encoded);
  const colonIndex = decoded.indexOf(":");
  const pass = decoded.slice(colonIndex + 1);

  if (pass !== PASSWORD) {
    return new Response("Access denied", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="SDS Library"'
      }
    });
  }

  return next();
}