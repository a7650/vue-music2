function getRandom(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}

export function shuffle(arr){
    var arr = [...arr];
    let len = arr.length;
    for(let i = 0 ; i < len ; i++){
        let t = getRandom(0,i);
        let m = arr[t];
        arr[t] = arr[i];
        arr[i] = m;
    }
    return arr; 
}

export function filterArray(searchText,originArray,attribute){
    if(searchText.trim() == ""){
        return originArray
    }
    else{
        return originArray.filter(item => {
            return item[attribute].toLowerCase().indexOf(searchText.trim().toLowerCase()) > -1;
        })
    }

}
export function formateHot(x){
    switch(true){
        case x<10000 : 
            return x;
            break;
        case x<10000000 : 
            return (x/10000).toFixed(1)+"万";
            break;
        default : 
            return (x/10000000).toFixed(1)+"千万";
            break;
    }
}