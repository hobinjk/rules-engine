let jwt = localStorage.getItem('jwt');
if (!jwt) {
  fetch('jwt').then(res => {
    jwt = res;
  });
}
