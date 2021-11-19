package me.ajfleming.tworoomsio.service

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

internal class JoinCodeGeneratorTest {

    @Test
    fun `Test Code Generation` () {
        print(JoinCodeGenerator.generateJoinCode())
    }
}