// get started
const getStarted = document.getElementById("getStarted");
getStarted.addEventListener("click", function () {
  const heroSection = document.getElementById("heroSection");
  const nameInput = document.getElementById("nameInput").value;
  const passwordInput = document.getElementById("passwordInput").value;
  if (nameInput) {
    if (passwordInput === "123456") {
      const hiddens = document.querySelectorAll(".hidden");
      for (let hidden of hiddens) {
        hidden.classList.remove("hidden");

        // logout
        const logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.addEventListener("click", function () {
          hidden.classList.add("hidden");
          heroSection.classList.remove("hidden");
        });
      }
      Swal.fire({
        title: "অভিনন্দন",
        text: "চলুন আজ নতুন কিছু শেখা যাক",
        icon: "success",
      });

      heroSection.classList.add("hidden");
    } else {
      alert("Wrong password. Contact admin to get Login code");
    }
  } else {
    alert("Please Tell use your Name first");
  }
});

// lesson buttons load
const loadLessonButtons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => {
      for (let lesson of data.data) {
        const lessonButtons = document.getElementById("lessonButtons");
        const btn = document.createElement("button");
        btn.onclick = () => {
          removeActiveClass();
          loadLessons(lesson.level_no);
          btn.classList.add("active");
          showLoader();
        };
        btn.classList.add(
          "btn",
          "bg-transparent",
          "hover:bg-[#422AD5]",
          "text-[#422AD5]",
          "hover:text-white",
          "border-2",
          "border-[#422AD5]"
        );
        btn.innerHTML = `<i class="fa-solid fa-book-open mr-1"></i> Lesson -${lesson.level_no}`;
        lessonButtons.append(btn);
      }
    });
};
loadLessonButtons();

const loadLessons = (level) => {
  fetch(`https://openapi.programming-hero.com/api/level/${level}`)
    .then((res) => res.json())
    .then((data_s) => {
      const lessons = document.getElementById("lessons");
      lessons.innerHTML = ``;

      for (let data of data_s.data) {
        const div = document.createElement("div");
        div.classList.add("p-4", "bg-white", "rounded-xl", "shadow-lg", "shadow-[#DADADA]");
        div.innerHTML = `
  <div class="p-6 border-2 border-[#EDF7FF] rounded-lg h-62 hover:bg-[#F2FBFF]">
  <h1 class="text-center font-bold text-2xl ">${data.word}</h1>
  <p class="text-center font-semibold text-sm my-6">( Meaning ) / ( Pronunciation ) </p>

  <p class="hind-siliguri text-lg text-center">( ${
    data.meaning === null || data.meaning === undefined  ? "অর্থ নেই" : data.meaning
  } ) / ( ${data.pronunciation} )</p>

       <div class="flex justify-between items-center mt-4">
        <div class="btn  rounded-sm " onclick="showLessonDetails(${
          data.id
        })">
          <i class="fa-solid fa-circle-info text-[#374957]"></i>
        </div>
        <div class="btn  rounded-sm " onclick="pronounceWord('${
          data.word
        }')">
        <i class="fa-solid fa-volume-high text-[#374957]"></i>
        </div>
      </div>
      </div>
  `;
        lessons.classList.add(
          "grid",
          "grid-cols-1",
          "md:grid-cols-3",
          "gap-4",
          "text-center"
        );
        lessons.appendChild(div);
      }

      if (data_s.data.length === 0) {
        const div = document.createElement("div");
        div.classList.add("text-center", "col-span-3");
        div.innerHTML = `
        <div class="p-4">
             <div class="flex justify-center">  <img src="assets/alert-error.png" alt=""></div>
        
        <p class="hind-siliguri text-[#79716B] text-sm mt-6">
        এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h1 class="text-3xl hind-siliguri mt-3 mb-6">
        নেক্সট  <span class="poppins">Lesson </span> এ যান
        </h1>
      </div>
      `;
        lessons.appendChild(div);
      }
    });
};

const removeActiveClass = () => {
  const activeBtn = document.getElementsByClassName("active");
  for (let btn of activeBtn) {
    btn.classList.remove("active");
  }
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN";
  window.speechSynthesis.speak(utterance);
}

function showLessonDetails(id) {
  document.getElementById("lessonDetails").innerHTML = ``;

  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const div = document.createElement("div");
      div.classList.add("modal-box", "rounded-xl");
      div.innerHTML = `
        <div class="border-2 border-[#EDF7FF] rounded-lg p-6 pb-0 ">
        <h2 class="text-2xl font-bold">
          ${data.data.word} ( <i class="fa-solid fa-microphone-lines"></i> : ${
        data.data.pronunciation
      } )
        </h2>
        <p class="font-semibold mt-4">Meaning</p>
        <p class="text-gray-700 hind-siliguri" >${
          data.data.meaning === null || data.data.meaning === undefined ? "অর্থ পাওয়া যায়নি" : data.data.meaning
        }</p>
  
        <p class="font-semibold mt-4">Example</p>

        <p class="text-gray-700">${data.data.sentence}</p>
  
        <p class="font-semibold mt-4 hind-siliguri" >সমার্থক শব্দ গুলো</p>
        <div id='synonyms' class="flex gap-2 mt-3">
        </div>
        </div>
                <div class="mt-6">
          <form method="dialog">
            <button class="btn  btn-primary ">Complete Learning</button>
          </form>
        </div>
  `;
      document.getElementById("lessonDetails").appendChild(div);
      document.getElementById("lessonDetails").showModal();
      const synonymsContainer = div.querySelector("#synonyms");
      data.data.synonyms.forEach((synonym) => {
        const span = document.createElement("span");
        span.classList.add(
          "btn",
          "py-1",
          "px-3",
          "border-2",
          "rounded-lg",
          "mb-4"
        );
        span.innerText = synonym;
        synonymsContainer.appendChild(span);
      });
    });
}

function showLoader() {
  const lessons = document.getElementById("lessons");
  lessons.innerHTML = `
  <div class="flex justify-center items-center col-span-3">
            <span class="loading loading-dots loading-xl"></span>
          </div>
  `;
}
