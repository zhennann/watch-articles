const patterns = require('./patterns.js');
const Task = require('./task.js');

class Watch {

  allPatterns() {
    return patterns;
  }

  matchPattern(url) {
    for (const key of Object.keys(patterns)) {
      const task = new Task(patterns[key], url);
      if (task.matchUrl()) return task.pattern;
    }
    return null;
  }

  async run(article) {
    try {
      const pattern = patterns[article.pattern];
      if (!pattern) throw new Error(`pattern not found: ${article.pattern}`);

      const task = new Task(pattern, article.url);
      const ctx = await task.run();

      return { article, error: null, ctx };
    } catch (error) {
      return { article, error };
    }
  }

}

module.exports = Watch;

