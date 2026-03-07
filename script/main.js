function tabs_switched(element,type){
    const children = document.getElementById('tab-items').children;
    Array.from(children).forEach(ele => {
        ele.classList.remove('btn-primary');
    });
    current_tab = type // flag the selected tab to update job list depending on selected tab
    if (type === 'all'){
        element.classList.add('btn-primary')
    }else if(type === 'open'){
        element.classList.add('btn-primary')
    }else if(type === 'close'){
        element.classList.add('btn-primary')
    }
}