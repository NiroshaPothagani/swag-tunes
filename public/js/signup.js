// import { showAlert } from "./alert.js";


const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
}



// type is 'success' or 'error'
const showAlert = (type, msg) => {
    hideAlert();
    var htmlString = `<div class= "alert alert--${type}">${msg}</div>`
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML=htmlString;
    document.querySelector('div').insertAdjacentElement('afterbegin', htmlObject)
    window.setTimeout(hideAlert, 5000);
}

// function validate(){
    
   const signup =  async (username, emailid, password, passwordConfirm) => {
        try{
            const res = await axios({
                method:'POST',
                url:"http://localhost:5000/users/signup",
                data: {
                    username,
                    emailid,
                    password,
                    passwordConfirm
                            // username: req.body.username,
                            // emailid: req.body.emailid,
                            // password:req.body.password,
                            // passwordConfirm: req.body.passwordConfirm
                }
            });
            if(res.data.status === "success") {
                showAlert('success', 'Signup Successfully!');
            //    return res.redirect(301, '../signup_success')

                window.setTimeout(() => {
                    location.assign('/index');
                },1500);

            }
        }catch(err) {
            showAlert(err.data)
            // console.log(err.response.data.message );
        }
    };
document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const emailid = document.getElementById('emailid').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(username, emailid, password, passwordConfirm);
})
// }