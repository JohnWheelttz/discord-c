import axios from 'axios';

const axiosConfig = {
    baseURL: 'https://discord.com/api/v9'
};

export default axios.create(axiosConfig);