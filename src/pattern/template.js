
/**
 *  ctx.url
 *  ctx.data
 *  ctx.stat
 */

module.exports = ctx => {

  return {
    meta: {
      name: '',
      version: '1.0.0',
      description: '',
      author: '',
      test: '',
    },
    sessions: [
      {
        request: {
          method: 'get',
          url: ctx.url,
          responseType: 'text', // text or json
          data: {},
          headers: {
            Referer: '',
          },
          params: {},
        },
        response: {
          matches: [ 'stat' ],
        },
      },
    ],
    matches: {
      url: {
        onMatch: () => {},
        regex: / /gi,
        matchPass: [
          {
            index: 1,
            data: 'articleId',
          },
        ],
        matchFail: [
          {
            index: 0,
            data: 'articleId',
          },
        ],
      },
      stat: {
        onMatch: () => {},
        regex: / /gi,
        matchPass: [
          {
            index: 1,
            data: 'title',
          },
        ],
        matchFail: [
          {
            index: 0,
            data: 'title',
          },
        ],
      },
    },
  };

};
