export function invariant(predicate: boolean, errorMessage: string): asserts predicate {
	if(!predicate) throw new Error(errorMessage);
}