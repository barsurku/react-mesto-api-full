function getResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

export function register(email, password) {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
  .then((res) => getResponse(res))
}

export function login(email, password) {
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
  .then((res) => getResponse(res))
    .then((res) => {
      
        localStorage.setItem('token', res.token);
        return res;
      
    })
  }

export function getToken(token) {
  return fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })
  .then((res) => getResponse(res))
  .then((res) => res)
  }

export const baseUrl = "https://api.barsurku.nomoredomainsmonster.ru";