const main = () => {
  // Register the adder behavior
  document.querySelector('.add_row').onclick = addRow;

  // Add a single row
  addRow();
}

const addRow = () => {
  const tr = document.createElement('tr');
  const tds = [0,0].map(() => document.createElement('td'));
  const textarea = document.createElement('textarea');
  const removeDiv = document.createElement('div');

  textarea.placeholder = 'Bits of URLs separated by lines.';

  removeDiv.className = 'remove_row';
  removeDiv.innerText = '-';

  tds[0].appendChild(textarea);
  tds[1].appendChild(removeDiv);

  tds.forEach(td => tr.appendChild(td));
  getUrlChunksTable().appendChild(tr);

  removeDiv.onlick = () => tr.remove();
};

const getUrlChunksTable = () => document.querySelector('#url_chunks');

// Let's go now!
main();
