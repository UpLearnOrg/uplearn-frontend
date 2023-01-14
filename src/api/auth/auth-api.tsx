const url = process.env.REACT_APP_API_URL + "/auth";

export const AuthApi = {
  login: async function (userData: { username: string; password: string }) {
    const response = await fetch(url + "/login", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return response.json();
  },
  logout: async function () {
    const response = await fetch(url + "/logout", {
      method: "GET",
      credentials: "include",
    });

    return response.json();
  },
  getJwtPayload: getJwtPayload,
  isAuthenticated: function () {
    let authenticated = false;

    const token = getJwtPayload("token");

    if (token !== undefined) authenticated = true;

    return authenticated;
  },
};

function getJwtPayload(name: string) {
  const value = `; ${document.cookie}`;
  try {
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const popped = parts.pop();

      if (!popped) return null;

      const jwtToken = popped.split(";").shift()?.substring(6);

      if (!jwtToken) return null;

      return parseJwt(jwtToken);
    }
  } catch (e) {
    return null;
  }
}

function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}