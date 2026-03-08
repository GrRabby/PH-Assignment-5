
let current_tab = 'all'
function handleLogin(btn) {
    const username = document.getElementById('userInput').value;
    const password = document.getElementById('pwInput').value;
    const error = document.getElementById('loginError');

    error.classList.add('hidden');

    btn.innerHTML = '<span class="loading loading-spinner loading-sm" style="margin-right:6px;"></span> Signing in…';
    btn.disabled = true;

    setTimeout(() => {

        if (username === 'admin' && password === 'admin123') {

        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;display:inline"><polyline points="20 6 9 17 4 12"/></svg> Signed in!';
        btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
        btn.style.boxShadow = '0 4px 18px rgba(34,197,94,0.35)';

        console.log('sign');

        } else {

        error.classList.remove('hidden');

        btn.innerHTML = 'Sign In <i class="fa-solid fa-arrow-right-to-bracket"></i>';
        btn.disabled = false;

        }

    }, 1500);
}
function search_issues(){
    const search_string = document.getElementById('search').value
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${search_string}`)
    .then(resp => resp.json())
    .then(data => {
        add_cards(data.data,true)
    });
}
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

function show_card_details(id,labels_div,badge_element){
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then(resp => resp.json())
    .then(data => {
        let date = new Date(data.data.createdAt);

        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let year = date.getFullYear();

        let formatted = `${day}/${month}/${year}`;
        document.getElementById("modal-content").innerHTML = `
            <div class="flex flex-col gap-2">
                <h1 class="font-bold text-[24px]">${data.data.title}</h1>
                <div class="flex gap-3 items-center">
                    <div class="w-[60px] h-[24px] rounded-[100px] text-white ${data.data.status === 'open' ? 'bg-[#00A96E]' : 'bg-[#a855f7]'}  items-center flex justify-center text-[12px] p-2">
                        ${data.data.status === 'open' ? 'Opened' : 'Closed'}
                    </div>
                    <p class="text-[#64748B] text-[12px] flex gap-1"><span>•</span><span>Opened by ${data.data.author}</span></p>
                    <p class="text-[#64748B] text-[12px] flex gap-1"><span>•</span><span>${formatted}</span></p>
                </div>
            </div>
            <div class="flex justify-start items-center gap-1">
                ${labels_div.map(label => label.outerHTML).join("")}
            </div>
            <p class="text-[16px] text-[#64748B]">${data.data.description}</p>
            <div class="flex justify-start items-center p-4 bg-[#F8FAFC] rounded-md">
                <div class="flex flex-col justify-center items-start flex-1">
                    <p class="text-[16px] text-[#64748B]">Assignee:</p>
                    <p class="font-bold text-[16px]">${data.data.assignee}</p>
                </div>
                <div class="flex flex-col justify-center items-start flex-1">
                    <p class="text-[16px] text-[#64748B]">Priority:</p>
                    ${badge_element.outerHTML}
                </div>
            </div>
            <div class="modal-action mt-1">
                <form method="dialog">
                    <button class="btn btn-primary">Close</button>
                </form>
            </div>
        `
        document.getElementById("card_modal").showModal();
    })
}
async function load_data() {
    try {
        const main_container = document.getElementById('card-container');
        main_container.innerHTML = `<span class="loading loading-infinity loading-xl col-span-4"></span>`
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        add_cards(data.data,true)
    } catch (err) {
        console.error(err);
        return [];
    }
}
function add_cards(card_data,animation=false){
    const main_container = document.getElementById('card-container');

    if(card_data.length === 0){
        main_container.innerHTML =  `
        <div id="no-card" class="bg-[#f8fafc] p-6 rounded-lg border border-base-300 shadow-md w-full h-[300px] sm:h-[400px] flex justify-center items-center flex-col gap-1 text-center col-span-4">
            <img src="document.png" alt="">
            <h1 class="text-[24px] font-semibold">No issues available</h1>
            <h2 class="text-4 text-[#64748B]">Check back soon for new issues</h2>
        </div>
        `
        document.getElementById('total_issue').innerText =  `0 Issues`;
        return
    }
    let filtered_cards;
    if (current_tab === 'all'){
        filtered_cards = card_data
    }else if(current_tab === 'open'){
        filtered_cards = card_data.filter(job => job.status === 'open')
    }else if(current_tab === 'close'){
        filtered_cards = card_data.filter(job => job.status === 'closed')
    }
    document.getElementById('total_issue').innerText =  `${filtered_cards.length} Issues`;
    main_container.innerHTML = ''
    for(const cards of filtered_cards){
        let date = new Date(cards.updatedAt);

        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let year = date.getFullYear();

        let formatted = `${day}/${month}/${year}`;
        const div = document.createElement('div');
        div.setAttribute('id', 'cards');
        if(animation) div.classList.add('opacity-0','-translate-x-10','ease-in-out','transition-all', 'duration-500','w-full')

        div.innerHTML = `
            <div id="cards" class="flex flex-col items-start justify-start w-full xl:w-[255px] border rounded-md border-t-[3px] bg-white shadow-md h-full hover:-translate-y-0.5 transition-all duration-500">
                <div class="p-4 space-y-3 h-full w-full">
                    <div class="flex justify-between items-center w-full">
                        <img id="status_icon" src="./assets/Open-Status.png" alt="">
                        <div id="priority_badge" class="w-[80px] font-semibold h-[24px] rounded-[100px] items-center flex justify-center text-[12px]">
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
                    <p class="text-[12px] text-[#64748B]">#${cards.author}</p>
                    <p class="text-[12px] text-[#64748B]">${formatted}</p>
                </div>
            </div>
        `
        if(cards.status === 'open') {
            div.querySelector('#status_icon').src = './assets/Open-Status.png'
            div.querySelector('#cards').classList.add('border-t-[#00a86e]','border-[#c3e2d7]')
        }else{
            div.querySelector('#status_icon').src = './assets/Closed- Status .png'
            div.querySelector('#cards').classList.add('border-t-[#a855f7]','border-[#e8dcf1]')
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
        let appended_labels = []
        for(const labels of cards.labels){
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
            appended_labels.push(labels_div)
        }
        div.addEventListener('click', (event) => {
            show_card_details(cards.id,appended_labels,div.querySelector('#priority_badge'))
        })
        main_container.appendChild(div);
        setTimeout(() => {
            div.classList.remove('opacity-0', '-translate-x-10');
            div.classList.add('opacity-100',);
        }, 10);
    }
}