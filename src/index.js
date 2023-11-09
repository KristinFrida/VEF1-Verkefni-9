import { empty } from './lib/elements.js';
import { renderDetails, renderFrontpage, searchAndRender } from './lib/ui.js';


/**
 * Fall sem keyrir við leit.
 * Hér erum við að uppfæra slóðina okkar.
 * @param {SubmitEvent} e
 * @returns {Promise<void>}
 */
async function onSearch(e) {
  e.preventDefault();

  if (!e.target || !(e.target instanceof Element)) {
    return;
  }

  const { value } = e.target.querySelector('input') ?? {};

  if (!value) {
    return;
  }

  // þetta er await, searchAndRender er að bíða eftir að hún klári að birta niðurstöðuna
  // úr þessari leit, þegar það er búið, þá breytir hún slóðinni okkar, og setja query sem value
  // þannig að núna erum við búin að tengja þetta saman og erum að láta allt forritið 
  // okkar síðan, á ákveðnum tímapunkti erum við að bregðast við ákveðnumm stöðum í 
  // mismunandi samhengi. 

  await searchAndRender(document.body, e.target, value);
  window.history.pushState({}, '', `/?query=${value}`);
}

/**
 * Athugar hvaða síðu við erum á út frá query-string og birtir.
 * Ef `id` er gefið er stakt geimskot birt, annars er forsíða birt með
 * leitarniðurstöðum ef `query` er gefið.
 */
function route() {
  const { search } = window.location;

  const qs = new URLSearchParams(search);

  const query = qs.get('query') ?? undefined;
  const id = qs.get('id');

  const parentElement = document.body;

  if (id) {
    renderDetails(parentElement, id);
  } else {
    renderFrontpage(parentElement, onSearch, query);
  }
}

// Bregst við því þegar við notum vafra til að fara til baka eða áfram.
window.onpopstate = () => {
  /* TODO bregðast við */
  empty(document.body);

  route();
};

// Athugum í byrjun hvað eigi að birta.
route();
