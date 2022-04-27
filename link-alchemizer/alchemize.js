const main = () => {
  // Register the alchemize behavior
  document.querySelector('#alchemize').onclick = alchemize;

  // Register the adder behavior
  document.querySelector('.add_row').onclick = addRow;
  
  // Register halp msg show/hide behavior
  document.querySelector('#halphide').onclick = showHideHalp;

  // Add a single row
  addRow();
}

const alchemize = () => {
  [... document.querySelectorAll('#url_chunks textarea')]
    .map(textarea => textarea.value.split('\n'))
    .reduce((as, bs) => as.flatMap(a => bs.map(b => a + b)))
    .forEach(url => window.open(url));
}

const addRow = () => {
  const tr = document.createElement('tr');
  const tds = [0,0].map(() => document.createElement('td'));
  
  const textarea = document.createElement('textarea');
  textarea.placeholder = 'Bits of URLs separated by lines.';

  const removeDiv = document.createElement('div');
  removeDiv.className = 'remove_row';
  removeDiv.innerText = '-';
  removeDiv.onclick = () => tr.remove();

  tds[0].appendChild(textarea);
  tds[1].appendChild(removeDiv);

  tds.forEach(td => tr.appendChild(td));
  document.querySelector('#url_chunks').appendChild(tr);
};

const showHideHalp = () => {
  document.querySelector('#halphide').toggleAttribute('hidden');
}

// Let's go now!
main();
