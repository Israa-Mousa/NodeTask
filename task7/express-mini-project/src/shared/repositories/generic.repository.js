"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericRepository = void 0;
var GenericRepository = /** @class */ (function () {
    function GenericRepository() {
        this.items = [];
    }
    GenericRepository.prototype.findAll = function () {
        return this.items;
    };
    GenericRepository.prototype.findById = function (id) {
        return this.items.find(function (item) { return item.id === id; });
    };
    GenericRepository.prototype.create = function (item) {
        this.items.push(item);
        return item;
    };
    GenericRepository.prototype.delete = function (id) {
        var index = this.items.findIndex(function (item) { return item.id === id; });
        if (index === -1)
            return false;
        this.items.splice(index, 1);
        return true;
    };
    GenericRepository.prototype.update = function (id, updatedItem) {
        var item = this.findById(id);
        if (!item)
            return undefined;
        Object.assign(item, updatedItem, { updatedAt: new Date() });
        return item;
    };
    return GenericRepository;
}());
exports.GenericRepository = GenericRepository;
