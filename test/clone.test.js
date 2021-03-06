const { string, object, integer, date, at, number } = require('../src/type')
const { T } = require('../src/proto')

// test function type
test(`clone a string`, () => {
  const t = string().length(1).optional()
  expect(t._type).toBe('String');
  expect(t._length).toBe(1);
  expect(t._optional).toBe(true);

  // clone
  const t2 = t.clone()
  expect(t2).toBeInstanceOf(T);
  expect(t2._type).toBe('String');
  expect(t2._length).toBe(1);
  expect(t2._optional).toBe(true);

  // modify
  const reg = /abc/
  t2.length(2).optional(false).pattern(reg)

  expect(t2._length).toBe(2);
  expect(t2._optional).toBe(false);
  expect(t2._pattern).toBe(reg);

  // test deep
  expect(t._type).toBe('String');
  expect(t._length).toBe(1);
  expect(t._optional).toBe(true);
});

test(`combine multi object`, () => {
  const baseSchema = object({
    id: integer(),
    name: string().min(3).max(20),
    createTime: date(),
    updateTime: date()
  })

  const postMixinSchema = object({
    content: string().min(10).max(5000)
  })

  const postSchema = object().extend(baseSchema, postMixinSchema)

  expect(postSchema._child.id).toMatchObject(baseSchema._child.id)
  expect(postSchema._child.content).toMatchObject(postMixinSchema._child.content)
});