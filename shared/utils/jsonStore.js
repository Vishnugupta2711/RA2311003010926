const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class JSONStore {
  constructor(filename) {
    this.filePath = path.join(__dirname, '../../data', `${filename}.json`);
    
    // Quick inline initialization check
    fs.mkdir(path.dirname(this.filePath), { recursive: true })
      .then(() => fs.access(this.filePath))
      .catch(() => fs.writeFile(this.filePath, '[]').catch(console.error));
  }

  async readAll() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') return [];
      throw err;
    }
  }

  async writeAll(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async insert(record) {
    const data = await this.readAll();
    const newRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...record
    };
    
    data.push(newRecord);
    await this.writeAll(data);
    return newRecord;
  }

  async findById(id) {
    const data = await this.readAll();
    return data.find(item => item.id === id) || null;
  }

  async updateById(id, updates) {
    const data = await this.readAll();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;

    data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
    await this.writeAll(data);
    
    return data[index];
  }

  async deleteById(id) {
    const data = await this.readAll();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;

    const [deleted] = data.splice(index, 1);
    await this.writeAll(data);
    return deleted;
  }
}

module.exports = JSONStore;
