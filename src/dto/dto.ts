export abstract class Dto<T> {
    static from(data: any): Record<string, any> {
        // This should be overridden in subclasses
        throw new Error('from Method not implemented.');
    }

    static fromMany<T>(data: T[]): any[] {
        return data.map(item => this.from(item));
    }
    static toDto<T>(data: T): any {
        return this.from(data);
    }

    static toDtoArray<T>(data: T[]): any[] {
        return data.map(item => this.toDto(item));
    }

    static fromFlat<T extends Record<string, any>>(data: T): any {
        // This method should be overridden in subclasses to handle flat results
        throw new Error('fromFlat Method not implemented.');
    }

    static fromFlatMany<T extends Record<string, any>>(data: T[]): any[] {
        return data.map(item => this.fromFlat(item));
    }

    static toDtoFromFlat<T extends Record<string, any>>(data: T): any {
        return this.fromFlat(data);
    }

    static toDtoArrayFromFlat<T extends Record<string, any>>(data: T[]): any[] {
        return data.map(item => this.toDtoFromFlat(item));
    }
}