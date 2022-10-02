const { faker } = require('@faker-js/faker');

const galleries = [
  {
    id: faker.datatype.uuid(),
    imageUrl: 'https://source.unsplash.com/collection/1758353/800x350/?sig=1',
  },
  {
    id: faker.datatype.uuid(),
    imageUrl: 'https://source.unsplash.com/collection/1758353/800x350/?sig=2',
  },
  {
    id: faker.datatype.uuid(),
    imageUrl: 'https://source.unsplash.com/collection/1758353/800x350/?sig=3',
  },
  {
    id: faker.datatype.uuid(),
    imageUrl: 'https://source.unsplash.com/collection/1758353/800x350/?sig=4',
  },
  {
    id: faker.datatype.uuid(),
    imageUrl: 'https://source.unsplash.com/collection/1758353/800x350/?sig=5',
  },
];

module.exports = galleries;
