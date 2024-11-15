/**
 * A base type containing the fields required by all Sienar entities
 */
export type EntityBase = {
	/**
	 * The primary key of the entity
	 */
	id: string

	/**
	 * A unique value that ensures the entity is not modified concurrently
	 */
	concurrencyStamp: string
}