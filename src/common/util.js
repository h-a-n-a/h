export function isUndef (v) {
	return v === undefined || v === null
}

export function isDef (v) {
	return v !== undefined && v !== null
}

export function isTrue (v) {
	return v === true
}

export function isFalse (v) {
	return v === false
}

/**
 * Check if value if object.
 */
export function isObject (v) {
	return v !== null && typeof v === 'object'
}

/**
 * Check if value is primitive.
 */
export function isPrimitive (v) {
	return (
		typeof v === 'string' ||
		typeof v === 'number' ||
		typeof v === 'boolean' ||
		typeof v === 'symbol'
	)
}

/**
 * Clone an object.
 */
export function cloneObject (o) {
	if (Array.isArray(o)) {
		return o.map(cloneObject)
	} else if (isObject(o)) {
		const obj = {}
		for (const el in o) {
			obj[el] = cloneObject(o[el])
		}
		return obj
	} else {
		return o
	}
}

/**
 * Check if two objects are same.
 */
export function isObjectEqual (o1, o2) {
	// handle same object, null and undefined
	if (o1 === o2) return true

	const k1 = Object.keys(o1)
	const k2 = Object.keys(o2)
	if (k1.length !== k2.length) return false

	return k1.every(key => {
		const v1 = o1[key]
		const v2 = o2[key]

		if (isObject(v1) && isObject(v2)) {
			return isObjectEqual(v1, v2)
		} else {
			return v1 === v2
		}
	})
}
