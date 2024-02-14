// window.onload = function () {

//     var el = document.createElement("div");
//     el.innerHTML = "RABBIT TEST ";
//     var div = document.getElementById("headline");
//     insertAfter(div, el);

//     /* FUNCTIONS */

//     // Inserts newNode after referenceNode
//     function insertAfter(referenceNode, newNode) {
//         referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
//     }
// };
import articles from "../assets/articles.js";
import quotes from "../assets/quotes.js";

window.onload = function () {
  ///////////////**************** change carousel images and quotes ****************/////////////

  let float = document.querySelector(".float");
  float.innerHTML = `<h3>‟${quotes.quotes[0]}”</h3>`;

  const changeQuote = (index, plusminus) => {
    const id = parseInt(index, 10) + plusminus;
    float.innerHTML = `<h3>‟${quotes.quotes[id % 3]}”</h3>`;
  };
  const carousel = document.querySelector(".carousel");
  for (let i = 0; i < 3; i++) {
    const img_li = document.createElement("li");
    const img = document.createElement("img");

    const random_img = Math.floor(Math.random() * 1000);
    img.src = `https://picsum.photos/id/${random_img}/800/600`;
    img_li.appendChild(img);
    img.addEventListener("error", () => {
      img.src = `./assets/images/carousel_backup/carousel_backup_${i + 1}.jpg`;
    });
    carousel.appendChild(img_li);
  }

  const previousButton = document.querySelector("#left");
  const nextButton = document.querySelector("#right");

  function setSlidePoisition(slide, index) {
    if (window.innerWidth <= 700) {
      slides[index].style.left = 100 * index + "vw";
    } else {
      slides[index].style.left = 85 * index + "vw";
    }
    slides[index].classList.add("slide");
    slides[index].setAttribute("id", index);
    if (index == 0) {
      slides[index].classList.add("current-slide");
    }
  }

  const slides = Array.from(carousel.children);
  slides.forEach(setSlidePoisition);

  const moveSlide = (carousel, currentSlide, targetSlide) => {
    carousel.style.transform = "translateX(-" + targetSlide.style.left + ")";
    currentSlide.classList.remove("current-slide");
    targetSlide.classList.add("current-slide");
  };

  nextButton.addEventListener("click", () => {
    const currentSlide = carousel.querySelector(".current-slide");
    let targetSlide;
    const id = currentSlide.getAttribute("id");
    if (id != slides.length - 1) {
      targetSlide = currentSlide.nextElementSibling;
    } else {
      targetSlide = slides[0];
    }
    moveSlide(carousel, currentSlide, targetSlide);
    changeQuote(id, 1);
  });

  previousButton.addEventListener("click", () => {
    const currentSlide = carousel.querySelector(".current-slide");
    let targetSlide;
    const id = currentSlide.getAttribute("id");
    if (id != 0) {
      targetSlide = currentSlide.previousElementSibling;
      changeQuote(id, -1);
    } else {
      targetSlide = slides[slides.length - 1];
      changeQuote(slides.length, -1);
    }
    moveSlide(carousel, currentSlide, targetSlide);
  });

  /////////////////////***************** main page ******************///////////////////////

  const card_container = document.querySelector("#article");
  for (let i = 0; i < articles.articles.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("id", `card-${i}`);
    const card_img = document.createElement("img");
    card_img.classList.add("card-img");
    card_img.src = `./assets/images/posts/Post_thumbnail-${(i % 4) + 1}.png`;
    if (i < 4) {
      card_img.src = `./assets/images/posts/Post_thumbnail-${i + 1}.png`;
    } else {
      const random_i = Math.floor(Math.random() * 1000);
      card_img.src = `https://picsum.photos/id/${random_i}/300/300`;
    }

    card.appendChild(card_img);

    card_img.addEventListener("error", () => {
      const random_i = Math.floor(Math.random() * 4);
      card_img.src = `./assets/images/posts/Post_thumbnail-${random_i + 1}.png`;
    });

    const _text = document.createElement("div");
    _text.classList.add("card-text");

    const text_title = document.createElement("h2");
    text_title.classList.add("card-title");
    text_title.innerHTML = articles.articles[i].title;

    _text.appendChild(text_title);

    const published_date = document.createElement("span");
    published_date.classList.add("published-date");
    published_date.innerHTML = `Published ${articles.articles[i].published}`;
    _text.appendChild(published_date);

    const text_content = document.createElement("div");
    text_content.classList.add("card-content");
    text_content.setAttribute("id", `card-content-${i}`);
    text_content.innerText = articles.articles[i].content;
    _text.appendChild(text_content);

    const readmore = document.createElement("button");
    readmore.classList.add("readmore");
    readmore.innerHTML = "Read more";
    _text.appendChild(readmore);

    card.appendChild(_text);

    card_container.appendChild(card);
  }
  //////////////////************* pagination ***************////////////////////

  const pagnation_previous = document.querySelector("#previous");
  const pagnation_next = document.querySelector("#next");
  const current_page = document.querySelector(".current-page");
  const total_pages = document.querySelector(".total-pages");
  let start = 0;

  const page_count = Math.ceil(articles.articles.length / 4);
  total_pages.innerHTML = page_count;

  const makeVisible = (card, start) => {
    const cardID = parseInt(card.getAttribute("id").split("-")[1]);

    const classList_of_card = Array.from(card.classList);

    if ((cardID >= start * 4) & (cardID < start * 4 + 4)) {
      card.classList.remove("hidden");
    } else {
      if (classList_of_card.indexOf("hidden") == -1) {
        card.classList.add("hidden");
      }
    }
    current_page.innerHTML = start + 1;
  };
  const allCards = Array.from(card_container.childNodes);
  allCards.forEach((card) => {
    makeVisible(card, start);
  });

  pagnation_next.addEventListener("click", () => {
    if (start < page_count - 1) {
      start += 1;
    } else {
      start = 0;
    }
    allCards.forEach((card) => makeVisible(card, start));
  });

  pagnation_previous.addEventListener("click", () => {
    if (start > 0) {
      start -= 1;
    } else {
      start = 0;
    }

    allCards.forEach((card) => makeVisible(card, start));
  });

  ////////////////////******* modal open close ********////////////////////////////

  let savedScrollPosition;
  function closeModal() {
    const modal_overlay = document.querySelector("#modal-overlay");
    const modal = document.querySelector("#modal");
    document.querySelector("body").classList.remove("modal-open");
    modal_overlay.classList.remove("up");

    modal_overlay.innerHTML = "";
    modal.close();
    window.scrollTo(0, savedScrollPosition);
  }

  const cards = Array.from(document.querySelectorAll(".card"));
  cards.forEach(openModal);

  function openModal(element) {
    const modal_overlay = document.querySelector("#modal-overlay");
    const modal = document.querySelector("#modal");
    element.addEventListener("click", (e) => {
      const cross = document.createElement("img");
      cross.src = "./assets/icons/close.svg";
      cross.setAttribute("id", "cross");
      cross.addEventListener("click", () => {
        closeModal();
      });
      let current_content;
      if (e.target.classList.contains("readmore")) {
        current_content = e.target.parentElement.parentElement;
      } else if (
        e.target.classList.contains("template-container") ||
        e.target.classList.contains("card")
      ) {
        current_content = e.target;
      } else {
        current_content = e.target.parentElement;
      }

      const current_img = current_content.getElementsByTagName("img");

      const current_title =
        current_content.getElementsByClassName("card-title");

      const current_published_date =
        current_content.getElementsByClassName("published-date");

      const current_text_content =
        current_content.getElementsByClassName("card-content");

      const modal_img = document.createElement("img");
      modal_img.classList.add("modal-img");
      modal_img.src = current_img[0].src;

      const modal_body = document.createElement("div");
      modal_body.classList.add("modal-body");
      const modal_title = document.createElement("h2");
      modal_title.innerText = current_title[0].innerText;

      const modal_published_date = document.createElement("span");
      modal_published_date.innerText = current_published_date[0].innerText;

      const modal_text_content = document.createElement("p");
      modal_text_content.innerText = current_text_content[0].innerText.trim();
      modal_text_content.classList.add("modal-text-content");

      modal_overlay.appendChild(cross);

      modal_overlay.appendChild(modal_img);
      modal_body.appendChild(modal_title);
      modal_body.appendChild(modal_published_date);

      modal_body.appendChild(modal_text_content);
      modal_overlay.appendChild(modal_body);

      modal.showModal();
      modal.scrollTo(0, 0);
      savedScrollPosition = window.scrollY;

      modal_overlay.classList.add("up");

      document.querySelector("body").classList.add("modal-open");
    });
  }

  modal.addEventListener("click", (event) => {
    if (event.target.id == "modal" && window.innerWidth > 800) {
      closeModal(modal);
    }
    if (event.target.id != "modal" && window.innerWidth < 800) {
      closeModal(modal);
    }
  });

  /////////////************* search results display ************************//////////////

  function clone(parent) {
    let tmp_results = Array.from(document.querySelectorAll(".card"));
    let results = tmp_results.map((card) => {
      const card_title = card.getElementsByClassName("card-title")[0].innerText;
      const card_date =
        card.getElementsByClassName("published-date")[0].innerText;
      const card_text =
        card.getElementsByClassName("card-content")[0].innerText;
      const card_img = card.getElementsByClassName("card-img")[0];

      const template = document.querySelector("[card-template]");

      const clone = template.content.cloneNode(true).children[0];

      const clone_title = clone.querySelector("[template-title]");
      const clone_date = clone.querySelector("[template-date]");
      const clone_text = clone.querySelector("[template-text]");
      const clone_img = clone.querySelector("[template-img]");

      clone_title.innerText = card_title;
      clone_date.innerText = card_date;
      clone_text.innerText = card_text;
      clone_img.src = card_img.src;

      parent.append(clone);
      return { title: card_title, element: clone };
    });
    return results;
  }

  function resultToggle(result, search_term) {
    const matched = result.title.toLowerCase().includes(search_term);
    result.element.classList.toggle("hidden", !matched);
  }

  function noResults(no_result_div, result_list) {
    const no_result = result_list.length == results.length;
    no_result_div.classList.toggle("hidden", !no_result);
  }
  //////////////////*************** search result full-screen **************/////////////////////
  const search_results_container = document.querySelector(
    ".search-results-container"
  );
  search_results_container.classList.add("hidden");
  const search_results = document.querySelector("[search-results]");
  const search = document.querySelector("#full-screen-search-box");
  const results = clone(search_results);

  search.addEventListener("input", (e) => {
    const search_term = e.target.value.toLowerCase();
    const input_empty = search_term.length > 0;
    search_results_container.classList.toggle("hidden", !input_empty);
    results.forEach((result) => {
      resultToggle(result, search_term);
    });
    const result_list = document.getElementsByClassName(
      "template-container hidden"
    );
    const no_result_div = document.querySelector(".no-result");
    noResults(no_result_div, result_list);
  });

  /////////////////////////*************** mobile search results ***************/////////////////////////

  const mobile_search_results = document.querySelector(
    "[mobile-search-results]"
  );
  mobile_search_results.classList.add("hidden");
  let mobile_results_list = clone(mobile_search_results);
  const mobile_search = document.querySelector("#mobile-search-box");

  mobile_search.addEventListener("input", (e) => {
    const search_term = e.target.value.toLowerCase();
    const input_empty = search_term.length > 0;
    mobile_search_results.classList.toggle("hidden", !input_empty);
    mobile_results_list.forEach((result) => {
      resultToggle(result, search_term);
    });
    const result_list = document.getElementsByClassName(
      "template-container hidden"
    );
    const mobile_no_result_div = document.querySelector(".mobile-no-result");
    noResults(mobile_no_result_div, result_list);
  });

  /////////////////************** click on result to open modal ***************////////////////////

  const result_list_ = document.getElementsByClassName("template-container");
  Array.from(result_list_).forEach((result) => {
    if (!result.classList.contains("hidden")) {
      openModal(result);
    }
  });
  ////////////////////**************** sponsors *****************///////////////////

  const sponsors = document.querySelector(".sponsor");
  for (let i = 1; i < 21; i++) {
    const sponsor_li = document.createElement("div");
    const sponsor_img = document.createElement("img");
    sponsor_img.src = `./assets/images/sponsors/sponsor-${i}.png`;
    sponsor_li.appendChild(sponsor_img);
    sponsors.appendChild(sponsor_li);
  }

  ////////////////////////************  insta feed images  ************////////////////////////

  const insta = document.querySelector(".insta-img");
  for (let i = 1; i < 10; i++) {
    const individual_insta_img = document.createElement("img");
    individual_insta_img.classList.add("individual-insta-img");
    individual_insta_img.src = `./assets/images/instagram-feed/instagram-image-${i}.png`;
    insta.appendChild(individual_insta_img);
  }

  //////////////////////////***************  swipe carousel *****************///////////////////////

  let initialStart = 0;
  let initialEnd = 0;
  let initialX = 0;
  let endX = 0;
  let carousel_container = document.querySelector(".carousel-container");

  carousel_container.addEventListener("pointerdown", startMouseDown);
  carousel_container.addEventListener("pointerup", startMouseUp);

  function swipe() {
    if (endX - initialX > 50) {
      const currentSlide = carousel.querySelector(".current-slide");
      let targetSlide;
      const id = currentSlide.getAttribute("id");
      if (id != 0) {
        targetSlide = currentSlide.previousElementSibling;
        changeQuote(id, -1);
      } else {
        targetSlide = currentSlide;
      }

      moveSlide(carousel, currentSlide, targetSlide);
    }
    if (endX - initialX < -50) {
      const currentSlide = carousel.querySelector(".current-slide");
      let targetSlide;
      const id = currentSlide.getAttribute("id");
      if (id != slides.length - 1) {
        targetSlide = currentSlide.nextElementSibling;
        changeQuote(id, 1);
      } else {
        targetSlide = currentSlide;
      }
      moveSlide(carousel, currentSlide, targetSlide);
    }
  }
  function startMouseDown(e) {
    initialStart = Date.now();
    initialX = e.clientX;
  }
  function startMouseUp(e) {
    initialEnd = Date.now();
    endX = e.clientX;

    if (initialEnd - initialStart < 800) {
      swipe();
    }
  }
  function breakline() {
    let width = window.innerWidth;
    const vision = document.querySelector("#vision");
    if (width < 800) {
      vision.innerText = "The vision within \nThe World Barista Cup";
    }
  }
  breakline();

  let resizeTimeout;
  let window_size = window.innerWidth;
  window.addEventListener("resize", () => {
    const slides = Array.from(document.querySelector(".carousel").children);
    slides.forEach(setSlidePoisition);
    if (window_size != window.innerWidth) {
      window_size = window.innerWidth;
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        breakline();
      }, 1000);
    }
  });
};

//////////////////////////******************** resize screen *******************////////////////////
