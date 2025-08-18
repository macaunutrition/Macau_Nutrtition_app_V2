import axios from 'axios';
import { APIURL } from './appConfig';

const sendPush = async (token, title, body, data = {}) => {
	try {
		if (!token) return;
		await axios.post(`${APIURL}sendpush`, {
			token,
			title,
			body,
			data,
		});
	} catch (e) {
		// Silently ignore push errors; do not block order flow
	}
};

export default sendPush;

