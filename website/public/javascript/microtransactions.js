class Microtransaction {
    constructor(money, aethercoin, type) {
        this.money = money;
        this.aethercoin = aethercoin;
        this.type = type;
    }
}

microtransaction_list = [];


document.addEventListener('DOMContentLoaded', function() {
    microtransaction_list.push(new Microtransaction(7.99,1000,0));
    microtransaction_list.push(new Microtransaction(12.99,2000,1));
    microtransaction_list.push(new Microtransaction(21.99,5000,2));
    microtransaction_list.push(new Microtransaction(44.99,14000,3));
    load_microtransactions_cards();
});

function load_microtransactions_cards() {

    const popup_monster_list = document.getElementById('micro_cards_list');
    for (let i = 0; i < microtransaction_list.length; i++) {
        let new_id = 'transaction_card'+i;
        fetch('html/microtransactions_card.html')
        .then(response => response.text())
        .then(html => {
                const newString = 'class="micro_card" ' + 'id="' +new_id +'"';
                html = html.replace('class="micro_card"', newString);
                popup_monster_list.insertAdjacentHTML('beforeend', html)
    })
    .then(function() {

        let micro_card= document.getElementById(new_id);
        var micro_card_money = micro_card.querySelector('.micro_card_down');
        micro_card_money.textContent=microtransaction_list[i].money + "$";

        var micro_card_aethercoin = micro_card.querySelector('.micro_card_athercoin');
        micro_card_aethercoin.textContent=microtransaction_list[i].aethercoin + "Æ";

        var micro_card_image = micro_card.querySelector('.micro_card_image');
        micro_card_image.src=microtransaction_type_image(microtransaction_list[i].type);

        var micro_card_inner = micro_card.querySelector('.micro_card_inner');
        micro_card_inner.onclick = function() {
            open_accept_transaction(i);
        };

    })
    .catch(error => console.error(error));
}
}

function microtransaction_type_image(index){
    url_image = "images/microtransactions/emerald.png"

    switch (index) {
        case 0:
          url_image = "images/microtransactions/emerald.png"
          break;
        case 1:
            url_image = "images/microtransactions/saphire.png"
          break;
        case 2:
            url_image = "images/microtransactions/ruby.png"
          break;
        case 3:
            url_image = "images/microtransactions/diamond.png"
          break;
        default:
            url_image = "images/microtransactions/emerald.png"
          break;
      }
      return url_image
}

function open_accept_transaction(index) {
    const element = document.getElementById('start_overlay');
    element.style.visibility = 'visible';
    console.log("mission_selected "+ index);
}

function back_on_transaction() {
    const element = document.getElementById('start_overlay');
    element.style.visibility = 'hidden';
}

function go_back() {
    console.log("indietros");
}