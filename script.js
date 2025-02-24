const nextBtn = document.querySelector(".next-btn");
const backBtn = document.querySelector(".back-btn");
const allPages = document.querySelectorAll(".page");
const allSteps = document.querySelectorAll(".step");
const planCtn = document.querySelector(".plans");
const addonCtn = document.querySelector(".addons");
const toggleBtn = document.querySelector(".switch");
const toggleLabels = document.querySelectorAll(".toggle-label");
const sumCntn = document.querySelector(".summary-container");
const addonCntn = document.querySelector(".addons");
const totalCntn = document.querySelector(".summary-total");

let currPage = 1;
let totalPlan = 0;
let maxPage = 5;

const monthPlanObj = [
  { id: 1, name: "Arcade", price: "9/mo" },
  { id: 2, name: "Advanced", price: "12/mo" },
  { id: 3, name: "Pro", price: "15/mo" },
];

const yearPlanObj = [
  { id: 1, name: "Arcade", price: "90/yr" },
  { id: 2, name: "Advanced", price: "120/yr" },
  { id: 3, name: "Pro", price: "150/yr" },
];

const planObj = [monthPlanObj, yearPlanObj];

const monthAddonObj = [
  {
    id: 1,
    title: "Online service",
    desc: "Access to multiplayer games",
    price: "1/mo",
  },
  {
    id: 2,
    title: "Larger storage",
    desc: "Extra 1TB of cloud save",
    price: "2/mo",
  },
  {
    id: 3,
    title: "Customizable Profile",
    desc: "Custom theme on your profile",
    price: "2/mo",
  },
];

const yearAddonObj = [
  {
    id: 1,
    title: "Online service",
    desc: "Access to multiplayer games",
    price: "10/yr",
  },
  {
    id: 2,
    title: "Larger storage",
    desc: "Extra 1TB of cloud save",
    price: "20/yr",
  },
  {
    id: 3,
    title: "Customizable Profile",
    desc: "Custom theme on your profile",
    price: "20/yr",
  },
];

const addonObj = [monthAddonObj, yearAddonObj];

// Displan plan UI
const displayPlan = function (planObj, yearly = false) {
  planCtn.innerHTML = "";

  const plan = yearly ? planObj[1] : planObj[0];

  plan.forEach(({ id, name, price }) => {
    const HTML = `
        <div class="plan" id="${id}">
                    <img src="images/icon-${name}.svg" alt="${name}-icon" />
                    <div class="plan-content">
                        <h5 class="plan-title">${name}</h5>
                        <p class="plan-price">$${price}</p>
                        <p class="plan-discount">${
                          yearly ? "2 months Free" : ""
                        }</p>
                    </div>
                </div>
      `;

    planCtn.insertAdjacentHTML("beforeend", HTML);
  });
};

displayPlan(planObj);

//Display Addon Ui
const displayAddon = function (addonObj, yearly) {
  addonCtn.innerHTML = "";

  const addon = yearly ? addonObj[1] : addonObj[0];

  addon.forEach(({ id, title, desc, price }) => {
    const HTML = `
        <div class="addon" id="${id}">
                    <input type="checkbox" id="${title}"  class="addon-checkbox">
                    <label for="${title}" class="addon-label">
                        <div class="addon-content">
                            <span class="addon-title">${title}</span>
                            <span class="addon-desc">${desc}</span>
                        </div>
                        <span class="addon-price">+$${price}</span>
                    </label>
                </div>
      `;

    addonCtn.insertAdjacentHTML("beforeend", HTML);
  });
};

displayAddon(addonObj);

// Display Current page
const activePage = function (page) {
  if (currPage > 1) backBtn.classList.remove("hidden");
  else backBtn.classList.add("hidden");

  if (currPage === maxPage) {
    nextBtn.classList.add("hidden");
    backBtn.classList.add("hidden");
  }

  const activePage = document.querySelector(`.page--${page}`);
  allPages.forEach((page) => page.classList.add("hidden"));
  activePage.classList.remove("hidden");

  activateStep(currPage);
};

// Display current step
const activateStep = function (page) {
  const activeStep = document.querySelector(`.step--${page}`);
  allSteps.forEach((step) => step.classList.remove("step--active"));
  activeStep?.classList.add("step--active");
};

