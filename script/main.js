
let current_tab = 'all'
function tabs_switched(element,type){
    const children = document.getElementById('tab-items').children;
    Array.from(children).forEach(ele => {
        ele.classList.remove('btn-primary');
    });
    current_tab = type // flag the selected tab to update job list depending on selected tab
    if (type === 'all'){
        element.classList.add('btn-primary')
        load_data()
    }else if(type === 'open'){
        element.classList.add('btn-primary')
        load_data()
    }else if(type === 'close'){
        element.classList.add('btn-primary')
        load_data()
    }
}
async function load_data() {
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        add_cards(data.data)
    } catch (err) {
        console.error(err);
        return [];
    }
}
function add_cards(card_data,animation=false){

    const main_container = document.getElementById('card-container');
    let filtered_cards;
    if (current_tab === 'all'){
        filtered_cards = card_data
    }else if(current_tab === 'open'){
        filtered_cards = card_data.filter(job => job.status === 'open')
    }else if(current_tab === 'close'){
        filtered_cards = card_data.filter(job => job.status === 'closed')
    }
    document.getElementById('total_issue').innerText =  `${filtered_cards.length} Issue`;
    main_container.innerHTML = ''
    for(cards of filtered_cards){
        const div = document.createElement('div');
        div.setAttribute('id', 'cards');
        if(animation) div.classList.add('opacity-0','-translate-x-10')

        div.innerHTML = `
            <div id="cards" class="flex flex-col items-start justify-start w-[255px] border-[#c3e2d7] border rounded-md border-t-[3px] bg-white shadow-md h-full">
                <div class="p-4 space-y-3 h-full w-full">
                    <div class="flex justify-between items-center w-full">
                        <img id="status_icon" src="./assets/Open-Status.png" alt="">
                        <div id="priority_badge" class="w-[80px] font-semibold h-[24px] rounded-[100px] items-center flex justify-center text-[12px]">
                            High
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 h-full w-full">
                        <h1 class="font-semibold text-[14px] min-h-[42px]">${cards.title}</h1>
                        <p class="text-[12px] text-[#64748B] line-clamp-2">${cards.description}</p>
                        <div id="labels" class="flex gap-1 flex-wrap">
                        </div>
                    </div>
                </div>
                <hr class="h-[1px] bg-[#E4E4E7] border-none w-full">
                <div class="flex flex-col justify-center items-start p-4 w-full gap-2">
                    <p class="text-[12px] text-[#64748B]">${cards.author}</p>
                    <p class="text-[12px] text-[#64748B]">${cards.createdAt}</p>
                </div>
            </div>
        `
        if(cards.status === 'open') {
            div.querySelector('#status_icon').src = './assets/Open-Status.png'
            div.querySelector('#cards').classList.add('border-t-[#00a86e]')
        }else{
            div.querySelector('#status_icon').src = './assets/Closed- Status .png'
            div.querySelector('#cards').classList.add('border-t-[#a855f7]')
        }
        badge_element = div.querySelector('#priority_badge')
        if(cards.priority === 'high'){
            badge_element.innerHTML = 'HIGH'
            badge_element.classList.add('text-red-600','bg-[#FEECEC]')
        }else if(cards.priority === 'medium'){
            badge_element.innerHTML = 'MEDIUM'
            badge_element.classList.add('text-[#f59e0b]','bg-[#fff6d1]')
        }else if(cards.priority === 'low'){
            badge_element.innerHTML = 'LOW'
            badge_element.classList.add('text-[#b1b6c0]','bg-[#eeeff2]')
        }
        labelsContainer = div.querySelector('#labels')
        for(labels of cards.labels){
            const labels_div = document.createElement('div');
            if(labels === 'bug'){
                labels_div.setAttribute('class','w-fit px-2 h-[24px] font-medium rounded-[100px] text-[#EF4444] bg-[#FEECEC] items-center flex justify-center text-[12px] border-1 border-[#FECACA]"')
                labels_div.innerHTML = `
                    <div class="flex gap-1 items-center">
                        <img src="./assets/BugDroid.png" alt="">
                        <span>BUG</span>
                    </div>
                `
            }else if (labels === 'enhancement'){
                labels_div.setAttribute('class','w-fit px-2 h-[24px] font-medium rounded-[100px] text-[#00A96E] bg-[#DEFCE8] items-center flex justify-center text-[12px] border-1 border-[#BBF7D0]"')
                labels_div.innerHTML = `
                    <div class="flex gap-1 items-center">
                        <img src='./assets/enhancement.png' alt="">
                        <span>ENHANCEMENT</span>
                    </div>
                `
            }else{
                labels_div.setAttribute('class','w-fit px-2 h-[24px] font-medium rounded-[100px] text-[#e3973b] bg-[#fff8db] items-center flex justify-center text-[12px] border-1 border-[#FDE68A]"')
                labels_div.innerHTML = `
                    <div class="flex gap-1 items-center">
                        <img src='./assets/help.png' alt="">
                        <span>${labels.toUpperCase()}</span>
                    </div>
                `
            }
            labelsContainer.appendChild(labels_div)
        }
        main_container.appendChild(div);
        setTimeout(() => {
            div.classList.remove('opacity-0', '-translate-x-10');
            div.classList.add('opacity-100',);
        }, 10);
    }
}