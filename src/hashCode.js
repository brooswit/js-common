function hashCode(str) {
    var hash = 0, index, character;
    if (str.length === 0) return hash;
    for (index = 0; index < str.length; index++) {
      character   = str.charCodeAt(index);
      hash  = ((hash << 5) - hash) + character;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
};