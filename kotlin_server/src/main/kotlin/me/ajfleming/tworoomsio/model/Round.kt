package me.ajfleming.tworoomsio.model

data class Round (
    val roundNumber: Int,
    val hostagesRequired: Int
) {
    companion object {
        fun getRoundData(numberOfPlayers: Int) : List<Round> {
            return when {
                numberOfPlayers >= 22 -> {
                    listOf(Round(1, 3), Round(2, 2), Round(1, 1))
                }
                numberOfPlayers >= 14 -> {
                    listOf(Round(1, 2), Round(2, 1), Round(3, 1))
                }
                else -> {
                    listOf(Round(1, 1), Round(2, 1), Round(3, 1))
                }
            }
        }
    }
}