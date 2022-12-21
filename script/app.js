let globalTeller = 0;
let globalCellCounter = 0;

let globalRegion = '';
let globalSubRegion = '';
let globalCountryName = '';
let globalRegionCounter = 0;
let globalSubRegionCounter = 0;
let globalCountryCounter = 0;
let globalWorldPopulation = 0;
let showGraph = false;
let chart;
let dark = false;
let displayBool;
let textContentLand;

function onAppearing() {
  onresize = (event) => {
    const ctx = document.querySelector('.myChart');
    chart.destroy();
    drawChart();
  };
}

const showLandenFunction = function (jsonObject) {
  htmlLand = document.querySelector('.js-canvas');
  htmlLand.innerHTML = '';
  document.querySelector('.loader').style.display = 'block';
  window.setTimeout(function () {
    document.querySelector('.loader').style.display = 'none';
    globalCellCounter = 0;
    let htmlCell = document.querySelector('.js-cell');
    // console.log(test);
    let html = '';
    let htmlPng = '';
    let teller = 1;

    // Sort alfabetisch
    jsonObject.sort(function (a, b) {
      return a.ccn3 - b.ccn3;
    });
    for (let land of jsonObject) {
      textContentLand = land.name.common;
      if (land.subregion == null) {
        land.subregion = 'No subregion';
      }
      if (window.innerWidth <= 1200) {
        if (land.name.common.length > 19) {
          textContentLand = land.name.common.substring(0, 19) + '...';
        }
      }
      if (window.innerWidth < 1600 && window.innerWidth > 1200) {
        if (land.name.common.length > 25) {
          textContentLand = land.name.common.substring(0, 25) + '...';
        }
      }
      if (window.innerWidth >= 1600) {
        textContentLand = land.name.common;
      }
      html += `<button class="c-btn-cell c-fade"><div class="cell cell--${teller} js-cell" name="${land.name.common}"><p class="c-cellText">${textContentLand}<p><img class="flag" src="${land.flags.png}" alt="Flag of ${textContentLand}"><p class="c-cellText--sub">${land.subregion}</p></div></button>`;
      htmlPng = `url('${land.flags.png}')">`;
      globalCellCounter = globalCellCounter + 1;
      teller += 1;
    }
    htmlLand.innerHTML = html;
    globalTeller = 0;
    listenToClick();
    showCounter();
    fadeInLanden();
  }, 500);
};

const fadeInLanden = function () {
  var items = document.getElementsByClassName('c-fade');
  for (let i = 0; i < items.length; ++i) {
    fadeIn(items[i], i * 30);
  }
  function fadeIn(item, delay) {
    setTimeout(() => {
      item.classList.add('fadein');
    }, delay);
  }
};

const calculatePopulationSubRegion = function (jsonObject) {
  globalSubRegionCounter = 0;
  for (let land of jsonObject) {
    globalSubRegionCounter = globalSubRegionCounter + land.population;
  }
  showGraph = true;
};

const calculatePopulationRegion = function (jsonObject, region) {
  globalRegionCounter = 0;
  for (let land of jsonObject) {
    globalRegionCounter = globalRegionCounter + land.population;
  }
};

const calculateWorldPopulation = function (jsonObject) {
  globalWorldPopulation = 0;
  for (let land of jsonObject) {
    globalWorldPopulation = globalWorldPopulation + land.population;
  }
  // console.log(globalWorldPopulation);
};

const showCounter = function () {
  let htmlCounter = document.querySelector('.js-counter');
  htmlCounter.innerHTML = `Countries: <b class="c-b-counter">${globalCellCounter}</b>`;
};

const showFilteredLanden = function (jsonObject) {
  try {
    document.querySelector('.js-message').innerHTML = '';
    showLandenFunction(jsonObject);
    //Filters aanpassen
    let htmlFilters = document.querySelectorAll('.js-filter');
    for (let htmlFilter of htmlFilters) {
      htmlFilter.classList.remove('u-is-selected');
    }
  } catch (err) {
    console.error(err);
  }
};