const changeBtn = function () {
  if (currPage === maxPage - 1) {
    nextBtn.textContent = "Confirm";
    nextBtn.style.backgroundColor = "#483eff";
  } else {
    nextBtn.textContent = "Next Step";
    nextBtn.style.backgroundColor = "#012a56";
  }
};

// Get user plan
const selectPlan = function (e) {
  const clicked = e.target.closest(".plan");

  if (!clicked) return;

  const allPlans = document.querySelectorAll(".plan");
  allPlans.forEach((p) => p.classList.remove("selected"));

  clicked.classList.add("selected");

  const selected = document.querySelector(".selected");
  const selectedId = selected.getAttribute("id");

  const planObj = year ? yearPlanObj : monthPlanObj;

  const objId = planObj.find(({ id }) => {
    return id == `${selectedId}`;
  });

  totalPlan = Number.parseInt(objId.price, 10);

  displaySummaryPlan(objId);
};

// Get user plan and display in summary page
const displaySummaryPlan = function (Obj) {
  sumCntn.innerHTML = "";

  const HTML = `
    <div class="summary-header">
                    <div class="summmary-title">
                        <span class="title">${Obj.name} (${
    year ? "Yearly" : "Monthly"
  })</span>
                        <a href="#" class="change-plan">Change</a>
                    </div>
                    <span class="summary-price">$${Obj.price}</span>
                </div>
  `;
  sumCntn.insertAdjacentHTML("beforeend", HTML);
};

// Get user addon selection
const selectAddon = function (e) {
  const clicked = e.target.closest(".addon");

  if (!clicked) return;
  clicked.classList.toggle("selected");

  const selected = document.querySelectorAll(".addon.selected");
  let values = Array.from(selected).map((box) => +box.id);

  const addonObj = year ? yearAddonObj : monthAddonObj;
  const objId = addonObj.filter((plan) => values.includes(plan.id));

  document.querySelectorAll(".addon-item").forEach((item) => {
    const itemId = +item.dataset.id;
    if (!values.includes(itemId)) {
      item.remove();
    }
  });

  const totalAddon = objId
    .map(({ price }) => Number.parseInt(price, 10))
    .reduce((el, acc) => el + acc, 0);

  displaySummaryAddon(objId);
  displayTotal(totalAddon);
};

// Display Addon Summary
const displaySummaryAddon = function (obj) {
  obj.forEach(({ id, title, price }) => {
    if (!document.querySelector(`.addon-item[data-id="${id}"]`)) {
      const HTML = `
        <div class="addon-item" data-id="${id}">
          <span class="item-name">${title}</span>
          <span class="item-price">+$${price}</span>
        </div>
      `;
      sumCntn.insertAdjacentHTML("beforeend", HTML);
    }
  });
};

// Display total price based on user selection
const displayTotal = function (Obj) {
  totalCntn.innerHTML = "";
  const HTML = `
  <span class="total-text">Total (per ${year ? "year" : "month"})</span>
                <span class="total-price" id="total-price">$${
                  Obj + totalPlan
                } / ${year ? "yr" : "mo"}</span>
  `;

  totalCntn.insertAdjacentHTML("beforeend", HTML);
};

//Make sure user enters inputs
const validateInputs = function () {
  let isValid = true;
  const inputs = document.querySelectorAll(
    ".page:not(.hidden) input[required]"
  );

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("error");
      if (!input.nextElementSibling?.classList.contains("error-msg")) {
        input.insertAdjacentHTML(
          "afterend",
          `<span class="error-msg">This field is required</span>`
        );
      }
      isValid = false;
    } else {
      input.classList.remove("error");
      input.nextElementSibling?.remove();
    }
  });

  return isValid;
};

//Event Listeners
let year = false;
toggleBtn.addEventListener("change", function (e) {
  displayPlan(planObj, !year);
  displayAddon(addonObj, !year);
  year = !year;

  toggleLabels.forEach((label) => label.classList.toggle("active"));
});

nextBtn.addEventListener("click", function () {
  if (!validateInputs()) {
    return;
  }
  currPage++;
  changeBtn();
  activePage(currPage);
});

backBtn.addEventListener("click", function () {
  currPage--;
  changeBtn();
  activePage(currPage);
});

planCtn.addEventListener("click", selectPlan);

addonCntn.addEventListener("change", selectAddon);
