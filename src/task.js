const axios = require('axios');

class Task {

  constructor(pattern, url) {
    this.ctx = {
      url,
      data: {},
      stat: {},
    };
    this.pattern = pattern(this.ctx);
  }

  async run() {

    // match url first
    const articleId = this.matchUrl();
    if (!articleId) throw new Error('articleId not matched');

    // sessions
    for (const session of this.pattern.sessions) {

      const method = session.request.method;

      let url = session.request.url || this.ctx.url;
      if (typeof url === 'function') url = url();

      const responseType = session.request.responseType || 'text';
      const data = session.request.data;

      const headers = session.request.headers || {};
      if (!headers.Referer)headers.Referer = this.ctx.url;
      Object.keys(headers).forEach(key => {
        if (typeof headers[key] === 'function') headers[key] = headers[key]();
      });

      const params = session.request.params || {};
      Object.keys(params).forEach(key => {
        if (typeof params[key] === 'function') params[key] = params[key]();
      });

      const res = await axios({
        url,
        method,
        headers,
        params,
        data,
        responseType,
      });

        // failed
      if (res.status !== 200) throw new Error(`url not fetched: ${url}`);

      // match response
      if (session.response.matches) {
        session.response.matches.forEach(key => this.matchValue(this.pattern.matches[key], [ res.data ]));
      }
    }

    // ready
    return this.ctx;

  }

  matchUrl() {
    this.matchValue(this.pattern.matches.url, [ this.ctx.url ]);
    return this.ctx.data.articleId;
  }

  matchValue(match, values) {
    // match value
    const value = match.index >= 0 ? values[match.index] : values[0];

    // save to data
    if (match.data) this.ctx.data[match.data] = value;
    // save to stat
    if (match.stat) this.ctx.stat[match.stat] = value;

    // onMatch exists
    if (match.onMatch) return match.onMatch(value);

    // regex exists
    if (match.regex) {
      const res = match.regex.exec(value);
      if (res && match.matchPass) {
        this.matchValues(match.matchPass, res);
      }
      if (!res && match.matchFail) {
        this.matchValues(match.matchFail, [ value ]);
      }
    }

  }

  matchValues(matches, values) {
    matches.forEach(match => this.matchValue(match, values));
  }

}

module.exports = Task;

