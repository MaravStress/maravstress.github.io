// /////////////////////////////  Importar cosas 

fetch('../Modules/header.html')
.then(res => res.text())
.then(data => {
  document.querySelector('#header').innerHTML = data;
});
fetch('../Modules/all.html')
.then(res => res.text())
.then(data => {
  document.querySelector('#all').innerHTML = data;
});

fetch('../Modules/footer.html')
.then(res => res.text())
.then(data => {
  document.querySelector('#footer').innerHTML = data;
});
