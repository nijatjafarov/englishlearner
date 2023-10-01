var words = document.getElementById('words');

var add_btn = document.getElementById('add-button');
var start_btn = document.getElementById('start-button');

function stringToNode(htmlString) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.firstChild;
}

var word_group_text = `
    <div class="word-groups d-flex">
        <div class="row mb-3">
            <div class="col">
            <input type="text" class="form-control keys" placeholder="Açar söz" required>
            </div>
            <div class="col">
            <input type="text" class="form-control values" placeholder="Qarşılıq" required>
            </div>
        </div>
        <h3 onclick="remove(this)" style="cursor: pointer;" class="ml-4">❌</h3>
    </div>
`

var word_group = stringToNode(word_group_text).cloneNode(true);



if(Object.keys(getAllCookies()).length > 0){
    for (let i = Object.keys(getAllCookies()).length - 1; i > -1; i--) {
        const element = Object.keys(getAllCookies())[i];
        word_group_clone = word_group.cloneNode(true);
        if (getAllCookies()[Object.keys(getAllCookies())[i]] != 'undefined') {
            word_group_clone.getElementsByTagName('input')[0].value = Object.keys(getAllCookies())[i];
            word_group_clone.getElementsByTagName('input')[1].value = getAllCookies()[Object.keys(getAllCookies())[i]];
        } else {
            word_group_clone.getElementsByTagName('input')[0].value = '';
            word_group_clone.getElementsByTagName('input')[1].value = '';
        }
        words.appendChild(word_group_clone);
    }
}

var keys = document.getElementsByClassName('keys');
var values = document.getElementsByClassName('values');

add_btn.style.marginLeft = keys[0].clientWidth + 'px';
start_btn.style.marginLeft = keys[0].clientWidth - 15 + 'px';

function add() {
    word_group_clone = word_group.cloneNode(true);
    words.appendChild(word_group_clone);
}

function remove (x) {
    if(document.getElementsByClassName('word-groups').length > 1) {
        x.parentElement.parentElement.removeChild(x.parentElement);
    }
}

var words_box = document.getElementById('words-box');
var quiz = document.getElementById('quiz');
var words_box_show = true;

function removeAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
}

function hide() {
    words_box.style.display = 'none';
    start_btn.innerText = 'Düzəliş et';
    quiz.style.display = 'block';
    words_box_show = false;
}

var randomProperty = function (object) {
    var keys = Object.keys(object);
    return keys[Math.floor(keys.length * Math.random())];
};

var word_az = document.getElementById('word-az');
var true_false = document.getElementById('true-false');
var result = document.getElementById('result');

async function start () {
    var word_groups = document.getElementsByClassName('word-groups');

    if (words_box_show) {
        hide();

        removeAllCookies();

        for (let i = 0; i < word_groups.length; i++) {
            var key = word_groups[i].getElementsByTagName('input')[0].value;
            var value = word_groups[i].getElementsByTagName('input')[1].value;
            document.cookie = `${key}=${value}`;
        }

        words_box_show = false;
        await fetch('/path/cache', {Cache: 'reload', credentials: 'include'});

        var queries = getAllCookies();
        var key = randomProperty(queries);

        word_az.innerHTML = `<b id="word" class="text-primary">${key}</b> sözünün qarşılığı nədir?`;

    } else {
        words_box.style.display = 'block';
        start_btn.innerText = 'Başla';
        words_box_show = true;
    }
}

function getAllCookies() {
    var cookies = {};

    var cookieArray = document.cookie.split(';');

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        var parts = cookie.split('=');
        var name = parts[0];
        var value = decodeURIComponent(parts[1]);
        cookies[name] = value;
    }

    return cookies;
}

'speechSynthesis' in window ? console.log("Səs dəstəklənir") : console.log("Səs dəstəklənmir :(");

var synth = window.speechSynthesis;

function british_sound_and_write(word) {
    var utterThis = new SpeechSynthesisUtterance(word);
    utterThis.lang = 'en-GB';
    synth.speak(utterThis);
};

var true_false = document.getElementById('true-false');
var result = document.getElementById('result');

function check () {
    var queries = getAllCookies();
    var word = document.getElementById('word').innerText;
    var input = document.getElementById('input');

    if (input.value == null || input.value == ""){
        window.alert('Cavab daxil et!');
    } else {
        if (queries[word] == input.value) {
            true_false.innerHTML = "Cavab doğrudur!👍 <img width=100 src='ronaldo.png' alt='ronaldo'>";
        } else {
            true_false.innerHTML = "Səhvlik var!😬 Dərdin nədir? Oxu bala👴😂 <img width=150 src='messi.png' alt='messi'>";
        }
        result.innerHTML = `<b class="text-primary">${word}</b> sözünün qarşılığı: <b style="cursor: pointer" onclick="british_sound_and_write('${queries[word]}')" class="text-primary">${queries[word]} 🔊</b>`;
        input.value = "";
        british_sound_and_write(queries[word]);
        key = randomProperty(queries);
        word_az.innerHTML = `<b id="word" class="text-primary">${key}</b> sözünün qarşılığı nədir?`;
    }
}

