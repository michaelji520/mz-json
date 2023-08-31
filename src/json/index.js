import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import '@/common/reset.less';
import './index.less';
import { jsonConvert } from '../common/toolkit';

const TAB_SIZE = 2;

let initValue = '';

const instance = monaco.editor.create(document.getElementById('editor'), {
  value: '',
  autoIndent: true,
  formatOnPaste: true,
  formatOnType: true,
  automaticLayout: true,
  tabSize: true,
  language: 'json',
  folding: true,
  tabSize: TAB_SIZE,
  showFoldingControls: 'always',
  scrollBeyondLastLine: false
});


instance.focus();

const format = document.getElementById('format');
const compress = document.getElementById('compress');
const traverse = document.getElementById('traverse');

format.addEventListener('click', () => {
  if (!instance) return;

  const raw = instance.getValue();

  let newVal = raw;
  if (traverse.checked) {
    newVal = jsonConvert(raw);
    console.log('traverse val', newVal)
  } else {
    newVal = JSON.parse(raw);
  }

  instance.setValue(JSON.stringify(newVal, undefined, TAB_SIZE));
});

compress.addEventListener('click', () => {
  const raw = instance.getValue();

  instance.setValue(JSON.stringify(JSON.parse(raw)));
});
