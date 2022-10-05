(function () {
  "use strict";

  const get = (target) => document.querySelector(target);
  const getAll = (target) => document.querySelectorAll(target);

  const $prevMonthBtn = get(".prev");
  const $nextMonthBtn = get(".next");
  const $showCurrentMonth = get(".month");
  const $showCurrentYear = get(".year");
  const $input = get(".selectDate");
  const $calendar = get(".calendar");

  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();
  let currentDate = new Date().getDate();
  let prevMonthDates = [];
  let currentMonthDates = [];
  let nextMonthDates = [];

  // 날짜 초기화
  function clearDates() {
    const $dates = getAll(".date");
    $dates.forEach((date) => {
      date.remove();
    });
  }
  // 캘린더 년, 월 보여주기
  function showCalendarDates() {
    let date = new Date(currentYear, currentMonth);
    $showCurrentYear.textContent = currentYear;
    $showCurrentMonth.textContent = date.toLocaleString("en-US", {
      month: "long",
    });
  }

  // 지난달 달력
  function createPrevMonth() {
    prevMonthDates = [];
    let getDay = new Date(currentYear, currentMonth);
    for (let i = -getDay.getDay() + 1; i <= 0; i++) {
      let date = new Date(currentYear, currentMonth);
      date.setDate(i);
      prevMonthDates.push(date.getDate());
    }
  }

  //현재달력
  function createCurrentMonth() {
    currentMonthDates = [];
    let index = 1;
    while (index) {
      let date = new Date(currentYear, currentMonth);
      date.setDate(index);
      if (currentMonth !== date.getMonth()) {
        break;
      }
      currentMonthDates.push(date.getDate());
      index++;
    }
  }

  // 다음달 달력
  function createNextMonth() {
    nextMonthDates = [];
    let lastDay = new Date(
      currentYear,
      currentMonth,
      currentMonthDates[currentMonthDates.length - 1]
    ).getDay();

    for (let i = 1; i < 7 - lastDay; i++) {
      let date = new Date(currentYear, currentMonth + 1);
      date.setDate(i);
      nextMonthDates.push(date.getDate());
    }
  }

  // 지난달 보기
  $prevMonthBtn.addEventListener("click", () => {
    currentMonth -= 1;
    if (currentMonth < 0) {
      currentYear--;
      currentMonth += 12;
    }

    // < 아이콘 클릭시 달력을 초기화 하고 보여주기
    clearDates();
    showCalendarDates();

    createPrevMonth();
    createCurrentMonth();
    createNextMonth();
    renderCalendar();
    showPrevDate();
    showCurrentDate();
    showNextDate();
  });

  // 다음달 보기
  $nextMonthBtn.addEventListener("click", () => {
    currentMonth += 1;
    if (currentMonth > 11) {
      currentYear++;
      currentMonth -= 12;
    }

    showCalendarDates();
    clearDates();

    createPrevMonth();
    createCurrentMonth();
    createNextMonth();
    renderCalendar();
    showPrevDate();
    showCurrentDate();
    showNextDate();
  });

  // 캘린더 그리드 영역 구하기
  function rendertext(monthDates, className, opacity, month) {
    monthDates.forEach((items) => {
      let obj = document.querySelector(".items");
      let createElem = document.createElement("div");

      createElem.classList.add(className);
      createElem.classList.add("date");
      createElem.textContent = items;
      createElem.style.opacity = opacity;
      obj.appendChild(createElem);

      let date = new Date(currentYear, month);
      date.setDate(items);
      if (date.getDay() == 0) {
        createElem.style.color = "red";
      }

      if (
        monthDates == currentMonthDates &&
        items == currentDate &&
        currentMonth == new Date().getMonth() &&
        currentYear == new Date().getFullYear()
      ) {
        createElem.classList.add("today");
      }
    });
  }

  // 캘린더 그리드 영억 보여주기
  function renderCalendar() {
    rendertext(prevMonthDates, "prev-date", "0.3", currentMonth - 1);
    rendertext(currentMonthDates, "current-date", "1", currentMonth);
    rendertext(nextMonthDates, "next-date", "0.3", currentMonth + 1);
  }

  // 캘린더 지난 달 날짜 보여주기
  function showPrevDate() {
    const $dates = getAll(".prev-date");
    $dates.forEach((date) => {
      date.addEventListener("click", () => {
        let dated = new Date(currentYear, currentMonth - 1, date.textContent);
        $input.value = `${dated.getFullYear()}-${
          dated.getMonth() >= 10
            ? dated.getMonth() + 1
            : "0" + (dated.getMonth() + 1)
        }-${dated.getDate() >= 10 ? dated.getDate() : "0" + dated.getDate()}`;

        const $dates = getAll(".date");
        $dates.forEach((items) => {
          items.classList.remove("selected");
        });
        date.classList.add("selected");
        $calendar.classList.add("hidden");
      });
    });
  }

  // 캘린더 현재 날짜 보여주기
  function showCurrentDate() {
    const $dates = getAll(".current-date");
    $dates.forEach((date) => {
      date.addEventListener("click", () => {
        let dated = new Date(currentYear, currentMonth, date.textContent);
        $input.value = `${dated.getFullYear()}-${
          dated.getMonth() > 8
            ? dated.getMonth() + 1
            : "0" + (dated.getMonth() + 1)
        }-${dated.getDate() >= 10 ? dated.getDate() : "0" + dated.getDate()}`;

        const $dates = getAll(".date");
        $dates.forEach((items) => {
          items.classList.remove("selected");
        });
        date.classList.add("selected");
        $calendar.classList.add("hidden");
      });
      date.classList.remove("selected");
    });
  }

  // 캘린더 다음달 날짜 보여주기
  function showNextDate() {
    const $dates = getAll(".next-date");
    $dates.forEach((date) => {
      date.addEventListener("click", () => {
        let dated = new Date(currentYear, currentMonth + 1, date.textContent);
        $input.value = `${dated.getFullYear()}-${
          dated.getMonth() > 8
            ? dated.getMonth() + 1
            : "0" + (dated.getMonth() + 1)
        }-${dated.getDate() >= 10 ? dated.getDate() : "0" + dated.getDate()}`;

        const $dates = getAll(".date");
        $dates.forEach((items) => {
          items.classList.remove("selected");
        });
        date.classList.add("selected");
        $calendar.classList.add("hidden");
      });
    });
  }

  // input 클릭 시 달력 보여주기
  $input.addEventListener("click", () => {
    $calendar.classList.remove("hidden");
  });

  // 초기실행
  function init() {
    showCalendarDates();
    createPrevMonth();
    createCurrentMonth();
    createNextMonth();
    renderCalendar();
  }

  init();
  showPrevDate();
  showCurrentDate();
  showNextDate();
})();
