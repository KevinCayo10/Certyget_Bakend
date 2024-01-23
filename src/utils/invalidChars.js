const replaceInvalidChars = (str) => {
  // Reemplaza espacios y dos puntos con guiones bajos
  return str.replace(/[\s:]/g, "_");
};

module.exports = {
  replaceInvalidChars,
};
