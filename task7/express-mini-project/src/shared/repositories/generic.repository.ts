//this is for  fro memery database entity
export interface DatabaseEntity  {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GenericRepository<T extends DatabaseEntity > {
  private items: T[] = [];

  findAll(): T[] {
    return this.items;
  }

  findById(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  create(item: T): T {
    this.items.push(item);
    return item;
  }

  delete(id: string): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  update(id: string, updatedItem: Partial<T>): T | undefined {
    const item = this.findById(id);
    if (!item) return undefined;

    Object.assign(item, updatedItem, { updatedAt: new Date() });
    return item;
  }
}
