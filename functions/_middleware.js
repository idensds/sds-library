const PASSWORD = "sdsaccess";

export async function onRequest(context) {

  const { request } = context;

  const cookie = request.headers.get("cookie") || "";

  if (cookie.includes("sds-auth=true")) {
    return context.next();
  }

  if (request.method === "POST") {
    const form = await request.formData();

    if (form.get("password") === PASSWORD) {
      return new Response(null, {
        status: 302,
        headers: {
          "Set-Cookie": "sds-auth=true; path=/; Secure; HttpOnly; SameSite=Lax",
          "Location": "/"
        }
      });
    }
  }

  return new Response(`
<!DOCTYPE html>
<html>
<head>
<title>SDS Library</title>
<style>
body{
font-family:sans-serif;
display:flex;
height:100vh;
align-items:center;
justify-content:center;
background:#f5f5f5;
}
.card{
background:white;
padding:40px;
border-radius:10px;
box-shadow:0 5px 15px rgba(0,0,0,0.15);
text-align:center;
}
input{
padding:10px;
font-size:16px;
margin-top:10px;
width:200px;
}
button{
padding:10px 20px;
margin-top:15px;
cursor:pointer;
}
</style>
</head>

<body>

<div class="card">
<h2>SDS Library</h2>
<p>Enter password</p>

<form method="POST">
<input type="password" name="password" placeholder="Password" required>
<br>
<button type="submit">Enter</button>
</form>

</div>

</body>
</html>
`, {
    headers: { "Content-Type": "text/html" }
  });
}
