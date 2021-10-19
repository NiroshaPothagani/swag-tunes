export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
}



// type is 'success' or 'error'
export const showAlert = (type, msg) => {
    hideAlert();
    var htmlString = `<div class= "alert alert--${type}">${msg}</div>`
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML=htmlString;
    document.querySelector('div').insertAdjacentElement('afterbegin', htmlObject)
    window.setTimeout(hideAlert, 5000);
}


