import { Cat } from '../../domain/entity';

describe('Cat', () => {
  it('should throw an error if age is negative', () => {
    expect(
      () =>
        new Cat({
          name: 'Test',
          age: -1,
          breed: 'Test',
          createdAt: new Date().toISOString(),
        }),
    ).toThrowError('Age cannot be negative');
  });
  it('should throw an error if breed is empty', () => {
    expect(
      () =>
        new Cat({
          name: 'Test',
          age: 1,
          breed: '',
          createdAt: new Date().toISOString(),
        }),
    ).toThrowError('Breed cannot be empty');
  });
  it('should throw an error if name is empty', () => {
    expect(
      () =>
        new Cat({
          name: '',
          age: 1,
          breed: 'Test',
          createdAt: new Date().toISOString(),
        }),
    ).toThrowError('Name cannot be empty');
  });
  it('should create a new instance of Cat', () => {
    const cat = new Cat({
      name: 'Test',
      age: 1,
      breed: 'Test',
      createdAt: new Date().toISOString(),
    });
    expect(cat).toBeDefined();
    expect(cat.name).toEqual('Test');
    expect(cat.age).toEqual(1);
  });
});
