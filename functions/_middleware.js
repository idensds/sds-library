const PASSWORD = "sdsaccess";

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const cookie = request.headers.get("cookie") || "";

  // Already authenticated
  if (cookie.includes("sds-auth=true")) {
    return context.next();
  }

  // Handle password form submit
  if (request.method === "POST") {
    const form = await request.formData();
    const submittedPassword = form.get("password");
    const redirectTo = form.get("redirect_to") || "/";

    if (submittedPassword === PASSWORD) {
      return new Response(null, {
        status: 302,
        headers: {
          "Set-Cookie": "sds-auth=true; path=/; Secure; HttpOnly; SameSite=Lax",
          "Location": redirectTo
        }
      });
    }
  }

  // Preserve the originally requested path + query
  const requestedPath = url.pathname + url.search;

  return new Response(`
<!DOCTYPE html>
<html>
<head>
  <title>SDS Library</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }

    .card {
      background: white;
      padding: 32px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.15);
      text-align: center;
      width: 100%;
      max-width: 360px;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 10px;
    }

    p {
      margin-bottom: 20px;
      color: #444;
    }

    input[type="password"] {
      padding: 12px;
      font-size: 16px;
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 15px;
    }

    button {
      padding: 12px 20px;
      width: 100%;
      cursor: pointer;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>SDS Library</h2>
    <p>Enter password to continue</p>

    <form method="POST">
      <input type="hidden" name="redirect_to" value="${requestedPath}">
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Enter</button>
    </form>
  </div>
</body>
</html>
`, {
    headers: {
      "Content-Type": "text/html"
    }
  });
}