const showError = function (message) {
  let htmlMessage = document.querySelector('.js-message');
  globalTeller = globalTeller + 1;
  if (globalTeller == 3) {
    htmlMessage.innerHTML = 'Kan resultaat niet vinden';
    globalTeller = 0;
  }
};

const showFilterChange = function (filter) {
  let htmlFilters = document.querySelectorAll('.js-filter');
  for (let htmlFilter of htmlFilters) {
    htmlFilter.classList.remove('u-is-selected');
    document.querySelector('.js-search').value = '';
    if (htmlFilter.getAttribute('filter') == filter) {
      htmlFilter.style.transform = 'scale(0.6)';
      htmlFilter.classList.add('u-is-selected');
    }
    window.setTimeout(function () {
      htmlFilter.style.transform = 'scale(1)';
    }, 100);
  }
};
const showFilteredLandenByContinent = function (jsonObject) {
  try {
    document.querySelector('.js-message').innerHTML = '';
    showLandenFunction(jsonObject);
    //Talen ophalen
    for (const [key, value] of Object.entries(jsonObject[25].languages)) {
      // console.log(value);
    }
  } catch (err) {
    console.error(err);
  }
};

const showLand = function (jsonObject) {
  if (jsonObject[0].subregion != null) {
    getPopulationSubRegion(jsonObject[0].subregion);
  }
  getPopulationRegion(jsonObject[0].region);
  htmlPopup = document.querySelector('.js-popup');
  htmlPopupContent = document.querySelector('.js-popup-content');
  htmlPopup.style.display = 'flex';
  window.setTimeout(function () {
    htmlPopupContent.style.opacity = 1;
    htmlPopupContent.style.transform = 'scale(1)';
  }, 100);
  let html = '';
  let languages = '';
  let currencies = '';
  let teller = 0;
  let tellerCur = 0;

  if (jsonObject[0].languages == null) {
    languages = 'No languages found';
  } else {
    for (const [key, value] of Object.entries(jsonObject[0].languages)) {
      teller += 1;
      languages += `${value}+`;
      // console.log(languages);
    }
    if (teller > 1) {
      languages = languages.replaceAll('+', ', ');
      languages = languages.substring(0, languages.length - 2);
    } else {
      languages = languages.substring(0, languages.length - 1);
    }
  }
  if (jsonObject[0].currencies == null) {
    currencies = 'No currencies found';
  } else {
    for (const [key, value] of Object.entries(jsonObject[0].currencies)) {
      tellerCur += 1;
      currencies += `${value.name} (${value.symbol}) +`;
    }
    if (tellerCur > 1) {
      currencies = currencies.replaceAll('+', ', ');
      currencies = currencies.substring(0, currencies.length - 2);
    } else {
      currencies = currencies.substring(0, currencies.length - 1);
    }
  }

  globalCountryName = jsonObject[0].name.common;
  globalRegion = jsonObject[0].region;
  globalSubRegion = jsonObject[0].subregion;

  // globalRegionCounter = 0;
  // globalSubRegionCounter = 0;
  globalCountryCounter = jsonObject[0].population;

  var h = window.innerWidth;
  if (h >= 1200) {
    html += `<div class="c-popupTitle u-x-span-2 c-content"><div class="c-line-title"></div><p class="c-land-name"><b>${jsonObject[0].name.common}</b></p><div class="c-line-title"></div></div>`;
    if (jsonObject[0].capital == null) {
      jsonObject[0].capital = 'No capital';
    }
    html += `<div class="c-content-cell"><div class="c-line-right"></div><p class="u-textParagraphStart">Capital: <b>${jsonObject[0].capital}</b></p></div>`;
    html += `<div class="c-content-cell u-y-span-5 js-chartText"><canvas class="myChart"></canvas></div></div>`;
    html += `<div class="c-content-cell"><div class="c-line-right"></div><p class="u-textParagraphStart">Population: <b>${new Intl.NumberFormat(
      'de-DE'
    ).format(jsonObject[0].population)}</b></p></div>`;
    // html += `<div class="c-content-cell"></div>`;
    html += `<div class="c-content-cell u-y-span-2"><div class="c-line-right"></div><p class="u-textParagraphStart">Languages: <b>${languages}</b></p></div>`;
    // html += `<div class="c-content-cell"></div>`;
    html += `<div class="c-content-cell"><div class="c-line-right"></div><p class="u-textParagraphStart">Currencies: <b>${currencies}</b></p></div>`;

    html += `<span class="material-icons c-close js-close">close</span>`;
  } else {
    html += `<div class="u-x-span-2"><p class="c-land-name"><b>${jsonObject[0].name.common}</b></p></div>`;
    if (jsonObject[0].capital == null) {
      jsonObject[0].capital = 'No capital';
    }
    html += `<div class="c-content-cell"><p class="u-textParagraphStart">Capital:<br> <b>${jsonObject[0].capital}</b></p></div>`;
    html += `<div class="c-content-cell u-end"><p class="u-textParagraphEnd">Population:<br>  <b>${new Intl.NumberFormat(
      'de-DE'
    ).format(jsonObject[0].population)}</b></p></div>`;
    // html += `<div class="c-content-cell"></div>`;
    html += `<div class="c-content-cell u-max-height-135"><p class="u-textParagraphStart">Languages:<br>  <b>${languages}</b></p></div>`;
    // html += `<div class="c-content-cell"></div>`;
    html += `<div class="c-content-cell u-end u-max-height-135"><p class="u-textParagraphEnd">Currencies:<br>  <b>${currencies}</b></p></div>`;
    html += `<div class="c-content-cell u-justify-center u-x-span-2 js-chartText"><canvas class="myChart"></canvas></div></div>`;

    html += `<span class="material-icons c-close js-close">close</span>`;
  }

  htmlPopupContent.innerHTML = html;

  var p = document.querySelectorAll('.u-textParagraphStart');
  var l = document.querySelectorAll('.c-line-right');
  for (let i = 0; i < p.length; i++) {
    // console.log(p[i].offsetHeight);
    for (let j = 0; j < l.length; j++) {
      if (p[i].offsetHeight > 19) {
        l[i].style.height = `${p[i].offsetHeight}px`;
      }
      if (p[i].offsetHeight > 39) {
        l[i].style.height = `${p[i].offsetHeight}px`;
      }

      if (p[i].offsetHeight > 59) {
        l[i].style.height = `${p[i].offsetHeight}px`;
      }
    }
  }

  listenToClose();
  window.setTimeout(function () {
    if (showGraph == true) {
      drawChart();
    } else {
      document.querySelector('.js-chartText').innerHTML = 'No data available';
      if (window.innerWidth >= 1200) {
        document.querySelector('.js-chartText').style.margin = '0 0 0 90px';
      }
    }
  }, 210);
};

