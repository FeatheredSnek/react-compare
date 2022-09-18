export function getMinMax(providersList, propName) {
  let items = providersList.map(item => {
    return {
      id: item.id,
      value: item[propName]
    }
  })
  items.sort((a, b) => a.value - b.value)
  return {
    min: items[0].value,
    max: items[items.length-1].value,
    minId: items[0].id,
    maxId: items[items.length-1].id,
  }
  // returns minId and maxId rather randomly when there are 
  // two items with the same value, a real world implementation 
  // would surely need some additional logic for granting 'best of' badges
}


export function sortByObjectProperty(objectsArray, propName) {
  return objectsArray.sort((objectA, objectB) => {
    let a = objectA[propName]
    let b = objectB[propName]
    if (isNaN(a) || isNaN(b)) {
      if (a < b) return -1
      if (a > b) return 1
      return 0
    }
    else {
      return a - b
    }
  })
}


export function sortItemsBy(arr, propName) {
  if (propName == 'price' || propName == 'name') {
    return sortByObjectProperty(arr, propName)
  }
  else if (propName == 'clusters' || propName == 'memory') {
    return sortByObjectProperty(arr, propName).reverse()
  }
  else {
    return arr
  }
}


export function addColors(objectsArray, totalShift, baseHue) {
  const hues = []
  const shift = totalShift / objectsArray.length
  for (let i = 0; i < objectsArray.length; i++) {
    hues.push(Math.floor(shift * i) + baseHue)
  }
  // shuffle hues a bit so the graphs look better for the initial presentation
  // also laughing at dudes using Fisher-Yates to display 4 out of 10 dog pictures
  hues.sort(() => 0.5 - Math.random())
  objectsArray.forEach(element => {
    element.hue = hues[objectsArray.indexOf(element)]
  })
}


// quickly set base saturation and lightness for graph bars
export function getBarHSL(hue) {
  const s = 0.5
  const l = 0.7
  return `hsl(${hue}, ${s*100}%, ${l*100}%)`
}

// generic class-based toggle helper
export function toggle(element) {
  element.classList.toggle('hidden')
  // wait one frame for display:none to be applied
  setTimeout(() => {
    element.classList.toggle('transparent')
  }, 17);
}


// item details toggler
export function toggleDetails(providerId) {
  const details = document.getElementById(`${providerId}-details`)
  const buttonTextMore = document.getElementById(`${providerId}-button-more`)
  const buttonTextLess = document.getElementById(`${providerId}-button-less`)
  toggle(details)
  buttonTextMore.classList.toggle('hidden')
  buttonTextLess.classList.toggle('hidden')
}


export function togglePane(paneId) {
  const pane = document.getElementById(paneId)
  toggle(pane)
}