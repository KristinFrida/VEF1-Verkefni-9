// import { name } from '../browser-sync';
/**
 * API föll.
 * @see https://lldev.thespacedevs.com/2.2.0/swagger/
 */

/**
 * Sækjum týpurnar okkar.
 * @typedef {import('./api.types.js').Launch} Launch
 * @typedef {import('./api.types.js').LaunchDetail} LaunchDetail
 * @typedef {import('./api.types.js').LaunchSearchResults} LaunchSearchResults
 */

/** Grunnslóð á API (DEV útgáfa) */
const API_URL = 'https://lldev.thespacedevs.com/2.2.0/';

/**
 * Skilar Promise sem bíður í gefnar millisekúndur.
 * Gott til að prófa loading state, en einnig hægt að nota `throttle` í
 * DevTools.
 * @param {number} ms Tími til að sofa í millisekúndum.
 * @returns {Promise<void>}
 */
export async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(undefined), ms);
  });
}
/**
 * Leita í geimskota API eftir leitarstreng.
 * @param {string} query Leitarstrengur.
 * @returns {Promise<Launch[] | null>} Fylki af geimskotum eða `null` ef villa
 *  kom upp.
 */
export async function searchLaunches(query) {
  const url = new URL('launch', API_URL);
  url.searchParams.set('search', query);
  url.searchParams.set('mode', 'list');

  let response;
  // try er það sem við ætlum að reyna að framkvæma
  // við setjum try utan um td fetch, af því við erum að gera kall út fyrir forritið okkar
  // yfir netið. Á einhverja slóð sem gæti skilað villu.
  try {
    // fetch skilar einhverju loforði á responsi.
    response = await fetch(url);
    // response inniheldur einhver gögn um það hvernig respnseið fór fram. 
    // Dæmi: Við förum inná einhverja slóð: Eitthvað fannst ekki, skilar einhverjum gögnum þannig
    // þurfjum að bregðast úr því

    // catch er það sem gerist ef að villa á sér stað
  } catch (e) {
    console.error('Villa kom upp við að sækja gögn');
    return null;
  }

  if (!response.ok) {
    console.error(
      'Villa við að sækja gögn, ekki 200 staða',
      response.status,
      response.statusText
    );
    return null;
  }


  let json;

  try {
    json = await response.json();
  } catch (e) {
    console.error('Villa við að vinna úr JSON');
    return null;
  }


  return json.results;
}

/**
 * Skilar stöku geimskoti eftir auðkenni eða `null` ef ekkert fannst.
 * @param {string} id Auðkenni geimskots.
 * @returns {Promise<LaunchDetail | null>} Geimskot.
 */
export async function getLaunch(id) {
  const url = new URL(`launch/${id}`, API_URL);

  let launchId;

  try {
    launchId = await fetch(url);
  } catch (e) {
    console.error('Villa kom upp við að sækja gögn');
    return null;
  }

  if (!launchId.ok) {
    console.error(
      'Villa við að sækja gögn, ekki 200 staða',
      launchId.status,
      launchId.statusText
    );
    return null;
  }

  let data;

  try {
    data = await launchId.json();
  } catch (e) {
    console.error('Villa við að vinna úr JSON');
    return null;
  }

  return data;
}

// let json;

// try {
//  json = await launchId.json();
// } catch (e) {
//  console.error('Villa við að vinna úr JSON');
//  return null;
// }

// return json.id;
// }
