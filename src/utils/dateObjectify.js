const dateObjectify = date => {
  const dateObj = new Date(date);

  return isNaN(dateObj.getTime())
    ? null
    : dateObj
};

export default dateObjectify;