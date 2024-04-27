export const formValidation = value => {
  for (let key in value) {
    if (value[key] === '' || value[key] === null) {
      return {
        status: false,
        msg: `Please enter ${
          key.includes('_') ? key.split('_').join(' ') : key
        }`,
      };
    }
  }

  return {status: true, msg: ''};
};
