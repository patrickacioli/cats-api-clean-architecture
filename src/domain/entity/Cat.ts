export class Cat {
  id?: string;
  age: number;
  breed: string;
  name: string;
  createdAt: string;

  constructor(partial: Partial<Cat>) {
    this.id = partial.id;
    this.name = partial.name;
    this.age = partial.age;
    this.breed = partial.breed;
    this.createdAt = partial.createdAt;
    this.validate();
  }

  private validate() {
    if (this.age < 0) throw new Error('Age cannot be negative');
    if (!this.breed) throw new Error('Breed cannot be empty');
    if (!this.name) throw new Error('Name cannot be empty');
  }
}
