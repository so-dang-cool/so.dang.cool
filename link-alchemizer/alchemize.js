const main = () => {
  // Register the alchemize behavior
  document.querySelector('#alchemize').onclick = alchemize;

  // Register the adder behavior
  document.querySelector('.add_row').onclick = addRow;

  // Add a single row
  addRow();
}

const alchemize = () => {
  let combos = [... document.querySelectorAll('#url_chunks textarea')]
    .map(textarea => textarea.value.split('\n'))
    .reduce((as, bs) => as.flatMap(a => bs.map(b => a + b)));
  
  console.error({combos});
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

// Let's go now!
main();