const showData = function (jsonObject) {
  try {
    let htmlLand = document.querySelector('.js-canvas');
    let htmlCell = document.querySelector('.js-cell');
    // console.log(jsonObject[2].languages);
    let test = jsonObject[2].languages;
    // console.log(test);
    let html = '';
    let htmlPng = '';
    let teller = 1;

    // Sort alfabetisch
    jsonObject.sort(function (a, b) {
      return a.ccn3 - b.ccn3;
    });

    showLandenFunction(jsonObject);
    //Talen ophalen
    for (const [key, value] of Object.entries(jsonObject[25].languages)) {
      // console.log(value);
    }
  } catch (err) {
    console.error(err);
  }
};

const listenToSearch = function () {
  let search = document.querySelector('.js-search');
  search.addEventListener('keypress', function (event) {
    if (event.key == 'Enter') {
      getFilteredLanden(search.value.toLowerCase());
    }
  });
  let searchBtn = document.querySelector('.js-search-btn');
  searchBtn.addEventListener('click', function () {
    getFilteredLanden(search.value.toLowerCase());
  });
};

const listenToFilter = function () {
  let filters = document.querySelectorAll('.js-filter');
  for (let filter of filters) {
    filter.addEventListener('click', function () {
      getFilteredLandenByContinent(filter.getAttribute('filter'));
    });
    filter.addEventListener('keypress', function (event) {
      if (event.key == 'Enter') {
        getFilteredLandenByContinent(filter.getAttribute('filter'));
      }
    });
  }
};

