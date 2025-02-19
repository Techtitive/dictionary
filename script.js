const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const audio = document.getElementById("audio");
const button = document.getElementById("button");

button.addEventListener("click", () => {
  const text = document.getElementById("text").value;
  fetchData(text);
});

document.addEventListener("keydown", (event) => {
  if(event.key == "Enter"){
    const text = document.getElementById("text").value;
    fetchData(text);
  };
});

function getValidValue(arr, key) {
  for (const item of arr) {
    if (item[key] && item[key] !== "") {
      return item[key];
    }
  }
  return ""; 
}

function getValidDefinition(arr) {
  for (const meaning of arr) {
    for (const definition of meaning.definitions) {
      if (definition.definition && definition.definition !== "") {
        return definition.definition;
      }
    }
  }
  return "";
}

function getValidExample(arr) {
  for (const meaning of arr) {
    for (const definition of meaning.definitions) {
      if (definition.example && definition.example !== "") {
        return definition.example;
      }
    }
  }
  return "";
}

function getValidAudio(phonetics) {
  for (const phonetic of phonetics) {
    if (phonetic.audio && phonetic.audio !== "") {
      return phonetic.audio;
    }
  }
  return null; 
}

function fetchData(word) {
 fetch(`${url}${word}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data || !data.length) {
        result.innerHTML = `<p class="error">Word not found.</p>`;

        return;
      }

      const phonetics = data.flatMap(entry => entry.phonetics);
      const meanings = data.flatMap(entry => entry.meanings);
      
      const partOfSpeech = getValidValue(meanings, "partOfSpeech");
      const phoneticText = getValidValue(phonetics, "text");
      const definition = getValidDefinition(meanings);
      const example = getValidExample(meanings);
      const audioSrc = getValidAudio(phonetics);

      result.innerHTML = `
        <div class="word">
          <h3>${word}</h3>
          <button id="sound" onclick="playSound()">
            <span class="fa fa-solid fa-volume-up"></span>
          </button>
        </div>
        <div class="details">
          <p>${partOfSpeech}</p>
          <p>${phoneticText}</p>
        </div>
        <p class="wordmean">${definition}</p>
        <p class="wordex">${example}</p>`;

      if (audioSrc) {
        audio.src = audioSrc;
        document.getElementById("sound").style.display = "block";
      } else {
        audio.src = "";
        document.getElementById("sound").style.display = "none";
      }
    })
    .catch(error => console.error("Error fetching data:", error));
}

function playSound() {
  if (audio.src) {
    audio.play();
  } else {
    console.warn("No audio available.");
  }
}
