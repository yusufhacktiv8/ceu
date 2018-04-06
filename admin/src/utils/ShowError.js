import { message } from 'antd';

export default (error) => {
  console.error(error);
  if (error.response) {
    message.error(error.response.data);
  } else {
    message.error(error.message);
  }
};