const listenToClose = function () {
  htmlClose = document.querySelector('.js-close');
  htmlPopup = document.querySelector('.js-popup');
  htmlClose.addEventListener('click', function () {
    showGraph = false;
    document.querySelector('.js-popup-content').style.opacity = 0;
    document.querySelector('.js-popup-content').style.transform = 'scale(0)';
    window.setTimeout(function () {
      document.querySelector('.js-popup').style.display = 'none';
    }, 200); // timed to match animation-duration
  });
  window.addEventListener('keydown', function (event) {
    if (event.key == 'Escape') {
      showGraph = false;
      document.querySelector('.js-popup-content').style.opacity = 0;
      document.querySelector('.js-popup-content').style.transform = 'scale(0)';
      window.setTimeout(function () {
        document.querySelector('.js-popup').style.display = 'none';
      }, 200); // timed to match animation-duration
    }
  });
  htmlPopup.addEventListener('click', function () {
    showGraph = false;
    document.querySelector('.js-popup-content').style.opacity = 0;
    document.querySelector('.js-popup-content').style.transform = 'scale(0)';
    window.setTimeout(function () {
      document.querySelector('.js-popup').style.display = 'none';
    }, 200); // timed to match animation-duration
  });
};

const listenToClick = function () {
  let cells = document.querySelectorAll('.js-cell');
  let btnLand = document.querySelectorAll('.c-btn-cell');
  for (let btn of btnLand) {
    btn.addEventListener('click', function () {
      let land = btn.querySelector('.js-cell').getAttribute('name');
      getLand(land);
    });
    btn.addEventListener('keypress', function () {
      if (event.key == 'Enter') {
        let land = btn.querySelector('.js-cell').getAttribute('name');
        getLand(land);
      }
    });
  }
};

const listenToMode = function () {
  let mode = document.querySelector('.js-mode');
  let btn = document.querySelector('.c-btn-dark');
  let root = document.querySelector(':root');
  let darkmode = document.querySelector('.js-darkmode');
  let teller = 0;
  btn.addEventListener('click', function () {
    teller += 1;
    if (teller == 1) {
      mode.checked = true;
    } else {
      mode.checked = false;
      teller = 0;
    }
    if (mode.checked) {
      dark = true;
      Chart.defaults.color = 'white';
      Chart.defaults.borderColor = 'rgba(255,	255,	255, 0.2)';
      darkmode.classList.add('u-dark');
      // root.style =
      //   '--white: white;--dark: #212427;--text-color: white;--accent-color: #2badad;--btn-cell-color: #212121;--background-color: #141414; --bold-text-color: #2badad; --scrollbarTrack-color: #212427; --popupcontent-color: #212427; --searchBar-color: #2badad; --hover-color: #00ffff;';
    } else {
      dark = false;
      Chart.defaults.color = '#212427';
      Chart.defaults.borderColor = 'rgba(0,	0,	0, 0.1)';
      darkmode.classList.remove('u-dark');
      // root.style =
      //   '--white: white;--dark: #212427;--text-color: #212427;--accent-color: #2badad;--btn-cell-color: white;--background-color: white; --bold-text-color: #2badad; --scrollbarTrack-color: #f1f1f1; --popupcontent-color: white; --searchBar-color: #212427; --hover-color: #2badad;';
    }
  });
  // mode.addEventListener('click', function () {
  //   if (mode.checked) {
  //     dark = true;
  //     Chart.defaults.color = 'white';
  //     Chart.defaults.borderColor = 'rgba(255,	255,	255, 0.2)';
  //     root.style =
  //       '--white: white;--dark: #212427;--text-color: white;--accent-color: #2badad;--btn-cell-color: #212121;--background-color: #141414; --bold-text-color: #2badad; --scrollbarTrack-color: #212427; --popupcontent-color: #212427; --searchBar-color: #2badad; --hover-color: #00ffff;';
  //   } else {
  //     dark = false;
  //     Chart.defaults.color = '#212427';
  //     Chart.defaults.borderColor = 'rgba(0,	0,	0, 0.1)';
  //     root.style =
  //       '--white: white;--dark: #212427;--text-color: #212427;--accent-color: #2badad;--btn-cell-color: white;--background-color: white; --bold-text-color: #2badad; --scrollbarTrack-color: #f1f1f1; --popupcontent-color: white; --searchBar-color: #212427; --hover-color: #2badad;';
  //   }
  // });
};

