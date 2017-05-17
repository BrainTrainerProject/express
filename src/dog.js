class Dog {
  constructor(name) {
    this.name = name;
    this.blatter = true;
  }

  bark() {
    return `Wah wah, I am ${this.name}`;
  }

  pee() {
    return this.blatter;
  }
}

export default Dog;
