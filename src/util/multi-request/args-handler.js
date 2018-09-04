export const ArgsStructureType = {
  Array: ['[]', 'a'],
  Config: ['*', 'c'],
  Group: ['{}', 'g']
}

const astEntities = Object.entries(ArgsStructureType)
  .reduce((sum, [key, value]) => {
    value.forEach(x => sum[x] = value)
    return sum
  }, {})

const formatArgStructure = argStructure => {
  return argStructure?.split(',').map(it => astEntities[it.trim()])
}

// argStructure `'[], [], c, g'` 参数结构
// zippedArg [[1, 'a', 9, 2], [2, 'b', 9, 'n'], [3, 'c', 9, 2]]
// return [[[1, 3], ['a', 'c'], 9, 2], [[2], ['b'], 9, 'n']]， 发两次请求，第一次请求的参数是 [1, 3], ['a', 'c'], 9, 2
export const generateRequestArg = (argStructure) => {
  const structures = formatArgStructure(argStructure)
  console.log(structures)

  return (zippedArg) => {
    if (!structures) {
      return [unzip(zippedArg)]
    }

    // 代表分组的下标，也是参数中，需要分组处理的下标
    const groupIndexes = Object.entries(structures)
      .filter(([index, it]) => it === ArgsStructureType.Group)
      .map(([index]) => index)

    const linkKey = '&^*;'
    const getGroupedKey = it =>
      groupIndexes.reduce((sum, ind) => `${sum}${linkKey}${it[ind]}`, '')

    const results = Object.values(groupBy(zippedArg, getGroupedKey))

    return results.map(it => {
      const unzippedArg = unzip(it)
      structures.forEach((it, i) => {
        if ([ArgsStructureType.Config, ArgsStructureType.Group].includes(it)) {
          unzippedArg[i] = unzippedArg[i]?.[0]
        }
      })
      return unzippedArg
    })
  }
}

/**
 * https://stackoverflow.com/questions/49315876/how-to-make-lodash-zip-with-less-code
 * [[1, 2], [3, 4], [5, 6]] => [[1, 2, 3], [4, 5, 6]]
 */
const unzip = a => new Array(Math.max(...a.map(b => b.length))).fill(0).map((_, i) => a.map(y => y[i]))
// https://repl.it/@shmulylotman/Lodash-Implementation-of-Groupby
const groupBy = (arr, iter) => {
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