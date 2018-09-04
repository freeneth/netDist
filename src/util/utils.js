export function throttle(fn, threshhold = 250) {
  let last
  let timer

  return function (...args) {
    const now = +new Date()
    if (last && now < last + threshhold) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = now
        fn(...args)
      }, threshhold)
    } else {
      last = now
      fn(...args)
    }
  }
}

const unzip = a => new Array(Math.max(...a.map(b => b.length))).fill(undefined).map((_, i) => a.map(y => y[i]))

/**
 * @param arr
 * @param func
 */
export function doubleMap (arr, func) {
  return func |> arr.map |> unzip
}

// https://repl.it/@shmulylotman/Lodash-Implementation-of-Groupby
export const groupBy = (arr, iter) => {
  let obj = {};
  arr.forEach(elem => {
    if(typeof iter === 'function') {
      !obj.hasOwnProperty(iter(elem)) ? obj[iter(elem)] = [elem] : obj[iter(elem)].push(elem)
    } else {
      !obj.hasOwnProperty(elem[iter]) ? obj[elem[iter]] = [elem] : obj[elem[iter]].push(elem)
    }
  })
  return obj
}

export  function once(func) {
  let ran
  let result
  
  return function() {
    if (ran) {
      return result;
    }
    ran = true;
    result = func.apply(this, arguments);

    // clear the `func` variable so the function may be garbage collected
    func = null;
    return result;
  };
}

export function fromPairs(pairs) {
  let index = -1;
  const length = pairs == null ? 0 : pairs.length;
  const result = {}

  while (++index < length) {
    const pair = pairs[index]
    result[pair[0]] = pair[1];
  }
  return result;
}

