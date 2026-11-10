const form = document.querySelector('.search');
const input = document.querySelector('#query');
const cards = Array.from(document.querySelectorAll('.card'));
const filters = Array.from(document.querySelectorAll('[data-filter]'));
const reset = document.querySelector('.reset');
const results = document.querySelector('#resultados');
const status = document.querySelector('#service-status');
const dialog = document.querySelector('#service-dialog');
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
  consultas: 'Fale com a UbPet para marcar uma consulta para seu cão ou gato. Informe o motivo da visita para a equipe orientar o agendamento.',
  castracao: 'A equipe orienta sobre a avaliação antes da cirurgia e informa as datas e condições das próximas campanhas de castração social.',
  exames: 'Consulte a disponibilidade do exame e confirme com a equipe se há alguma orientação de preparo.',
  especialidades: 'Conte à equipe qual atendimento seu pet precisa e confirme as especialidades e os horários disponíveis.',
  medicacoes: 'Tenha a receita em mãos, se houver, e consulte a equipe sobre disponibilidade e orientações.'
};
document.querySelectorAll('[data-detail]').forEach(button => button.addEventListener('click', () => {
  dialog.querySelector('#detail-title').textContent = button.closest('.card').querySelector('h4').textContent;
  dialog.querySelector('#detail-copy').textContent = detail[button.dataset.detail];
  dialog.showModal();
}));
