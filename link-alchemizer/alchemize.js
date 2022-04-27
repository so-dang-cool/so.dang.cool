const getUrlChunksTable = () => document.querySelector('#url_chunks');

const removeRow => clickedButton => {
  const td = clickedButton.parentElement;
  const tr = td.parentElement;
  tr.remove()
};

const addRow = () => {
  const tr = document.createElement('tr');
  const tds = [0,0].map(() => document.createElement('td'));
  const textarea = document.createElement('textarea');
  const removeDiv = document.createElement('div');
  
  textarea.placeholder = 'Bits of URLs separated by lines.';
  
  removeDiv.className = 'remove_row';
  removeDiv.innerText = '-';
  removeDiv.onlick = removeRow;
  
  tds[0].appendChild(textarea);
  tds[1].appendChild(removeDiv);
  
  tds.forEach(td => tr.appendChild(td));
  getUrlChunksTable().appendChild(tr);
};

document.querySelector('.add_row').onclick = addRow;

addRow();
