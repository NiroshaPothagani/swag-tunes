import { showAlert } from './alert.js';



const domain = "http://localhost:5000"
const AccountData =  async (username, emailid) => {
        try{
            const res = await axios({
                method:'GET',
                url: domain+"/users/getCurrentUserData",
                data: {
                    username,
                    emailid
                }
            });
            
        }catch(err) {
            console.log(err)
        }
    };

    
   






