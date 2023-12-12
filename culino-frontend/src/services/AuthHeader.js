export default function authHeader() {
  // Retrieve the user from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    // If the user and token exist, return the authorization header with the bearer token
    return { Authorization: 'Bearer ' + user.token }; // for Spring Boot back-end
  } else {
    // If the user or token doesn't exist, return an empty object
    return {};
  }
}
