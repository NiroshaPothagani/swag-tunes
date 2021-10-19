import { login, logout } from './login';
import { updateData } from './updatedSettings';
import { AccountData } from './account.js';
import e from 'express';

//DOM ELEMENTS
const loginForm = document.querySelector('.form');
const logOutbtn = document.querySelector('.dropdown-item.logout');
const userDataForm = document.querySelector('.form-user-data');
const accountForm = document.querySelector('.form-user-data');


//DELEGATION
if(loginForm)
  loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const emailid = document.getElementById('emailid').value;
      const password = document.getElementById('password').value;
      login(emailid, password);
  });
  
if (logOutbtn) logOutbtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const emailid = document.getElementById('emailid').value;
    updateData(username, emailid);
  });


  if(accountForm)
  accountForm.addEventListener('onClick', e => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const emailid = document.getElementById('emailid').value;


      AccountData(username, emailid);
  });