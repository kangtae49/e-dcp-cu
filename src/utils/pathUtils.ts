const SEP = '\\'
const pathUtils = {
  basename: (path: string) => path.split(/[\\/]/).pop() || "",

  dirname: (path: string) => {
    const parts = path.split(SEP);
    parts.pop();
    return parts.join(SEP) || (path.startsWith(SEP) ? SEP : '.');
  },

  join: (...args: string[]) => {
    return args
      .map((part, i) => {
        if (i === 0) return part.trim().replace(/[\\/]+$/, '');
        return part.trim().replace(/^[\\/]+|[\\/]+$/g, '');
      })
      .filter(x => x.length > 0)
      .join(SEP);
  }
};

export default pathUtils;