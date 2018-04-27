const { JSDOM } = require('jsdom');
const fs = require('fs');

if (process.argv.length < 4) {
  console.log("Usage:\n\n" +
              "    node index.js <input_origin_file_path> <input_other_sample_file_path> [-v]\n\n" +
              "-v makes the output verbose. It should be exactly the third argument.");
  process.exit(1);
}

const getXmlPath = (el, document) => {
  if (el === document.body)
    return "/html/body";
  let ret = `${getXmlPath(el.parentNode, document)}/${el.tagName.toLowerCase()}`;
  if (el.parentElement.childElementCount === 1)
    return ret;
  let siblings = el.parentElement.childNodes;
  let index = 1;  // strangely enough, in Xpath indices start from 1
  for (const sibl of siblings) {
    if (el === sibl)
      return `${ret}[${index}]`;
    if (sibl.nodeType === 1 && el.tagName === sibl.tagName)
      index++;
  }
}

const getScore = (el, dom) => {
  if (dom.window.getComputedStyle(el)["display"] === "none")
    return -1; // Shame
  let score = 0;

  const elText = el.textContent.replace(/^\s+/, "").replace(/\s+$/, "");
  if (elText === btnInfo.text)
    score += 3;
  else if (/OK|fine|great|well|perfect|awesome|cool/i.test(el.textContent))
    score += 2;

  const array = Array.prototype.slice.apply(el.attributes);
  for (const attr of array) {
    if (btnInfo.attributes[attr.name] === attr.value)
      score += 1;
    if (attr.name == "onclick" && /ok/i.test(attr.value))
      score += 1;
  }
  if (dom.window.getComputedStyle(el)["background-color"] === "rgb(92, 184, 92)")
    score += 2;
  return score;
}

const orig = fs.readFileSync(process.argv[2]);
const dom = new JSDOM(orig);
const button = dom.window.document.getElementById('make-everything-ok-button');
const array = Array.prototype.slice.apply(button.attributes);
const btnInfo = {};
btnInfo.text = button.textContent.replace(/\s{2,}/g, "");
btnInfo.attributes = {};
for (const attr of array) {
  btnInfo.attributes[attr.name] = attr.value;
}

const other = fs.readFileSync(process.argv[3]);
const dom2 = new JSDOM(other);
const candidates = dom2.window.document.querySelectorAll("a, button");
if (process.argv[4] === "-v") {
  console.log("Good candidates:")
  let highScore = -Infinity;
  let highScoredEl = null;
  for (const el of candidates) {
    let score = getScore(el, dom2);
    if (score > 2)
      console.log(`Score: ${score}, path: ${getXmlPath(el, dom2.window.document)}, element: ${el.outerHTML.replace(/\s{2,}/g, " ")}`);
    if (score > highScore) {
      highScore = score;
      highScoredEl = el;
    }
  }
  console.log("Best choice:");
  console.log(getXmlPath(highScoredEl, dom2.window.document));
} else {
  let highScore = -Infinity;
  let highScoredEl = null;
  for (const el of candidates) {
    let score = getScore(el, dom2);
    if (score > highScore) {
      highScore = score;
      highScoredEl = el;
    }
  }
  console.log(getXmlPath(highScoredEl, dom2.window.document));
}