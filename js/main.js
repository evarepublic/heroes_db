document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const select = document.getElementById("films"),
    cards = document.querySelector(".cards");

  const optionsCreator = (data) => {
    const filmsList = new Set();

    data.forEach((item) => {
      if (item.movies) {
        filmsList.add(...item.movies);
      }
    });

    filmsList.forEach((item, i) => {
      const option = document.createElement("option");
      option.setAttribute("value", i);
      option.textContent = item;
      select.insertAdjacentElement("beforeend", option);
    });

    return filmsList;
  };

  const cardsCreator = (elem) => {
    const img = elem.photo;
    const movies = elem.movies;
    const infoUl = document.createElement("ul");
    const filmsUl = document.createElement("ul");
    for (let key in elem) {
      if (key === "movies" || key === "photo") {
        continue;
      }
      const li = `<li><strong>${key}:</strong>${elem[key]}</li>`;
      infoUl.insertAdjacentHTML("beforeend", li);
    }

    if (movies) {
      movies.forEach((item) => {
        const li = `<li>${item}</li>`;
        filmsUl.insertAdjacentHTML("beforeend", li);
      });
    }

    const card = `
    <div class="card">
      <div class="photo">
        <img src="${img}" alt="${elem.name}">
      </div>
      <div class="info">
        <strong class="title">info</strong>
        ${infoUl.innerHTML}
      </div>
      <div class="films">
        <strong class="title">films</strong>
        ${filmsUl.innerHTML}
      </div>
    </div>
  `;
    cards.insertAdjacentHTML("beforeend", card);
  };

  const contentMaker = (data, param) => {
    if (param) {
      data = data.filter((item) => {
        if (!item.movies) return false;
        if (param === "all") return true;
        return Object.values(item.movies).includes(param);
      });
    }
    data.forEach((item) => cardsCreator(item));
  };

  const dataAcquisition = () => {
    const request = new XMLHttpRequest();
    request.open("GET", ".././heroes.json");
    request.setRequestHeader("Content-Type", "application/json");
    request.send();
    request.addEventListener("readystatechange", () => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        init(JSON.parse(request.responseText));
      } else {
        cards.textContent = `Error! Data not received`;
        console.error(request.statusText);
      }
    });
  };

  const init = (data) => {
    optionsCreator(data);
    contentMaker(data);
    select.addEventListener("change", (e) => {
      cards.textContent = "";
      contentMaker(data, e.target.value);
    });
  };

  dataAcquisition();

});
