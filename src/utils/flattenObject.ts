export function flattenObject(obj: any) {
	for (const key of Object.keys(obj)) {
		const value = obj[key]
		// проверяем, что это объект, но не массив и не null
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			// рекурсивно “сплющиваем” сначала внутренний объект
			flattenObject(value)

			// переносим его поля на уровень выше
			for (const innerKey of Object.keys(value)) {
				obj[innerKey] = value[innerKey]
			}

			// удаляем исходное свойство–объект
			delete obj[key]
		}
	}
	return obj
}
