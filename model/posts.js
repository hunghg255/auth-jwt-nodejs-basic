const { faker } = require('@faker-js/faker');
const tags = require('./tags');

const postDummy = {
  admin: {
    posts: new Array(30).fill(null).map((it) => ({
      id: faker.datatype.uuid(),
      title: faker.word.adjective(),
      description: faker.lorem.paragraph(),
      tags: [
        faker.helpers.arrayElement(tags),
        faker.helpers.arrayElement(tags),
      ],
    })),
    current_page: 1,
    total_page: 3,
    page_size: 10,
  },

  admin1: {
    posts: new Array(30).fill(null).map((it) => ({
      id: faker.datatype.uuid(),
      title: faker.word.adjective(),
      description: faker.lorem.paragraph(),
      tags: [
        faker.helpers.arrayElement(tags),
        faker.helpers.arrayElement(tags),
      ],
    })),
    current_page: 1,
    total_page: 3,
    page_size: 10,
  },

  admin2: {
    posts: new Array(30).fill(null).map((it) => ({
      id: faker.datatype.uuid(),
      title: faker.word.adjective(),
      description: faker.lorem.paragraph(),
      tags: [
        faker.helpers.arrayElement(tags),
        faker.helpers.arrayElement(tags),
      ],
    })),
    current_page: 1,
    total_page: 3,
    page_size: 10,
  },

  adminRefresh: {
    posts: new Array(30).fill(null).map((it) => ({
      id: faker.datatype.uuid(),
      title: faker.word.adjective(),
      description: faker.lorem.paragraph(),
      tags: [
        faker.helpers.arrayElement(tags),
        faker.helpers.arrayElement(tags),
      ],
    })),
    current_page: 1,
    total_page: 3,
    page_size: 10,
  },

  adminRefresh1: {
    posts: new Array(30).fill(null).map((it) => ({
      id: faker.datatype.uuid(),
      title: faker.word.adjective(),
      description: faker.lorem.paragraph(),
      tags: [
        faker.helpers.arrayElement(tags),
        faker.helpers.arrayElement(tags),
      ],
    })),
    current_page: 1,
    total_page: 3,
    page_size: 10,
  },

  adminRefresh2: {
    posts: new Array(30).fill(null).map((it) => ({
      id: faker.datatype.uuid(),
      title: faker.word.adjective(),
      description: faker.lorem.paragraph(),
      tags: [
        faker.helpers.arrayElement(tags),
        faker.helpers.arrayElement(tags),
      ],
    })),
    current_page: 1,
    total_page: 3,
    page_size: 10,
  },
};

module.exports = postDummy;
