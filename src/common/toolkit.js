
export const isJSONString = str => typeof str === 'string' && /(\[.*])|({.*})/.test(str);
/**
 * 将object对象可能为JSON字符串的属性转化为JS变量
 */
export function jsonConvert(data) {
  try {
    data = isJSONString(data) ? JSON.parse(data) : data;
    const result = Array.isArray(data) ? [] : {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = (value && typeof value === 'object') || isJSONString(value) ? jsonConvert(value) : value;
    }
    return result;
  } catch (e) {
    return data;
  }
}

export function checkJsonCode(strJsonCode) {
  let res = '';
  try {
    for (let i = 0, j = 0, k = 0, ii, ele; i < strJsonCode.length; i++) {
      ele = strJsonCode.charAt(i);
      if (j % 2 === 0 && ele === '}') {
        k--;
        for (ii = 0; ii < k; ii++) {
          ele = `    ${ele}`;
        }
        ele = `\n${ele}`;
      } else if (j % 2 === 0 && ele === '{') {
        ele += '\n';
        k++;
        for (ii = 0; ii < k; ii++) {
          ele += '    ';
        }
      } else if (j % 2 === 0 && ele === ',') {
        ele += '\n';
        for (ii = 0; ii < k; ii++) {
          ele += '    ';
        }
      } else if (ele === '"') {
        j++;
      }
      res += ele;
    }
  } catch (error) {
    res = strJsonCode;
  }
  return res;
}