const getPopulationSubRegion = function (subRegion) {
  let url = `https://restcountries.com/v3.1/subregion/${subRegion}`;
  handleData(url, calculatePopulationSubRegion);
};

const getPopulationRegion = function (region) {
  let url = `https://restcountries.com/v3.1/region/${region}`;
  handleData(url, calculatePopulationRegion);
};

const getWorldPopulation = function () {
  let url = `https://restcountries.com/v3.1/all`;
  handleData(url, calculateWorldPopulation);
};

const getFilteredLanden = function (search) {
  console.log(search);
  let url = `https://restcountries.com/v3.1/name/${search}`;
  handleData(url, showFilteredLanden, showError);
  let urlCurrency = `https://restcountries.com/v3.1/currency/${search}`;
  handleData(urlCurrency, showFilteredLanden, showError);
  let urlLanguage = `https://restcountries.com/v3.1/lang/${search}`;
  handleData(urlLanguage, showFilteredLanden, showError);
};

const getFilteredLandenByContinent = function (filter) {
  if (filter == 'all') {
    const url = `https://restcountries.com/v3.1/${filter}`;
    handleData(url, showFilteredLandenByContinent);
  } else {
    const url = `https://restcountries.com/v3.1/region/${filter}`;
    handleData(url, showFilteredLandenByContinent);
  }
  showFilterChange(filter);
};

const getLand = function (land) {
  const url = `https://restcountries.com/v3.1/name/${land}`;
  handleData(url, showLand);
};

const getData = function () {
  const url = 'https://restcountries.com/v3.1/all';
  handleData(url, showData);
};

