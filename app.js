const searchForm = document.querySelector('.search');
const searchInput = document.querySelector('#query');
const productsSection = document.querySelector('#produtos');
const productCards = Array.from(document.querySelectorAll('.product-card'));
const serviceCards = Array.from(document.querySelectorAll('.service-card'));
const filterButtons = Array.from(document.querySelectorAll('[data-product-filter]'));
const searchStatus = document.querySelector('#catalogue-status');
const dialog = document.querySelector('#detail-dialog');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function normalize(text) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

function filterProducts(category = '') {
  productCards.forEach(card => {
    card.hidden = Boolean(category && card.dataset.category !== category);
  });
  serviceCards.forEach(card => { card.hidden = false; });
  filterButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.productFilter === category));
  });
  searchStatus.hidden = true;
  searchInput.value = '';
}

function scrollToProducts() {
  productsSection.scrollIntoView({ block: 'start' });
}

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const words = normalize(searchInput.value).split(/\s+/).filter(Boolean);
  let count = 0;
  [...productCards, ...serviceCards].forEach(card => {
    const text = normalize(card.dataset.keywords + ' ' + card.textContent);
    card.hidden = !words.every(word => text.includes(word));
    if (!card.hidden) count++;
  });
  filterButtons.forEach(button => button.setAttribute('aria-pressed', 'false'));
  searchStatus.hidden = words.length === 0;
  searchStatus.textContent = count === 0
    ? 'Nenhum resultado. Tente outra busca ou selecione Todos.'
    : count + ' resultado' + (count === 1 ? '' : 's') + ' em produtos e serviços.';
  scrollToProducts();
});

searchInput.addEventListener('input', () => {
  if (!searchInput.value) filterProducts();
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => filterProducts(button.dataset.productFilter));
});

document.querySelectorAll('[data-category-link]').forEach(link => {
  link.addEventListener('click', () => filterProducts(link.dataset.categoryLink));
});

document.querySelectorAll('[data-service-link]').forEach(link => {
  link.addEventListener('click', () => filterProducts());
});

const productDetails = {
  gatos: ['Ração para gatos', 'Consulte as marcas, as opções para cada fase de vida e a disponibilidade na unidade de sua preferência.'],
  caes: ['Ração para cães', 'Converse com a equipe sobre as opções de alimentação para cães e confirme marcas, tamanhos e valores.'],
  brinquedos: ['Brinquedos e acessórios', 'Encontre opções para a rotina de brincadeiras do seu pet. Consulte os modelos e a disponibilidade com a equipe.'],
  higiene: ['Higiene e cuidados', 'Consulte os produtos para a rotina de higiene do seu pet. A equipe informa opções e disponibilidade.']
};

const serviceDetails = {
  consultas: ['Clínica veterinária', 'Fale com a unidade mais próxima para marcar uma consulta veterinária e informe o motivo da visita.'],
  banho: ['Banho e tosa', 'Conheça o banho e tosa com Medicina Chinesa da Pet’s House. Consulte a equipe sobre o serviço e os horários disponíveis.'],
  oftalmologia: ['Oftalmologia', 'Converse com a equipe sobre a avaliação oftalmológica e confirme a disponibilidade do atendimento.']
};

function openDetails(detail) {
  document.querySelector('#detail-title').textContent = detail[0];
  document.querySelector('#detail-copy').textContent = detail[1];
  dialog.showModal();
}

document.querySelectorAll('[data-product-detail]').forEach(button => {
  button.addEventListener('click', () => openDetails(productDetails[button.dataset.productDetail]));
});

document.querySelectorAll('[data-service-detail]').forEach(button => {
  button.addEventListener('click', () => openDetails(serviceDetails[button.dataset.serviceDetail]));
});

dialog.querySelector('a[href="#contato"]').addEventListener('click', () => dialog.close());

menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
  navigation.classList.toggle('is-open', !expanded);
});

navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    navigation.classList.remove('is-open');
    if (link.hash === '#servicos') filterProducts();
  });
});
