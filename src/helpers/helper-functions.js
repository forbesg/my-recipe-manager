import cuisines from '../cuisines.json';

export function getFlagCode (cuisine) {
  let flagArray = cuisines.filter((item, index) => {
    return item.cuisine.toLowerCase() === cuisine.toLowerCase();
  });
  return flagArray[0] ? flagArray[0].flag : 'placeholder'; //Use placeholder flag if nothing returned
}
