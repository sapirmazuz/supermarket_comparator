export const login = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

export const logout = () => {
  localStorage.clear();
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};
