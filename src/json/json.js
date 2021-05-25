import CodeMirror from 'codemirror';
import ClipboardJS from 'clipboard';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/mode/javascript/javascript';

import '../common/reset.less';
import './codemirror.less';
import './json.less';


let source = document.querySelector('#source');
let result = document.querySelector('#compiled');

let formatBtn = document.querySelector('#format');
let compressBtn = document.querySelector('#compress');

var editor = CodeMirror.fromTextArea(source, {
  lineNumbers: true,
  mode: {name: 'javascript', json: true},
  matchBrackets: true,
  lineWrapping: true,
  indentUnit : 2,  // 缩进单位，默认2
});

editor.setOption("extraKeys", {Tab: newTab});

function newTab(cm) {
  if (cm.somethingSelected()) {
    cm.indentSelection('add')
  } else {
    var spaces = Array(cm.getOption("indentUnit") + 1).join(" ")
    cm.replaceSelection(spaces)
  }
}

editor.on('change', function () {
  render();
})

// var charWidth = editor.defaultCharWidth();
// var basePadding = 2;
// editor.on("renderLine", function(cm, line, elt) {
//   var off = CodeMirror.countColumn(line.text, null, cm.getOption("tabSize")) * charWidth;
//   elt.style.textIndent = "-" + off + "px";
//   elt.style.paddingLeft = (basePadding + off) + "px";
// });
// editor.refresh();

formatBtn.addEventListener('click', (e) => {
  render();
}, false);

compressBtn.addEventListener('click', (e) => {
  editor.setValue(getCompressedContent(editor.getValue()));
}, false);

function getCompressedContent(source) {
  return getJsonText(source, '');
}

function renderCompileError(err) {
  const error = document.querySelector('.compile-error');
  if (!err) return error.classList.remove('show');
  let msg = err.toString();
  error.innerHTML = msg;
  error.classList.add('show');
}
function getJsonObject(str) {
  return new Function(`return ${str}`)();
}

// parse without style
function getJsonText(str, spaces) {
  return JSON.stringify(new Function(`return ${str}`)(), null, spaces);
}

let clipboard = new ClipboardJS('#copy', {
  text: function () { return getJsonText(editor.getValue(), '  ') }
});
let message = document.querySelector('.message');

clipboard.on('success', function(e) {
  message.innerHTML = '复制成功';
  message.classList.add('copy-success');
  setTimeout(() => {
    message.innerHTML = '';
    message.classList.remove('copy-success');
  }, 3000);
});

clipboard.on('error', function(e) {
  console.error('Action:', e.action);
  console.error('Trigger:', e.trigger);
});

function toType(target) {
  return ({}).toString.call(target).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function createObjectBracket(key = null, type = 'object', hasComma) {
  const brackets = {
    'object': ['{', '}'],
    'array': ['[', ']']
  };
  let left = document.createElement('span');
  left.classList.add('object-key');
  left.innerHTML = `${key ? ('"' + key + '": ') : ''}${brackets[type][0]}`;
  let right = document.createElement('span');
  right.innerHTML = `${brackets[type][1]}${hasComma ? ',' : ''}`;

  return {left, right};
}

function createExpandArrow(container, data) {
  let arrow = document.createElement('span');
  arrow.classList.add('expand');
  arrow.reference = {
    data: data,
    isExpanded: true,
    parent: container
  };
  return arrow;
}

function switchExpandStatus(arrow) {
  if (!arrow.reference) return;
  if (arrow.reference.isExpanded) {
    arrow.reference.isExpanded = false;
    arrow.reference.parent.classList.add('collapsed');
  } else {
    arrow.reference.isExpanded = true;
    arrow.reference.parent.classList.remove('collapsed');
  }
}

result.addEventListener('click', function (e) {
  if (e.target.classList.contains('expand')) switchExpandStatus(e.target);
}, false);

function renderJsonContent(key, target, hasComma) {
  let type = toType(target);
  switch (type) {
    case 'object':
    case 'array':
      let container = document.createElement('div');
      container.classList.add(type);
      container.appendChild(createExpandArrow(container, target));
      let brackets = createObjectBracket(key, type, hasComma);
      container.appendChild(brackets.left);
      let ellipsis = document.createElement('span');
      ellipsis.classList.add('ellipsis');
      container.appendChild(ellipsis);
      let list = document.createElement('div');
      list.classList.add('kv-list');
      let keys = Object.keys(target);
      for (let i = 0; i < keys.length; i++) {
        list.appendChild(renderJsonContent(type === 'array' ? null : keys[i], target[keys[i]], i < keys.length - 1));
      }
      container.appendChild(list);
      container.appendChild(brackets.right);
      return container;

    case 'number':
    case 'string':
    default:
      let row = document.createElement('div');
      row.classList.add('row');
      let item = document.createElement('span');
      let value = type === 'string' ? `"${target}"` : String(target);
      item.classList.add(type);
      row.appendChild(item);
      item.innerHTML = `<span class="key">"${key}": </span><span class="value">${html2Escape(value)}</span>${hasComma ? ',' : ''}`;
      return row;
  }
}

function render() {
  try {
    result.innerHTML = '';
    const str = editor.getValue();
    str && result.appendChild(renderJsonContent(null, getJsonObject(str)));
    renderCompileError(null);
  } catch (err) {
    renderCompileError(err);
  }
}

function html2Escape(sHtml) {
  return sHtml.replace(/[<>&"\r\n\t\b\f'\\]/g, function(c) {
    return {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      '\n': '\\n',
      '\r': '\\r',
      '\b': '\\b',
      '\f': '\\f',
      '\t': '\\t',
      '\'': "\\'",
      '\\': '\\\\'
    }[c];
  });
}

render();
