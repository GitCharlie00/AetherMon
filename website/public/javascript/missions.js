class Monster {
    constructor(ps, attack, defense, speed, type, moves, name, owner, image_url) {
        this.ps = ps;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.type = type;
        this.moves = moves;
        this.name = name;
        this.owner = owner;
        this.image_url = image_url;
    }
}

class Mission {
    constructor(text, type) {
        this.text = text;
        this.type = type;
    }
}

const remaining_hard_missions = 3;
const remaining_normal_missions = 3;
const remaining_easy_missions = 3;

let actual_first_monster_index = 0;

monsters_list = [];

const monster2 = new Monster(50, 70, 40, 90, 2, [15, 1], 'reshiram', 'Ash', 'images/monsters/reshiram.jpg');
monsters_list.push(monster2);

const monster1 = new Monster(50, 70, 40, 90, 2, [15, 1], 'zekrom', 'Ash', 'images/monsters/zekrom.png');
monsters_list.push(monster1);

const monster3 = new Monster(50, 70, 40, 90, 2, [15, 1], 'kyurem', 'Ash', 'images/monsters/kyurem.jpg');
monsters_list.push(monster3);

let first_monster = monsters_list[actual_first_monster_index];

missions_list = [];

const hard_mission = new Mission("text",0);
missions_list.push(hard_mission)

const normal_mission = new Mission("trova il gatto",1);
missions_list.push(normal_mission)

const easy_mission = new Mission("trova il cane",2);
missions_list.push(easy_mission)

document.addEventListener('DOMContentLoaded', function() {
    load_first_monster();
    load_missions();
});

function load_first_monster(){
    update_new_first_monster();
}

function update_new_first_monster() {
    new_first_monster = monsters_list[actual_first_monster_index]
    const monster_image = document.getElementById('main_monster_image');
    monster_image.src=new_first_monster.image_url;
    const monster_name = document.getElementById('main_monster_name');
    monster_name.textContent=new_first_monster.name;
}

function change_monster(index){

}

function popup_monster_list() {
    const element = document.getElementById('list_overlay');
    element.style.visibility = 'visible';
    const popup_monster_list = document.getElementById('popup_monsters_list');
    for (let i = 0; i < monsters_list.length; i++) {
        if(actual_first_monster_index!=i) {
        let new_id = 'monster_card_list'+i;
    fetch('html/monster_card.html')
    .then(response => response.text())
    .then(html => {
                console.log("miaoas")
                const newString = 'class="monster_card_list_slot" ' + 'id="' +new_id +'"';
                html = html.replace('class="monster_card_list_slot"', newString);
                popup_monster_list.insertAdjacentHTML('beforeend', html)
    })
    .then(function() {

        let popup_monster_list = document.getElementById(new_id);
        var popup_monster_list_name = popup_monster_list.querySelector('.monster_list_name');
        popup_monster_list_name.textContent=monsters_list[i].name;

        var popup_monster_list_image = popup_monster_list.querySelector('.monster_list_image');
        popup_monster_list_image.src=monsters_list[i].image_url;

        var popup_monster_list_button = popup_monster_list.querySelector('.button_select_list_card');
        popup_monster_list_button.onclick = function() {
            buttonSelectNewMonster(i);
        };

        var popup_monster_infos_button = popup_monster_list.querySelector('.button_info_list_card');
        popup_monster_infos_button.onclick = function() {
            popupMonsterInfos(i);
        };
    })
    .catch(error => console.error(error));
    }
}
}

function close_pop_monster_list() {
    const element = document.getElementById('list_overlay');
    element.style.visibility = 'hidden';
    const popup_monster_list = document.getElementById('popup_monsters_list');
    popup_monster_list.innerHTML = '';
}

function close_pop_infos() {
    const element = document.getElementById('infos_overlay');
    element.style.visibility = 'hidden';
}

function buttonSelectNewMonster(index) {
    console.log("pressed");
    actual_first_monster_index = index;
    load_first_monster();
    close_pop_monster_list()

}

function popupMonsterInfos(index) {
    const element = document.getElementById('infos_overlay');
    element.style.visibility = 'visible';

    var popup_infos_name = document.getElementById('popup_infos_name_inner');
    popup_infos_name.textContent=monsters_list[index].name;

    var popup_infos_ps = document.getElementById('ps_stat');
    popup_infos_ps.textContent="PS: "+monsters_list[index].ps;

    var popup_infos_attack = document.getElementById('attack_stat');
    popup_infos_attack.textContent="ATTACK: "+monsters_list[index].attack;

    var popup_infos_defense = document.getElementById('defense_stat');
    popup_infos_defense.textContent="DEFENSE: "+monsters_list[index].defense;

    var popup_infos_speed = document.getElementById('speed_stat');
    popup_infos_speed.textContent="SPEED: "+monsters_list[index].speed;

    var popup_infos_img = document.getElementById('popup_infos_img');
    popup_infos_img.src=monsters_list[index].image_url;
}

function popupSelectedMonsterInfos() {
    popupMonsterInfos(actual_first_monster_index);
}

function test(){
    console.log("testz")
}

function select_mission(index){
    const element = document.getElementById('start_overlay');
    element.style.visibility = 'visible';
    console.log("mission_selected "+ index);
}

function back_on_start() {
    const element = document.getElementById('start_overlay');
    element.style.visibility = 'hidden';
}

function load_missions() {

    console.log("missions loaded");
    let hard_mission_element = document.getElementById("hard_mission");
    var hard_mission_element_text = hard_mission_element.querySelector('.mission_info');
    hard_mission_element_text.textContent = hard_mission.text

    let normal_mission_element = document.getElementById("normal_mission");
    var normal_mission_element_text = normal_mission_element.querySelector('.mission_info');
    normal_mission_element_text.textContent = normal_mission.text

    let easy_mission_element = document.getElementById("easy_mission");
    var easy_mission_element_text = easy_mission_element.querySelector('.mission_info');
    easy_mission_element_text.textContent = easy_mission.text


}

function back_from_list(){
    
}