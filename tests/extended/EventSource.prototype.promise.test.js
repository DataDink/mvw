require('../environment.js');

class EventTrigger extends EventTarget {
  constructor(name) {
    super();
    setTimeout(() => this.dispatchEvent(new CustomEvent(name)), 1);
  }
}

test('resolve1 reject0: resolve[0]', async () => {
  await expect((new EventTrigger('success')).promise('success'))
    .resolves.toEqual(expect.anything());
});

test('resolve2 reject0: resolve[0]', async () => {
  await expect((new EventTrigger('success')).promise(['pass', 'success']))
    .resolves.toEqual(expect.anything());
});

test('resolve2 reject0: resolve[1]', async () => {
  await expect((new EventTrigger('pass')).promise(['pass', 'success']))
    .resolves.toEqual(expect.anything());
});

test('resolve0 reject1: reject[0]', async () => {
  await expect((new EventTrigger('error')).promise(null, 'error'))
    .rejects.toEqual(expect.anything());
});

test('resolve0 reject2: reject[0]', async () => {
  await expect((new EventTrigger('error')).promise(null, ['error', 'fail']))
    .rejects.toEqual(expect.anything());
});

test('resolve0 reject2: reject[1]', async () => {
  await expect((new EventTrigger('fail')).promise(null, ['error', 'fail']))
    .rejects.toEqual(expect.anything());
});

test('resolve1 reject1: resolve[0]', async () => {
  await expect((new EventTrigger('success')).promise('success', 'error'))
    .resolves.toEqual(expect.anything());
});

test('resolve1 reject1: reject[0]', async () => {
  await expect((new EventTrigger('error')).promise('success', 'error'))
    .rejects.toEqual(expect.anything());
});

test('resolve2 reject2: resolve[1]', async () => {
  await expect((new EventTrigger('pass')).promise(['success', 'pass'], ['error', 'fail']))
    .resolves.toEqual(expect.anything());
});

test('resolve2 reject2: reject[1]', async () => {
  await expect((new EventTrigger('fail')).promise(['success', 'pass'], ['error', 'fail']))
    .rejects.toEqual(expect.anything());
});

test('resolveDefault rejectDefault: resolve', async () => {
  var key = MVW.Settings.get('successEvents')[0];
  await expect((new EventTrigger(key)).promise())
    .resolves.toEqual(expect.anything());
});

test('resolveDefault rejectDefault: reject', async () => {
  var key = MVW.Settings.get('failureEvents')[0];
  await expect((new EventTrigger(key)).promise())
    .rejects.toEqual(expect.anything());
});
