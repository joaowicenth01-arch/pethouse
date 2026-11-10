const form = document.querySelector('.search');
const input = document.querySelector('#query');
const cards = Array.from(document.querySelectorAll('.card'));
const filters = Array.from(document.querySelectorAll('[data-filter]'));
const reset = document.querySelector('.reset');
const results = document.querySelector('#resultados');
const status = document.querySelector('#service-status');
const dialog = document.querySelector('#service-dialog');
dialog.querySelector('a[href="#contato"]').addEventListener('click', () => dialog.close());
const plain = (text) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLowerCase();

function filter({ category = '', query = '' } = {}) {
  const words = plain(query).split(/\s+/).filter(Boolean);
  const active = Boolean(category || words.length);
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  let count = 0;
  cards.forEach(card => {
    const searchable = plain(card.dataset.keywords + ' ' + card.textContent);
    const visible = category ? card.dataset.category === category : words.every(word => searchable.includes(word));
    card.hidden = !visible;
    if (visible) count++;
  });
  reset.hidden = !active;
  status.textContent = !active ? 'Encontre o cuidado que seu pet precisa.' :
    count === 0 ? 'Nenhum serviço encontrado. Tente outro termo ou veja todos.' :
    count === 1 ? '1 serviço encontrado.' : `${count} serviços encontrados.`;
}
function showResults() { results.scrollIntoView({block:'start'}); }
form.addEventListener('submit', event => { event.preventDefault(); filter({query:input.value}); showResults(); });
input.addEventListener('input', () => { if (!input.value) filter(); });
filters.forEach(button => button.addEventListener('click', () => {
  const active = button.getAttribute('aria-pressed') === 'true';
  input.value = '';
  filter({category:active ? '' : button.dataset.filter});
  showResults();
}));
reset.addEventListener('click', () => { input.value = ''; filter(); document.querySelector('[data-filter]').focus({preventScroll:true}); });
const detail = {
  consultas: 'Fale com a unidade mais próxima para marcar uma consulta veterinária para seu pet.',
  banho: 'A Pet’s House oferece banho e tosa com Medicina Chinesa. Fale com a equipe para conhecer o serviço e agendar.',
  oftalmologia: 'Fale com a equipe sobre a avaliação oftalmológica e confirme a disponibilidade do atendimento.',
  petshop: 'Consulte a unidade de sua preferência sobre marcas, tamanhos e disponibilidade dos produtos.'
};
document.querySelectorAll('[data-detail]').forEach(button => button.addEventListener('click', () => {
  dialog.querySelector('#detail-title').textContent = button.closest('.card').querySelector('h4').textContent;
  dialog.querySelector('#detail-copy').textContent = detail[button.dataset.detail];
  dialog.showModal();
}));
