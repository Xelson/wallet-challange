export function invariant(predicate: any, errorMessage: string): asserts predicate {
	if(!predicate) throw new Error(errorMessage);
}