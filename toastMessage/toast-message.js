//toast 출력 상황
const toastViewStatusFlg = {
    SUCCESS: {
        value: "fa-solid fa-circle-check",
        color: "green",
    },
    FAIL: {
        value: "fa-solid fa-circle-xmark",
        color: "red",
    },
    ERROR: {
        value: "fa-solid fa-circle-exclamation",
        color: "gold",
    },
    GOOD: {
        value: "fa-solid fa-thumbs-up",
        color: "blue",
    },
    BAD: {
        value: "fa-solid fa-thumbs-down",
        color: "orange",
    },
    DEFAULT: {
        value: "fa-solid fa-circle-question",
        color: "black",
    },
    OOPS: {
        value: "fa-solid fa-circle-exclamation",
        color: "purple",
    },
};

let showToastSetTimeoutObject = null;

/*
 * 3초간 상단에 toast 띄우기(전체 4.5초, fade in / out 2초)
 * @dom Object id
 * - toast-message-object : 최상위(level1) div tag
 * - toast-message-object-img : level2 div tag
 * - toast-message-object-img-icon : img div 하위 level3 i tag
 * (i tag icon : fontawesome icon)
 * - toast-message-object-value : level2 div tag
 * 
 * @param
 * - setMessageValue : 최대 22글자, toast 출력 문자
 * - setToastFlg : toast 출력 상황
 * 
*/
const show_toast = (setMessageValue, setToastFlg) => {
    makeObjectDivToastMessage();

    const toastMessageObject = document.getElementById("toast-message-object-"+makeObjectDivToastMessageArray[makeObjectDivToastMessageArray.length-1]);
    const toastMessageObjectImgIcon = document.getElementById("toast-message-object-img-icon");
    const toastMessageObjectValue = document.getElementById("toast-message-object-value");

    makeObjectDivToastMessageArray.reverse().forEach(modtm => {
        const prevToastMessageObject = document.getElementById("toast-message-object-"+modtm);

        if(prevToastMessageObject.className === 'toast-message-objects show') {
            prevToastMessageObject.className = 'toast-message-objects ';
        }
    });

    if(!setToastFlg) {
        setToastFlg = 'DEFAULT';  
    }

    if(setMessageValue && setMessageValue.length > 22) {
        setToastFlg = 'ERROR';
    }

    toastMessageObjectImgIcon.className = toastViewStatusFlg[setToastFlg].value;
    toastMessageObject.className = 'toast-message-objects show';
    toastMessageObjectValue.innerText = setMessageValue;
    toastMessageObjectImgIcon.style.color = toastViewStatusFlg[setToastFlg].color;

    showToastSetTimeoutObject = setTimeout(() => {
        toastMessageObjectImgIcon.className = '';
        toastMessageObject.className = 'toast-message-objects';
        toastMessageObjectValue.innerText = 'A Notification Message';
        toastMessageObjectImgIcon.style.color = 'black';
    }, 4500);
}

const makeObjectDivToastMessageArray = [];

//toast message div 초기 생성
const makeObjectDivToastMessage = () => {
    const uuid = nowTimeUUID();

    if(makeObjectDivToastMessageArray.length > 0) {
        makeObjectDivToastMessageArray.reverse().forEach(modtm => {
            const prevToastMessageObject = document.getElementById('toast-message-object-'+modtm);
            document.body.removeChild(prevToastMessageObject);
            makeObjectDivToastMessageArray.pop();
        });
    }

    makeObjectDivToastMessageArray.push(uuid);

    const toastMessageDiv = document.createElement('div');
    const toastMessageDivImg = document.createElement('div');
    const toastMessageDivImgIcon = document.createElement('i');
    const toastMessageDivValue = document.createElement('div');

    toastMessageDiv.id = 'toast-message-object-'+uuid;
    toastMessageDiv.className = 'toast-message-objects';
    toastMessageDivImg.id = 'toast-message-object-img';
    toastMessageDivImgIcon.id = 'toast-message-object-img-icon';
    toastMessageDivValue.id = 'toast-message-object-value';
    toastMessageDivValue.innerText = 'A Notification Message';

    toastMessageDivImg.appendChild(toastMessageDivImgIcon);
    toastMessageDiv.appendChild(toastMessageDivImg);
    toastMessageDiv.appendChild(toastMessageDivValue);
    document.body.appendChild(toastMessageDiv);
}

makeObjectDivToastMessage();