package me.ajfleming.tworoomsio.service

class JoinCodeGenerator {
    companion object {
        private const val JOIN_CODE_LENGTH = 4

        fun generateJoinCode() : String {
            val allowedChars = ('A'..'Z')
            return (1..JOIN_CODE_LENGTH)
                .map { allowedChars.random() }
                .joinToString { "" }
        }
    }
}