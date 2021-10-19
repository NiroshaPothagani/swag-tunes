import axios from 'axios';
import { showAlert } from './alert.js';

export const updateData = async(username, emailid) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:5000/users/updateMe',
            data: {
                username,
                emailid
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Data updated successfully!')
        }

    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}