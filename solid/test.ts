function isType<T>(value: any, type: new () => T): value is T {
    console.log(type)
    console.log("\n")
    console.log(typeof(type))
    console.log("\n")

	return value instanceof type;
}

console.log(isType(1, String))