const drawChart = function () {
  const ctx = document.querySelector('.myChart');
  const ctxText = document.querySelector('.js-chartText');
  if (globalSubRegion != undefined) {
    if (globalCountryCounter > 300000000) {
      if (window.innerWidth >= 768) {
        displayBool = true;
      } else {
        displayBool = false;
      }
      if (dark == false) {
        chart = new Chart(ctx, {
          type: 'bar',
          options: {
            scales: {
              y: {
                ticks: {
                  display: displayBool,
                },
              },
            },
          },
          data: {
            labels: [
              `${globalCountryName}`,
              `${globalSubRegion}`,
              `${globalRegion}`,
              `Global population`,
            ],
            datasets: [
              {
                label: 'Population',
                data: [
                  globalCountryCounter,
                  globalSubRegionCounter,
                  globalRegionCounter,
                  globalWorldPopulation,
                ],
                borderWidth: 1,
                backgroundColor: 'rgba(43,	173,	173, 0.5)',
              },
            ],
          },
        });
      }
      if (dark == true) {
        chart = new Chart(ctx, {
          type: 'bar',
          options: {
            scales: {
              y: {
                ticks: {
                  display: displayBool,
                },
              },
            },
          },
          data: {
            labels: [
              `${globalCountryName}`,
              `${globalSubRegion}`,
              `${globalRegion}`,
              `Global population`,
            ],
            datasets: [
              {
                label: 'Population',
                data: [
                  globalCountryCounter,
                  globalSubRegionCounter,
                  globalRegionCounter,
                  globalWorldPopulation,
                ],
                borderWidth: 1,
                backgroundColor: 'rgba(0,	255,	255, 0.6)',
              },
            ],
          },
        });
      }
    } else if (globalCountryName.split(' ').length > 2) {
      if (window.innerWidth >= 768) {
        displayBool = true;
      } else {
        displayBool = false;
      }
      if (dark == false) {
        chart = new Chart(ctx, {
          type: 'bar',
          options: {
            scales: {
              y: {
                ticks: {
                  display: displayBool,
                },
              },
            },
          },
          data: {
            labels: [`Country`, `${globalSubRegion}`, `${globalRegion}`],
            datasets: [
              {
                label: 'Population',
                data: [
                  globalCountryCounter,
                  globalSubRegionCounter,
                  globalRegionCounter,
                ],
                borderWidth: 1,
                minBarLength: 3,
                backgroundColor: 'rgba(43,	173,	173, 0.5)',
              },
            ],
          },
        });
      }
      if (dark == true) {
        chart = new Chart(ctx, {
          type: 'bar',
          options: {
            scales: {
              y: {
                ticks: {
                  display: displayBool,
                },
              },
            },
          },
          data: {
            labels: [`Country`, `${globalSubRegion}`, `${globalRegion}`],
            datasets: [
              {
                label: 'Population',
                data: [
                  globalCountryCounter,
                  globalSubRegionCounter,
                  globalRegionCounter,
                ],
                borderWidth: 1,
                minBarLength: 3,
                backgroundColor: 'rgba(0,	255,	255, 0.6)',
              },
            ],
          },
        });
      }
    } else {
      if (window.innerWidth >= 768) {
        displayBool = true;
      } else {
        displayBool = false;
      }
      if (dark == false) {
        chart = new Chart(ctx, {
          type: 'bar',
          options: {
            scales: {
              y: {
                ticks: {
                  display: displayBool,
                },
              },
            },
          },
          data: {
            labels: [
              `${globalCountryName}`,
              `${globalSubRegion}`,
              `${globalRegion}`,
            ],
            datasets: [
              {
                label: 'Population',
                data: [
                  globalCountryCounter,
                  globalSubRegionCounter,
                  globalRegionCounter,
                ],
                borderWidth: 1,
                minBarLength: 3,
                backgroundColor: 'rgba(43,	173,	173, 0.5)',
              },
            ],
          },
        });
      }
      if (dark == true) {
        chart = new Chart(ctx, {
          type: 'bar',
          options: {
            scales: {
              y: {
                ticks: {
                  display: displayBool,
                },
              },
            },
          },
          data: {
            labels: [
              `${globalCountryName}`,
              `${globalSubRegion}`,
              `${globalRegion}`,
            ],
            datasets: [
              {
                label: 'Population',
                data: [
                  globalCountryCounter,
                  globalSubRegionCounter,
                  globalRegionCounter,
                ],
                borderWidth: 1,
                minBarLength: 3,
                backgroundColor: 'rgba(0,	255,	255, 0.6)',
              },
            ],
          },
        });
      }
    }
  } else {
    ctxText.innerHTML = 'No data available';
  }
  onAppearing();
};
const init = function () {
  console.log('DOM geladen');
  getData();
  listenToFilter();
  listenToSearch();
  showCounter();
  listenToMode();
  getWorldPopulation();
  Chart.defaults.borderColor = 'rgba(0,	0,	0, 0.1)';
};
document.addEventListener('DOMContentLoaded', init);
//#endregion
