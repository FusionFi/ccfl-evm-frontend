export * as merge from 'lodash.merge';

export function cloneDeep(variable) {
    try {
        return JSON.parse(JSON.stringify(variable)); //deep copy
    } catch (error) {
        return null;
    }
}


