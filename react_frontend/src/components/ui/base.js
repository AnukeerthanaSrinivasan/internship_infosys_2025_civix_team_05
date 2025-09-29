document.addEventListener("DOMContentLoaded", () => {
  const monthName = document.getElementById("month-name");
  const daysContainer = document.getElementById("calendar-days");
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");

  if (monthName && daysContainer) {
    let currentDate = new Date();

    function renderCalendar() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();

      monthName.textContent = currentDate.toLocaleString("default", { month: "long" }) + " " + year;

      daysContainer.innerHTML = "";

      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        daysContainer.appendChild(empty);
      }

      for (let day = 1; day <= lastDate; day++) {
        const div = document.createElement("div");
        div.textContent = day;
        div.classList.add("day");

        if (day === new Date().getDate() && month === new Date().getMonth()) {
          div.classList.add("active");
        }

        daysContainer.appendChild(div);
      }
    }

    renderCalendar();

    if (prevBtn) prevBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });

    if (nextBtn) nextBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  }
});